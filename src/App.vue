<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import type {RankItem, Tier} from './stores/rankStore'
import {useRankStore} from './stores/rankStore'
import {useDialogStore} from './stores/dialogStore'
import TierEditModal from './components/TierEditModal.vue'
import HelpModal from './components/HelpModal.vue'
import DialogContainer from './components/DialogContainer.vue'
import FloatingSettings from './sections/FloatingSettings.vue'
import MainContent from './sections/MainContent.vue'
import LibraryFooter from './sections/LibraryFooter.vue'

const store = useRankStore()
const dialogStore = useDialogStore()

const showTierEdit = ref(false)
const showHelp = ref(false)
const editingTier = ref<Tier | undefined>()
const isNewTier = ref(false)

const currentTemplateName = computed(() => {
  const template = store.templates.find(t => t.id === store.currentTemplate)
  return template?.name || '自定义'
})

onMounted(() => {
  store.loadLibrary()
  store.loadSettings()
})

async function editTitle() {
  const newTitle = await dialogStore.showPrompt('请输入新的标题：', store.pageTitle, '编辑标题')
  if (newTitle !== null && newTitle.trim()) {
    store.pageTitle = newTitle.trim()
    store.saveSettings()
  }
}

async function resetCurrentRanking() {
  const confirmed = await dialogStore.showConfirm(`确定要重置"${currentTemplateName.value}"的排行数据吗？`, '重置排行')
  if (confirmed) {
    store.resetCurrentRanking()
  }
}

function toggleItemNames() {
  store.showItemNames = !store.showItemNames
  store.saveSettings()
}

function handleTemplateChange(event: Event) {
  const target = event.target as HTMLSelectElement
  store.setCurrentTemplate(target.value)
  store.saveSettings()
}

function handleTierEdit(tier: Tier) {
  editingTier.value = tier
  isNewTier.value = false
  showTierEdit.value = true
}

function handleTierDelete(tierId: string) {
  if (store.currentTemplate === 'custom') {
    store.removeCustomTier(tierId)
  } else {
    // 预设模板不允许删除等级，只能清空items
    const tier = store.currentTiers.find((t: Tier) => t.id === tierId)
    if (tier) {
      tier.items = []
      store.saveCurrentRanking()
    }
  }
}

function handleTierItemsUpdate(tierId: string, items: RankItem[]) {
  // console.log(`App updating tier ${tierId} with items:`, items)
  store.updateTierItems(tierId, items)
}

async function handleAddNewTier() {
  if (store.currentTemplate !== 'custom') {
    await dialogStore.showAlert('只有自定义模式才能添加新等级', '提示')
    return
  }
  editingTier.value = undefined
  isNewTier.value = true
  showTierEdit.value = true
}

function handleTierSave(tierData: Partial<Tier>) {
  if (isNewTier.value) {
    store.addCustomTier(tierData as Omit<Tier, 'items'>)
  } else if (editingTier.value) {
    store.updateTier(editingTier.value.id, tierData)
  }
  showTierEdit.value = false
}

function handleLibraryUpdate(items: RankItem[]) {
  store.library = [...items]
  store.saveLibrary()
}

function handleLibraryAddItem(item: RankItem) {
  store.addToLibrary(item)
}

function handleDeleteItem(itemId: string) {
  // console.log('App deleting item with ID (legacy):', itemId)
  // This is for backward compatibility - complete deletion
  store.deleteItemCompletely(itemId)
}

function handleRemoveFromTier(tierId: string, itemId: string) {
  // console.log('App removing item from tier:', tierId, itemId)
  store.removeItemFromTier(tierId, itemId)
}

function handleDeleteCompletely(itemId: string) {
  // console.log('App deleting item completely:', itemId)
  store.deleteItemCompletely(itemId)
}

async function saveAsTemplate() {
  if (store.currentTemplate !== 'custom' || store.customTiers.length === 0) {
    await dialogStore.showAlert('只有在自定义模式下且有等级时才能保存为模板', '提示')
    return
  }

  const templateName = await dialogStore.showPrompt('请输入模板名称：', '', '保存模板')
  if (templateName && templateName.trim()) {
    if (store.saveAsTemplate(templateName.trim())) {
      await dialogStore.showAlert('模板保存成功！', '成功')
    } else {
      await dialogStore.showAlert('保存模板失败', '错误')
    }
  }
}

async function deleteTemplate() {
  const currentTemplateObj = store.templates.find(t => t.id === store.currentTemplate)
  if (!currentTemplateObj || !currentTemplateObj.id.startsWith('custom-')) {
    await dialogStore.showAlert('只能删除自定义模板', '提示')
    return
  }

  const confirmed = await dialogStore.showConfirm(`确定要删除模板"${currentTemplateObj.name}"吗？`, '删除模板')
  if (confirmed) {
    if (store.deleteCustomTemplate(store.currentTemplate)) {
      await dialogStore.showAlert('模板删除成功', '成功')
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col pb-[200px]">
    <!-- Floating settings panel -->
    <FloatingSettings
        v-model:show-help="showHelp"
        @edit-title="editTitle"
        @reset-ranking="resetCurrentRanking"
        @toggle-item-names="toggleItemNames"
        @template-change="handleTemplateChange"
        @add-new-tier="handleAddNewTier"
        @save-template="saveAsTemplate"
        @delete-template="deleteTemplate"
    />

    <!-- Main content area -->
    <MainContent
        @edit-title="editTitle"
        @edit-tier="handleTierEdit"
        @delete-tier="handleTierDelete"
        @update-tier-items="handleTierItemsUpdate"
    />

    <!-- Fixed bottom library and delete zone -->
    <LibraryFooter
        :library="store.library"
        :show-item-names="store.showItemNames"
        @update-library="handleLibraryUpdate"
        @add-library-item="handleLibraryAddItem"
        @delete-item="handleDeleteItem"
        @remove-from-tier="handleRemoveFromTier"
        @delete-completely="handleDeleteCompletely"
    />

    <!-- Modals -->
    <TierEditModal
        :is-new="isNewTier"
        :show="showTierEdit"
        :tier="editingTier"
        @close="showTierEdit = false"
        @save="handleTierSave"
    />

    <HelpModal
        v-if="showHelp"
        @close="showHelp = false"
    />

    <!-- Dialog Container -->
    <DialogContainer />
  </div>
</template>

