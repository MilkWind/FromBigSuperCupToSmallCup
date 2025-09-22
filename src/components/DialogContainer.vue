<script lang="ts" setup>
import {ref} from 'vue'
import type {DialogConfig} from '../stores/dialogStore'
import {useDialogStore} from '../stores/dialogStore'

const dialogStore = useDialogStore()

const inputValue = ref('')

function handleAlertOk(dialog: DialogConfig) {
  dialogStore.closeDialog(dialog.id)
}

function handleConfirmYes(dialog: DialogConfig) {
  dialogStore.closeDialog(dialog.id, true)
}

function handleConfirmNo(dialog: DialogConfig) {
  dialogStore.closeDialog(dialog.id, false)
}

function handlePromptOk(dialog: DialogConfig) {
  dialogStore.closeDialog(dialog.id, inputValue.value.trim() || null)
}

function handlePromptCancel(dialog: DialogConfig) {
  dialogStore.closeDialog(dialog.id, null)
}

function handleDialogOpen(dialog: DialogConfig) {
  if (dialog.type === 'prompt') {
    inputValue.value = dialog.defaultValue || ''
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-for="dialog in dialogStore.dialogs" :key="dialog.id">
      <Transition appear name="fade" @after-enter="handleDialogOpen(dialog)">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1001]">
          <div class="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
            <!-- Header -->
            <div v-if="dialog.title" class="mb-4">
              <h3 class="text-lg font-semibold text-white">{{ dialog.title }}</h3>
            </div>

            <!-- Message -->
            <div class="mb-6">
              <p class="text-gray-300 whitespace-pre-line">{{ dialog.message }}</p>
            </div>

            <!-- Prompt Input -->
            <div v-if="dialog.type === 'prompt'" class="mb-6">
              <input
                  v-model="inputValue"
                  :placeholder="dialog.message"
                  autofocus
                  class="w-full px-3 py-2.5 border border-gray-600 rounded-md bg-gray-700 text-white text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-500"
                  type="text"
                  @keyup.enter="handlePromptOk(dialog)"
                  @keyup.escape="handlePromptCancel(dialog)"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-2.5">
              <!-- Alert Dialog -->
              <template v-if="dialog.type === 'alert'">
                <button
                    autofocus
                    class="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                    @click="handleAlertOk(dialog)"
                >
                  确定
                </button>
              </template>

              <!-- Confirm Dialog -->
              <template v-if="dialog.type === 'confirm'">
                <button
                    class="bg-gray-600 hover:bg-gray-700 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                    @click="handleConfirmNo(dialog)"
                >
                  取消
                </button>
                <button
                    autofocus
                    class="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                    @click="handleConfirmYes(dialog)"
                >
                  确定
                </button>
              </template>

              <!-- Prompt Dialog -->
              <template v-if="dialog.type === 'prompt'">
                <button
                    class="bg-gray-600 hover:bg-gray-700 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                    @click="handlePromptCancel(dialog)"
                >
                  取消
                </button>
                <button
                    class="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                    @click="handlePromptOk(dialog)"
                >
                  确定
                </button>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
