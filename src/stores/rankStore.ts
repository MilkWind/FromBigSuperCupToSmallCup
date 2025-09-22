import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

export interface RankItem {
    id: string
    name: string
    image?: string
}

export interface Tier {
    id: string
    name: string
    color: string
    items: RankItem[]
}

export interface RankTemplate {
    id: string
    name: string
    tiers: Omit<Tier, 'items'>[]
}

export const useRankStore = defineStore('rank', () => {
    const currentTemplate = ref<string>('entertainment')
    const customTiers = ref<Tier[]>([])
    const library = ref<RankItem[]>([])
    const showItemNames = ref(true)
    const pageTitle = ref('从超大杯到小杯')

    // Add a trigger for forcing reactivity updates
    const reactivityTrigger = ref(0)

    // Preset templates
    const defaultTemplates: RankTemplate[] = [{
        id: 'entertainment', name: '娱乐杯级', tiers: [{id: 'super-large', name: '超大杯', color: '#ff4d4d'}, {
            id: 'large', name: '大杯', color: '#ff9933'
        }, {id: 'medium', name: '中杯', color: '#ffeb3b'}, {id: 'small', name: '小杯', color: '#4caf50'}]
    }, {
        id: 'serious', name: '严肃杯级', tiers: [{id: 'super-large-top', name: '超大杯上', color: '#d32f2f'}, {
            id: 'super-large-mid', name: '超大杯中', color: '#f57c00'
        }, {id: 'super-large-bottom', name: '超大杯下', color: '#fbc02d'}, {
            id: 'large-top', name: '大杯上', color: '#689f38'
        }, {id: 'large-mid', name: '大杯中', color: '#388e3c'}, {
            id: 'large-bottom', name: '大杯下', color: '#00796b'
        }, {id: 'medium-top', name: '中杯上', color: '#0288d1'}, {
            id: 'medium-mid', name: '中杯中', color: '#303f9f'
        }, {id: 'medium-bottom', name: '中杯下', color: '#7b1fa2'}]
    }, {
        id: 'meme',
        name: '从夯到拉',
        tiers: [{id: 'hang', name: '夯', color: '#ff4d4d'}, {id: 'top', name: '顶级', color: '#ff9933'}, {
            id: 'elite', name: '人上人', color: '#ffeb3b'
        }, {id: 'npc', name: 'NPC', color: '#ffe0b2'}, {id: 'trash', name: '拉完了', color: '#f0f0f0'}]
    }]

    const customTemplates = ref<RankTemplate[]>([])
    const templates = computed(() => [...defaultTemplates, ...customTemplates.value])

    const currentTiers = computed(() => {
        // Include reactivityTrigger to force re-evaluation when needed
        reactivityTrigger.value

        if (currentTemplate.value === 'custom') {
            return customTiers.value
        }

        const template = templates.value.find(t => t.id === currentTemplate.value)
        if (!template) return []

        // Load ranking data for corresponding template from localStorage
        const savedData = localStorage.getItem(`tier-rank-${currentTemplate.value}`)
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                return parsed.tiers || []
            } catch (e) {
                console.error('Failed to parse saved data:', e)
            }
        }

        // Return default template
        return template.tiers.map(tier => ({
            ...tier, items: []
        }))
    })

    const setCurrentTemplate = (templateId: string) => {
        currentTemplate.value = templateId
    }

    const addItemToTier = (tierId: string, item: RankItem) => {
        const tier = currentTiers.value.find((t: Tier) => t.id === tierId)
        if (tier) {
            tier.items.push(item)
            saveCurrentRanking()
            // Trigger reactivity for preset templates
            if (currentTemplate.value !== 'custom') {
                reactivityTrigger.value++
            }
        }
    }

    const removeItemFromTier = (tierId: string, itemId: string) => {
        const tier = currentTiers.value.find((t: Tier) => t.id === tierId)
        if (tier) {
            const index = tier.items.findIndex((item: RankItem) => item.id === itemId)
            if (index !== -1) {
                tier.items.splice(index, 1)
                saveCurrentRanking()
                // Trigger reactivity for preset templates
                if (currentTemplate.value !== 'custom') {
                    reactivityTrigger.value++
                }
            }
        }
    }

    const moveItemBetweenTiers = (fromTierId: string, toTierId: string, itemId: string) => {
        const fromTier = currentTiers.value.find((t: Tier) => t.id === fromTierId)
        const toTier = currentTiers.value.find((t: Tier) => t.id === toTierId)

        if (fromTier && toTier) {
            const itemIndex = fromTier.items.findIndex((item: RankItem) => item.id === itemId)
            if (itemIndex !== -1) {
                const [item] = fromTier.items.splice(itemIndex, 1)
                toTier.items.push(item)
                saveCurrentRanking()
                // Trigger reactivity for preset templates
                if (currentTemplate.value !== 'custom') {
                    reactivityTrigger.value++
                }
            }
        }
    }

    const addToLibrary = (item: RankItem) => {
        library.value.push(item)
        saveLibrary()
    }

    const removeFromLibrary = (itemId: string) => {
        console.log('Store removeFromLibrary called with ID:', itemId)
        console.log('Current library:', library.value.map(item => ({id: item.id, name: item.name})))
        const index = library.value.findIndex((item: RankItem) => item.id === itemId)
        console.log('Found index:', index)
        if (index !== -1) {
            const removedItem = library.value.splice(index, 1)
            console.log('Removed item:', removedItem[0])
            saveLibrary()
        } else {
            console.log('Item not found in library')
        }
    }

    const removeItemFromAllTiers = (itemId: string) => {
        console.log('Store removeItemFromAllTiers called with ID:', itemId)
        let removed = false

        // Get current tiers data
        const tiers = currentTiers.value

        tiers.forEach((tier: Tier) => {
            let count = 0
            while (true) {
                count++
                const index = tier.items.findIndex((item: RankItem) => item.id === itemId)
                if (index !== -1) {
                    console.log(`Removing item from tier ${tier.name}`)
                    tier.items.splice(index, 1)
                } else {
                    removed = true
                    break
                }
            }
            console.log(`Removed ${count} items from tier ${tier.name}`)

        })

        if (removed) {
            saveCurrentRanking()

            // Force re-evaluation of computed property for preset templates
            if (currentTemplate.value !== 'custom') {
                reactivityTrigger.value++
            }
        }
        return removed
    }

    const deleteItemCompletely = (itemId: string) => {
        console.log('Store deleteItemCompletely called with ID:', itemId)
        removeFromLibrary(itemId)
        removeItemFromAllTiers(itemId)
    }

    const addCustomTier = (tier: Omit<Tier, 'items'>) => {
        if (currentTemplate.value === 'custom') {
            customTiers.value.push({
                ...tier, items: []
            })
            saveCurrentRanking()
        }
    }

    const removeCustomTier = (tierId: string) => {
        if (currentTemplate.value === 'custom') {
            const index = customTiers.value.findIndex((tier: Tier) => tier.id === tierId)
            if (index !== -1) {
                customTiers.value.splice(index, 1)
                saveCurrentRanking()
            }
        }
    }

    const updateTier = (tierId: string, updates: Partial<Tier>) => {
        let tier: Tier | undefined

        if (currentTemplate.value === 'custom') {
            tier = customTiers.value.find((t: Tier) => t.id === tierId)
        } else {
            tier = currentTiers.value.find((t: Tier) => t.id === tierId)
        }

        if (tier) {
            Object.assign(tier, updates)
            saveCurrentRanking()
        }
    }

    const updateTierItems = (tierId: string, items: RankItem[]) => {
        let tier: Tier | undefined

        if (currentTemplate.value === 'custom') {
            tier = customTiers.value.find((t: Tier) => t.id === tierId)
            if (tier) {
                tier.items = [...items]
                saveCurrentRanking()
            }
        } else {
            tier = currentTiers.value.find((t: Tier) => t.id === tierId)
            if (tier) {
                tier.items = [...items]
                saveCurrentRanking()
                // Trigger reactivity for preset templates
                reactivityTrigger.value++
            }
        }
    }

    // Local storage related methods
    const saveCurrentRanking = () => {
        const data = {
            tiers: currentTemplate.value === 'custom' ? customTiers.value : currentTiers.value, timestamp: Date.now()
        }
        localStorage.setItem(`tier-rank-${currentTemplate.value}`, JSON.stringify(data))
    }

    const saveLibrary = () => {
        localStorage.setItem('tier-rank-library', JSON.stringify(library.value))
    }

    const saveSettings = () => {
        const settings = {
            showItemNames: showItemNames.value, pageTitle: pageTitle.value, currentTemplate: currentTemplate.value
        }
        localStorage.setItem('tier-rank-settings', JSON.stringify(settings))
    }

    const loadLibrary = () => {
        const saved = localStorage.getItem('tier-rank-library')
        if (saved) {
            try {
                library.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to load library:', e)
            }
        }
    }

    const loadSettings = () => {
        const saved = localStorage.getItem('tier-rank-settings')
        if (saved) {
            try {
                const settings = JSON.parse(saved)
                showItemNames.value = settings.showItemNames ?? true
                pageTitle.value = settings.pageTitle ?? '从超大杯到小杯'
                currentTemplate.value = settings.currentTemplate ?? 'entertainment'
            } catch (e) {
                console.error('Failed to load settings:', e)
            }
        }
        // Load custom templates
        loadCustomTemplates()
    }

    const resetCurrentRanking = () => {
        localStorage.removeItem(`tier-rank-${currentTemplate.value}`)
        if (currentTemplate.value === 'custom') {
            customTiers.value = []
        }
        // Force recomputation
        const temp = currentTemplate.value
        currentTemplate.value = ''
        currentTemplate.value = temp
    }


    const saveAsTemplate = (templateName: string) => {
        if (currentTemplate.value !== 'custom' || customTiers.value.length === 0) {
            return false
        }

        const newTemplate: RankTemplate = {
            id: `custom-${Date.now()}`, name: templateName, tiers: customTiers.value.map(tier => ({
                id: tier.id, name: tier.name, color: tier.color
            }))
        }

        customTemplates.value.push(newTemplate)
        saveCustomTemplates()
        return true
    }

    const deleteCustomTemplate = (templateId: string) => {
        const index = customTemplates.value.findIndex(t => t.id === templateId)
        if (index !== -1) {
            customTemplates.value.splice(index, 1)
            saveCustomTemplates()
            // If current template is deleted, switch to custom mode
            if (currentTemplate.value === templateId) {
                currentTemplate.value = 'custom'
                customTiers.value = []
            }
            return true
        }
        return false
    }

    const saveCustomTemplates = () => {
        localStorage.setItem('tier-rank-custom-templates', JSON.stringify(customTemplates.value))
    }

    const loadCustomTemplates = () => {
        const saved = localStorage.getItem('tier-rank-custom-templates')
        if (saved) {
            try {
                customTemplates.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to load custom templates:', e)
            }
        }
    }

    return {
        // State
        currentTemplate,
        customTiers,
        customTemplates,
        library,
        showItemNames,
        pageTitle,
        templates,

        // Computed properties
        currentTiers,

        // Methods
        setCurrentTemplate,
        addItemToTier,
        removeItemFromTier,
        moveItemBetweenTiers,
        addToLibrary,
        removeFromLibrary,
        removeItemFromAllTiers,
        deleteItemCompletely,
        addCustomTier,
        removeCustomTier,
        updateTier,
        updateTierItems,
        saveCurrentRanking,
        saveLibrary,
        saveSettings,
        loadLibrary,
        loadSettings,
        resetCurrentRanking,
        saveAsTemplate,
        deleteCustomTemplate,
        saveCustomTemplates,
        loadCustomTemplates
    }
})