<script setup lang="ts">
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-gray-900">ダッシュボード</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">総在庫数</h2>
        <p class="text-3xl font-bold text-blue-600">
          {{ store.products.reduce((sum, product) => sum + product.quantity, 0).toLocaleString() }}
          <span class="text-sm font-normal text-gray-500">個</span>
        </p>
      </div>
      
      <div class="card">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">商品数</h2>
        <p class="text-3xl font-bold text-blue-600">
          {{ store.products.length.toLocaleString() }}
          <span class="text-sm font-normal text-gray-500">品目</span>
        </p>
      </div>
      
      <div class="card">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">総在庫金額</h2>
        <p class="text-3xl font-bold text-blue-600">
          ¥{{ store.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>