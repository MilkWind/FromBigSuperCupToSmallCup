<script lang="ts" setup>
import {ref, watch} from 'vue'
import {VueDraggable} from 'vue-draggable-plus'
import SvgIcon from './SvgIcon.vue'
import type {RankItem} from '../stores/rankStore'

interface Emits {
  deleteItem: [itemId: string]
  deleteItemByName: [itemName: string]
  removeFromTier: [tierId: string, itemId: string]
  deleteCompletely: [itemId: string]
}

const emit = defineEmits<Emits>()

const dragOver = ref(false)
const deleteItems = ref<RankItem[]>([])

// Watch for changes in deleteItems and handle deletion
watch(deleteItems, (newItems) => {
  if (newItems.length > 0) {
    console.log('Delete zone model updated with items:', newItems)
    // Delete all items that were added
    newItems.forEach(item => {
      if (item && item.id) {
        console.log('Deleting item from model watch:', item.id)
        emit('deleteItem', item.id)
      }
    })
    // Clear the delete zone
    deleteItems.value = []
  }
}, {deep: true})

function handleAdd(event: any) {
  console.log('Delete zone received item:', event)

  const domElement = event.item || event.clone
  if (domElement) {
    console.log('DOM element:', domElement)

    let itemId = null

    if (domElement.__vnode) {
      const vnode = domElement.__vnode
      console.log('VNode:', vnode)
      itemId = vnode.key
    }

    if (itemId) {
      emit('deleteItem', itemId)
    }
  }

  // Remove the item from the delete zone immediately
  deleteItems.value = []
  dragOver.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false
  
  try {
    const dragDataStr = event.dataTransfer?.getData('text/plain')
    if (dragDataStr) {
      console.log('Delete zone received drag data:', dragDataStr)
      const dragData = JSON.parse(dragDataStr)
      
      if (dragData.source === 'tier') {
        // Item dragged from a tier - only remove from that tier
        console.log('Removing item from tier:', dragData.tierId, dragData.item.id)
        emit('removeFromTier', dragData.tierId, dragData.item.id)
      } else if (dragData.source === 'library') {
        // Item dragged from library - delete completely
        console.log('Deleting item completely:', dragData.item.id)
        emit('deleteCompletely', dragData.item.id)
      } else {
        // Fallback for legacy drag data format
        console.log('Using fallback deletion for item:', dragData.id || dragData.item?.id)
        emit('deleteItem', dragData.id || dragData.item?.id)
      }
    }
  } catch (error) {
    console.error('Failed to parse drag data:', error)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

</script>

<template>
  <VueDraggable
      v-model="deleteItems"
      :animation="200"
      :class="{ 'bg-red-700 border-white shadow-2xl shadow-red-600/60 scale-105': dragOver }"
      class="delete-zone p-4 bg-red-600 text-white text-center rounded-lg flex flex-col items-center justify-center transition-all duration-300 border-2 border-dashed border-transparent cursor-default md:min-h-20 md:p-4"
      group="items"
      @add="handleAdd"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
  >
    <div class="text-2xl mb-1.5 drop-shadow-md">
      <SvgIcon :size="32" class="text-white" name="trash"/>
    </div>
    <div :class="{ 'animate-pulse': dragOver }" class="text-sm md:text-xs font-semibold leading-snug"
         style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)">
      {{ dragOver ? '松开删除素材' : '拖到这里删除' }}
    </div>
  </VueDraggable>
</template>

<style scoped>
@keyframes pulse {
  from {
    opacity: 0.8;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 0.6s infinite alternate;
}

.delete-zone img {
  position: absolute;
}
</style>