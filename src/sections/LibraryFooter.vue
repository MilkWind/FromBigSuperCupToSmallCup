<script setup lang="ts">
import type { RankItem } from '../stores/rankStore'
import Library from '../components/Library.vue'
import DeleteZone from '../components/DeleteZone.vue'

// Props
interface Props {
  library: RankItem[]
  showItemNames: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update-library': [items: RankItem[]]
  'add-library-item': [item: RankItem]
  'delete-item': [itemId: string]
  'remove-from-tier': [tierId: string, itemId: string]
  'delete-completely': [itemId: string]
}>()
</script>

<template>
  <!-- 底部固钉素材库和删除区域 -->
  <footer class="fixed bottom-5 left-5 right-5 p-4 rounded-2xl  bg-gray-800/[0.98] backdrop-blur-md border-t border-gray-600 z-[100] shadow-2xl shadow-black/30">
    <div class="flex gap-3">
      <div class="flex-1">
        <Library
          :items="props.library"
          :show-item-names="props.showItemNames"
          @update-items="emit('update-library', $event)"
          @add-item="emit('add-library-item', $event)"
        />
      </div>
      <div class="flex-shrink-0 flex">
        <DeleteZone 
          @delete-item="emit('delete-item', $event)"
          @remove-from-tier="(tierId, itemId) => emit('remove-from-tier', tierId, itemId)"
          @delete-completely="emit('delete-completely', $event)"
        />
      </div>
    </div>
  </footer>
</template>

