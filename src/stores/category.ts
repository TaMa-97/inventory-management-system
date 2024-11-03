import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../api/client'
import type { Category } from '../types'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    isLoading.value = true
    error.value = null
    try {
      categories.value = await api.getCategories()
    } catch (e) {
      error.value = 'カテゴリデータの取得に失敗しました'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const addCategory = async (category: Omit<Category, 'id' | 'productCount'>) => {
    try {
      const newCategory = await api.createCategory(category)
      categories.value.push(newCategory)
    } catch (e) {
      error.value = 'カテゴリの登録に失敗しました'
      console.error(e)
      throw e
    }
  }

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      const updatedCategory = await api.updateCategory(id, updates)
      if (updatedCategory) {
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
          categories.value[index] = updatedCategory
        }
      }
    } catch (e) {
      error.value = 'カテゴリの更新に失敗しました'
      console.error(e)
      throw e
    }
  }

  const removeCategory = async (id: number) => {
    try {
      await api.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (e) {
      error.value = 'カテゴリの削除に失敗しました'
      console.error(e)
      throw e
    }
  }

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory
  }
})