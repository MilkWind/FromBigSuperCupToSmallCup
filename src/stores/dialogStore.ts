import {ref} from 'vue'
import {defineStore} from 'pinia'

export interface DialogConfig {
    id: string
    type: 'alert' | 'confirm' | 'prompt'
    title?: string
    message: string
    defaultValue?: string
    resolve: (value: any) => void
    reject?: (reason?: any) => void
}

export const useDialogStore = defineStore('dialog', () => {
    const dialogs = ref<DialogConfig[]>([])

    function showAlert(message: string, title?: string): Promise<void> {
        return new Promise((resolve) => {
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
            dialogs.value.push({
                id, type: 'alert', title, message, resolve
            })
        })
    }

    function showConfirm(message: string, title?: string): Promise<boolean> {
        return new Promise((resolve) => {
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
            dialogs.value.push({
                id, type: 'confirm', title, message, resolve
            })
        })
    }

    function showPrompt(message: string, defaultValue?: string, title?: string): Promise<string | null> {
        return new Promise((resolve) => {
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
            dialogs.value.push({
                id, type: 'prompt', title, message, defaultValue, resolve
            })
        })
    }

    function closeDialog(id: string, result?: any) {
        const index = dialogs.value.findIndex(d => d.id === id)
        if (index !== -1) {
            const dialog = dialogs.value[index]
            dialogs.value.splice(index, 1)
            if (dialog) {
                dialog.resolve(result)
            }
        }
    }

    return {
        dialogs, showAlert, showConfirm, showPrompt, closeDialog
    }
})
