<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'
import StockAdjustmentModal from '../components/StockAdjustmentModal.vue'

const store = useInventoryStore()
const selectedProductId = ref<number | null>(null)

onMounted(() => {
  store.fetchProducts()
})

const openStockAdjustment = (productId: number) => {
  selectedProductId.value = productId
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-gray-900">在庫管理</h1>
    
    <div v-if="store.error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
      {{ store.error }}
    </div>

    <div v-if="store.isLoading" class="card p-8 text-center text-gray-500">
      読み込み中...
    </div>

    <div v-else class="card">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>商品名</th>
            <th>SKU</th>
            <th>現在庫数</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in store.products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.sku }}</td>
            <td>{{ product.quantity.toLocaleString() }}</td>
            <td class="text-right">
              <button
                @click="openStockAdjustment(product.id)"
                class="text-blue-600 hover:text-blue-800"
              >
                在庫調整
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <StockAdjustmentModal
      v-if="selectedProductId"
      :product-id="selectedProductId"
      :current-quantity="store.products.find(p => p.id === selectedProductId)?.quantity || 0"
      @close="selectedProductId = null"
    />
  </div>
</template>