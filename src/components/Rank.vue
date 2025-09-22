<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {VueDraggable} from 'vue-draggable-plus'
import type {RankItem, Tier} from '../stores/rankStore'
import {useDialogStore} from '../stores/dialogStore'

interface Props {
  tier: Tier
  canEdit?: boolean
  showItemNames?: boolean
}

interface Emits {
  editTier: [tier: Tier]
  deleteTier: [tierId: string]
  updateItems: [tierId: string, items: RankItem[]]
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  showItemNames: true
})

const emit = defineEmits<Emits>()
const dialogStore = useDialogStore()

const localItems = ref<RankItem[]>([...props.tier.items])

watch(() => props.tier.items, (newItems) => {
  if (JSON.stringify(newItems) !== JSON.stringify(localItems.value)) {
    localItems.value = [...newItems]
  }
}, {deep: true})

watch(localItems, (newItems) => {
  if (JSON.stringify(newItems) !== JSON.stringify(props.tier.items)) {
    // console.log(`Tier ${props.tier.name} items changed:`, newItems)
    emit('updateItems', props.tier.id, [...newItems])
  }
}, {deep: true})


const tierStyle = computed(() => ({
  backgroundColor: props.tier.color,
  color: getContrastColor(props.tier.color)
}))

// Calculate contrast text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove # symbol
  const hex = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? '#000' : '#fff'
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = '/placeholder.svg'
  }
}

function handleEditTier() {
  emit('editTier', props.tier)
}

async function handleDeleteTier() {
  const confirmed = await dialogStore.showConfirm(`确定要删除等级"${props.tier.name}"吗？`, '删除等级')
  if (confirmed) {
    emit('deleteTier', props.tier.id)
  }
}
</script>

<template>
  <div class="border border-gray-600 rounded-md overflow-hidden mb-1.5 bg-gray-800 flex min-h-[60px]">
    <div
        :style="tierStyle"
        class="flex items-center justify-center px-3 py-2 min-w-[120px] max-w-[120px] font-semibold text-sm relative flex-shrink-0 group">
      <div class="text-center w-full">{{ tier.name }}</div>
      <div v-if="canEdit"
           class="absolute top-1 right-1 flex gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
            class="w-5 h-5 border-none rounded cursor-pointer text-[10px] flex items-center justify-center bg-green-500 text-white"
            title="编辑等级"
            @click="handleEditTier"
        >
          ⚙
        </button>
        <button
            class="w-5 h-5 border-none rounded cursor-pointer text-[10px] flex items-center justify-center bg-red-500 text-white"
            title="删除等级"
            @click="handleDeleteTier"
        >
          ×
        </button>
      </div>
    </div>

    <div class="flex-1 min-h-[60px] p-2 border-l border-gray-600 bg-gray-700 flex items-center">
      <VueDraggable
          v-model="localItems"
          :animation="200"
          chosen-class="drag-chosen"
          class="flex flex-wrap gap-1.5 w-full min-h-[48px]"
          drag-class="drag-drag"
          ghost-class="drag-ghost"
          group="items"
      >
        <div
            v-for="item in localItems"
            :key="item.id"
            :data-item-id="item.id"
            :data-source="'tier'"
            :data-tier-id="tier.id"
            class="relative w-12 h-12 border-2 border-gray-500 rounded overflow-hidden cursor-grab bg-gray-600 transition-all duration-200 flex-shrink-0 hover:border-blue-500 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/30 active:cursor-grabbing"
        >
          <img
              v-if="item.image"
              :alt="item.name"
              :src="item.image"
              class="w-full h-full object-cover block"
              @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-xl text-gray-500">
            📄
          </div>
          <span
              v-if="showItemNames"
              :title="item.name"
              class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[9px] text-center px-0.5 py-px whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ item.name }}
          </span>
        </div>
      </VueDraggable>
    </div>
  </div>
</template>
