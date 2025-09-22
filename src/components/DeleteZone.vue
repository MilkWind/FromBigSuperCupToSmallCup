<script lang="ts" setup>
import {ref} from 'vue'
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

function handleAdd(event: any) {
  // console.log('Delete zone received item:', event)

  const domElement = event.item || event.clone
  if (domElement) {
    // console.log('DOM element:', domElement)

    // Get source information from custom data attributes
    const source = domElement.dataset.source
    const itemId = domElement.dataset.itemId
    const tierId = domElement.dataset.tierId

    // console.log('Item source:', source, 'itemId:', itemId, 'tierId:', tierId)

    if (itemId) {
      if (source === 'tier' && tierId) {
        // console.log('Removing item from tier via handleAdd:', tierId, itemId)
        emit('removeFromTier', tierId, itemId)
      } else if (source === 'library') {
        // console.log('Deleting item completely via handleAdd:', itemId)
        emit('deleteCompletely', itemId)
      } else {
        // Fallback to complete deletion if source is unclear
        // console.log('Unknown source, deleting item completely:', itemId)
        emit('deleteCompletely', itemId)
      }
    }
  }

  // Remove the item from the delete zone immediately
  deleteItems.value = []
  dragOver.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false
  
  // The handleDrop function is mainly for handling file drops
  // The drag and drop of items is handled by handleAdd function
  // console.log('HandleDrop called - this is typically for file drops')
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