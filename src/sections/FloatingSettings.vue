<script setup lang="ts">
// removed unused computed import
import { ref } from 'vue'
import { useRankStore } from '../stores/rankStore'
import SvgIcon from '../components/SvgIcon.vue'

const store = useRankStore()

// Collapsible state
const isCollapsed = ref(false)

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
}

// Props
interface Props {
  showHelp: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:showHelp': [value: boolean]
  'edit-title': []
  'reset-ranking': []
  'toggle-item-names': []
  'template-change': [event: Event]
  'add-new-tier': []
  'save-template': []
  'delete-template': []
  'export-data': []
  'import-data': []
}>()

// 计算属性 - removed unused currentTemplateName

// 方法
function handleTemplateChange(event: Event) {
  emit('template-change', event)
}

function handleShowHelp() {
  emit('update:showHelp', true)
}
</script>

<template>
  <!-- 浮动设置面板 -->
  <aside class="fixed top-5 right-5 z-[1000]">
    <div class="bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-xl shadow-2xl shadow-black/30 xl:bg-gray-800 transition-all duration-300" :class="isCollapsed ? 'p-2' : 'p-4 min-w-[200px]'">
      <!-- Toggle Button -->
      <button 
        @click="toggleCollapsed"
        class="absolute -left-3 top-3 w-6 h-6 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-full flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110"
        :title="isCollapsed ? '展开设置面板' : '收起设置面板'"
      >
        <SvgIcon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" :size="12" />
      </button>
      
      <!-- Panel Content - Only show when not collapsed -->
      <div v-if="!isCollapsed" class="panel-content">
      <div class="mb-3 last:mb-0">
        <label class="block text-gray-300 text-xs font-medium mb-1.5">模式</label>
        <select 
          :value="store.currentTemplate" 
          class="w-full bg-gray-700 text-white border border-gray-500 rounded-md px-2 py-1.5 text-xs outline-none focus:border-blue-500"
          @change="handleTemplateChange"
        >
          <option 
            v-for="template in store.templates" 
            :key="template.id" 
            :value="template.id"
          >
            {{ template.name }}
          </option>
          <option value="custom">自定义</option>
        </select>
      </div>
      
      <div class="grid grid-cols-3 md:grid-cols-2 gap-1.5 mb-3">
        <button 
          class="bg-gray-600 text-white border-none rounded-md p-2 cursor-pointer text-sm transition-all duration-200 flex items-center justify-center min-h-8 hover:bg-gray-500 hover:-translate-y-px" 
          @click="emit('toggle-item-names')" 
          :title="store.showItemNames ? '隐藏名称' : '显示名称'"
        >
          <SvgIcon :name="store.showItemNames ? 'eye' : 'eye-off'" :size="16" />
        </button>
        <button class="bg-gray-600 text-white border-none rounded-md p-2 cursor-pointer text-sm transition-all duration-200 flex items-center justify-center min-h-8 hover:bg-gray-500 hover:-translate-y-px" @click="emit('edit-title')" title="编辑标题">
          <SvgIcon name="edit" :size="16" />
        </button>
        <button class="bg-red-500 hover:bg-red-600 text-white border-none rounded-md p-2 cursor-pointer text-sm transition-all duration-200 flex items-center justify-center min-h-8 hover:-translate-y-px" @click="emit('reset-ranking')" title="重置数据">
          <SvgIcon name="refresh" :size="16" />
        </button>
        <button class="bg-gray-600 text-white border-none rounded-md p-2 cursor-pointer text-sm transition-all duration-200 flex items-center justify-center min-h-8 hover:bg-gray-500 hover:-translate-y-px" @click="handleShowHelp" title="使用说明">
          <SvgIcon name="help" :size="16" />
        </button>
        <button class="bg-gray-600 text-white border-none rounded-md p-2 cursor-pointer text-sm transition-all duration-200 flex items-center justify-center min-h-8 hover:bg-gray-500 hover:-translate-y-px" @click="emit('export-data')" title="导出数据">
          <SvgIcon name="save" :size="16" />
        </button>
        <button class="bg-gray-600 text-white border-none rounded-md p-2 cursor-pointer text-sm transition-all duration-200 flex items-center justify-center min-h-8 hover:bg-gray-500 hover:-translate-y-px" @click="emit('import-data')" title="导入数据">
          <SvgIcon name="folder" :size="16" />
        </button>
      </div>
      
      <div v-if="store.currentTemplate === 'custom'" class="mb-3 last:mb-0">
        <button class="bg-green-500 text-white hover:bg-green-600 px-3 py-1.5 text-xs border-none rounded cursor-pointer transition-colors duration-200 mb-1.5 w-full" @click="emit('add-new-tier')">
          + 添加等级
        </button>
        <button 
          class="flex justify-center bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed px-3 py-1.5 text-xs border-none rounded cursor-pointer transition-colors duration-200 mb-1.5 w-full"
          @click="emit('save-template')"
          :disabled="store.customTiers.length === 0"
          title="保存当前自定义等级为模板"
        >
          <SvgIcon name="save" :size="14" class="mr-1" /> 保存模板
        </button>
      </div>
      
      <div v-if="store.currentTemplate.startsWith('custom-')" class="mb-3 last:mb-0">
        <button 
          class="flex justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs border-none rounded cursor-pointer transition-colors duration-200 mb-1.5 w-full"
          @click="emit('delete-template')"
          title="删除当前自定义模板"
        >
          <SvgIcon name="trash" :size="14" class="mr-1" /> 删除模板
        </button>
      </div>
      </div>
      
      <!-- Collapsed State - Show minimal info when collapsed -->
      <div v-else class="collapsed-content flex flex-col items-center gap-1 pt-6">
        <div class="text-xs text-gray-400 text-center">设置</div>
        <div class="w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>
      </div>
    </div>
  </aside>
</template>

