<script setup lang="ts">
import { useRankStore } from '../stores/rankStore'
import type { Tier, RankItem } from '../stores/rankStore'
import Rank from '../components/Rank.vue'
import SvgIcon from '../components/SvgIcon.vue'

const store = useRankStore()

// Emits
const emit = defineEmits<{
  'edit-title': []
  'edit-tier': [tier: Tier]
  'delete-tier': [tierId: string]
  'update-tier-items': [tierId: string, items: RankItem[]]
}>()
</script>

<template>
  <!-- 主内容区 -->
  <main class="flex-1 flex min-h-[calc(100vh-200px)] p-5">
    <!-- 排行榜区域 -->
    <section class="flex-1 min-w-0 w-full">
      <div class="mb-5">
        <h1 class="text-white text-3xl md:text-2xl font-bold m-0 cursor-pointer px-4 py-2 rounded-lg transition-colors duration-300 text-center hover:bg-blue-500/10" @click="emit('edit-title')">{{ store.pageTitle }}</h1>
      </div>
      
      <div class="flex flex-col gap-2">
        <Rank
          v-for="tier in store.currentTiers"
          :key="tier.id"
          :tier="tier"
          :can-edit="store.currentTemplate === 'custom'"
          :show-item-names="store.showItemNames"
          @edit-tier="emit('edit-tier', $event)"
          @delete-tier="emit('delete-tier', $event)"
          @update-items="(tierId, items) => emit('update-tier-items', tierId, items)"
        />
      </div>
      
      <div v-if="store.currentTiers.length === 0" class="text-center py-15 px-5 text-gray-500 bg-gray-800 rounded-xl border-2 border-dashed border-gray-600">
        <div class="text-6xl mb-4 opacity-60 flex justify-center">
          <SvgIcon name="trophy" :size="64" class="text-gray-500" />
        </div>
        <div class="text-lg font-medium mb-2">还没有等级</div>
        <div class="text-sm opacity-80">
          {{ store.currentTemplate === 'custom' ? '使用右侧面板添加等级' : '请选择其他排行模式' }}
        </div>
      </div>
    </section>
  </main>
</template>

