<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Tier } from '../stores/rankStore'

interface Props {
  show: boolean
  tier?: Tier
  isNew?: boolean
}

interface Emits {
  close: []
  save: [tier: Partial<Tier>]
}

const props = withDefaults(defineProps<Props>(), {
  isNew: false
})

const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  color: '#3c9cff'
})

watch(() => props.show, (show) => {
  if (show) {
    if (props.tier) {
      form.value.name = props.tier.name
      form.value.color = props.tier.color
    } else {
      form.value.name = ''
      form.value.color = '#3c9cff'
    }
  }
})

function handleClose() {
  emit('close')
}

function handleSave() {
  if (!form.value.name.trim()) {
    alert('请输入等级名称')
    return
  }

  const tierData: Partial<Tier> = {
    name: form.value.name.trim(),
    color: form.value.color
  }

  if (props.isNew) {
    tierData.id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  emit('save', tierData)
}

function updateColorText(colorValue: string) {
  form.value.color = colorValue
}

function updateColorPicker(textValue: string) {
  if (/^#[0-9A-F]{6}$/i.test(textValue)) {
    form.value.color = textValue
  } else {
    alert('请输入有效的颜色代码，例如 #FF0000')
  }
}

// Calculate contrast text color based on background color
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000' : '#fff'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]" @click.self="handleClose">
        <div class="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-[90vw] max-h-[90vh] overflow-y-auto relative md:p-4 md:m-5">
          <div class="flex justify-between items-center mb-5 pb-2.5 border-b border-gray-600">
            <h3 class="text-lg font-semibold text-white">
              {{ isNew ? '添加等级' : '编辑等级' }}
            </h3>
            <button class="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded transition-all duration-200 hover:bg-gray-600 hover:text-white" @click="handleClose">
              ×
            </button>
          </div>

          <div class="mb-5">
            <div class="mb-4">
              <label class="block mb-1.5 font-medium text-gray-300">等级名称</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-600 rounded-md bg-gray-700 text-white text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-500"
                placeholder="请输入等级名称"
                @keyup.enter="handleSave"
              />
            </div>

            <div class="mb-4">
              <label class="block mb-1.5 font-medium text-gray-300">背景颜色</label>
              <div class="flex items-center gap-3">
                <input
                  :value="form.color"
                  type="color"
                  class="w-10 h-10 p-0 border-none rounded-md cursor-pointer flex-shrink-0"
                  @input="updateColorText(($event.target as HTMLInputElement)?.value || '#3c9cff')"
                />
                <input
                  v-model="form.color"
                  type="text"
                  class="w-full px-3 py-2.5 border border-gray-600 rounded-md bg-gray-700 text-white text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-500"
                  placeholder="#RRGGBB"
                  @change="updateColorPicker(form.color)"
                />
              </div>
            </div>

            <div class="mt-4 p-3 rounded-md text-center font-semibold border border-gray-600" :style="{ backgroundColor: form.color }">
              <span class="text-sm" :style="{ color: getContrastColor(form.color) }">
                {{ form.name || '预览' }}
              </span>
            </div>
          </div>

          <div class="flex justify-end gap-2.5 pt-2.5 border-t border-gray-600">
            <button class="bg-blue-500 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 inline-flex items-center gap-1 hover:bg-blue-600 hover:-translate-y-px active:translate-y-0" @click="handleClose">
              取消
            </button>
            <button class="bg-green-500 hover:bg-green-600 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 inline-flex items-center gap-1 hover:-translate-y-px active:translate-y-0" @click="handleSave">
              {{ isNew ? '添加' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>


