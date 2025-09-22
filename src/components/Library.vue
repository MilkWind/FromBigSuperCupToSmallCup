<script lang="ts" setup>
import {computed, ref} from 'vue'
import {VueDraggable} from 'vue-draggable-plus'
import type {RankItem} from '../stores/rankStore'
import {useDialogStore} from '../stores/dialogStore'

interface Props {
  items: RankItem[]
  showItemNames?: boolean
}

interface Emits {
  updateItems: [items: RankItem[]]
  addItem: [item: RankItem]
  editItem: [item: RankItem]
  deleteItem: [itemId: string]
}

const props = withDefaults(defineProps<Props>(), {
  showItemNames: true
})

const emit = defineEmits<Emits>()
const dialogStore = useDialogStore()

const fileInput = ref<HTMLInputElement>()
const dragOver = ref(false)

const localItems = computed({
  get: () => props.items,
  set: (value) => emit('updateItems', value)
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(Array.from(target.files))
    target.value = '' // 清空input，允许重复选择同一文件
  }
}

function handleFiles(files: File[]) {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const fileName = file.name.replace(/\.[^/.]+$/, '') // 移除扩展名
      processImageFile(file, fileName)
    }
  })
}

function processImageFile(file: File, fileName: string) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      // Create a canvas to compress images
      const canvas = document.createElement('canvas')
      let {width, height} = img
      const maxSize = 200

      // Keep aspect ratio
      if (width > height && width > maxSize) {
        height = Math.round(height * (maxSize / width))
        width = maxSize
      } else if (height > maxSize) {
        width = Math.round(width * (maxSize / height))
        height = maxSize
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        const resizedImage = canvas.toDataURL('image/jpeg', 0.7)

        const newItem: RankItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: fileName,
          image: resizedImage
        }

        emit('addItem', newItem)
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false

  if (event.dataTransfer?.files) {
    handleFiles(Array.from(event.dataTransfer.files))
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer?.types.includes('Files')) {
    dragOver.value = true
  }
}

function handleDragLeave() {
  dragOver.value = false
}

async function handleItemDoubleClick(item: RankItem) {
  const newName = await dialogStore.showPrompt('请输入素材名称：', item.name, '编辑素材')
  if (newName !== null && newName.trim()) {
    emit('editItem', {...item, name: newName.trim()})
  }
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
  }
}

function openFileDialog() {
  fileInput.value?.click()
}

function handleChange(event: any) {
  // Handle any changes to the library items
  // console.log('Library change event:', event)
  if (event.removed) {
    // console.log('Item removed from library:', event.removed.element)
    // The localItems computed property will automatically emit the update
  }
}

</script>

<template>
  <div
      :class="{ 'border-blue-500 bg-blue-500/10': dragOver }"
      class="flex flex-wrap gap-2 border border-dashed border-gray-500 rounded-md p-3 bg-gray-700/80 transition-all duration-300 overflow-y-auto h-full"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
  >
    <VueDraggable
        v-model="localItems"
        :animation="200"
        :group="{ name: 'items', pull: 'clone', put: false }"
        :sort="false"
        chosen-class="drag-chosen"
        class="flex flex-wrap gap-2 library-container"
        drag-class="drag-drag"
        ghost-class="drag-ghost"
        @change="handleChange"
    >
      <div
          v-for="item in items"
          :key="item.id"
          :data-item-id="item.id"
          :data-source="'library'"
          class="relative w-[48px] h-[48px] border-2 border-gray-500 rounded-md overflow-hidden cursor-grab bg-gray-600 transition-all duration-200 flex-shrink-0 hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:cursor-grabbing"
          @dblclick="handleItemDoubleClick(item)"
      >
        <img
            v-if="item.image"
            :alt="item.name"
            :src="item.image"
            class="w-full h-full object-cover block"
            @error="handleImageError"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-2xl text-gray-500">
          📄
        </div>
        <span
            v-if="showItemNames"
            :title="item.name"
            class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] text-center px-1 py-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
        >
            {{ item.name }}
          </span>
      </div>


    </VueDraggable>
    <!-- Add materials button -->
    <div
        class="flex flex-col justify-center items-center w-[48px] h-[48px] border-2 border-gray-500 rounded-md overflow-hidden cursor-pointer bg-gray-600 transition-all duration-200 flex-shrink-0"
        @click="openFileDialog"
    >
          <span class="text-[15px]">
            +
          </span>
      <span class="text-[10px]">添加素材</span>
    </div>
  </div>

  <!-- hidden - file input -->
  <input
      ref="fileInput"
      accept="image/*"
      class="hidden"
      multiple
      type="file"
      @change="handleFileSelect"
  />
</template>
