import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../api/client'
import type { Product } from '../types'

export const useInventoryStore = defineStore('inventory', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      products.value = await api.getProducts()
    } catch (e) {
      error.value = '商品データの取得に失敗しました'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await api.createProduct(product)
      products.value.push(newProduct)
    } catch (e) {
      error.value = '商品の登録に失敗しました'
      console.error(e)
      throw e
    }
  }

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      const updatedProduct = await api.updateProduct(id, updates)
      if (updatedProduct) {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = updatedProduct
        }
      }
    } catch (e) {
      error.value = '商品の更新に失敗しました'
      console.error(e)
      throw e
    }
  }

  const removeProduct = async (id: number) => {
    try {
      await api.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (e) {
      error.value = '商品の削除に失敗しました'
      console.error(e)
      throw e
    }
  }

  const updateStock = async (id: number, quantity: number) => {
    try {
      const updatedProduct = await api.updateStock(id, quantity)
      if (updatedProduct) {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = updatedProduct
        }
      }
    } catch (e) {
      error.value = '在庫数の更新に失敗しました'
      console.error(e)
      throw e
    }
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    removeProduct,
    updateStock
  }
})