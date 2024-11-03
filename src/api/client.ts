import axios from 'axios'
import type { Product, Category, StockMovement } from '../types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

export const api = {
  // Product list
  getProducts: async () => {
    const { data } = await client.get<Product[]>('/products')
    return data
  },

  // Get single product
  getProduct: async (id: number) => {
    const { data } = await client.get<Product>(`/products/${id}`)
    return data
  },

  // Create product
  createProduct: async (product: Omit<Product, 'id'>) => {
    const { data } = await client.post<Product>('/products', product)
    return data
  },

  // Update product
  updateProduct: async (id: number, updates: Partial<Product>) => {
    const { data } = await client.patch<Product>(`/products/${id}`, updates)
    return data
  },

  // Delete product
  deleteProduct: async (id: number) => {
    await client.delete(`/products/${id}`)
  },

  // Update stock
  updateStock: async (id: number, quantity: number, note?: string) => {
    const { data } = await client.post<Product>(`/products/${id}/stock`, { quantity, note })
    return data
  },

  // Get stock movements
  getStockMovements: async (productId: number) => {
    const { data } = await client.get<StockMovement[]>(`/products/${productId}/stock-movements`)
    return data
  },

  // Category endpoints
  getCategories: async () => {
    const { data } = await client.get<Category[]>('/categories')
    return data
  },

  createCategory: async (category: Omit<Category, 'id' | 'productCount'>) => {
    const { data } = await client.post<Category>('/categories', category)
    return data
  },

  updateCategory: async (id: number, updates: Partial<Category>) => {
    const { data } = await client.patch<Category>(`/categories/${id}`, updates)
    return data
  },

  deleteCategory: async (id: number) => {
    await client.delete(`/categories/${id}`)
  }
}