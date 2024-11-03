<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'
import ProductForm from '../components/ProductForm.vue'

const store = useInventoryStore()
const showAddForm = ref(false)
const editingProduct = ref<number | null>(null)

onMounted(() => {
  store.fetchProducts()
})

const handleDelete = async (id: number) => {
  if (confirm('本当にこの商品を削除しますか？')) {
    try {
      await store.removeProduct(id)
    } catch (e) {
      // エラーは store 内で処理されます
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">商品管理</h1>
      <button
        @click="showAddForm = true"
        class="btn-primary"
      >
        新規商品登録
      </button>
    </div>

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
            <th>カテゴリ</th>
            <th>在庫数</th>
            <th>価格</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in store.products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.sku }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.quantity.toLocaleString() }}</td>
            <td>¥{{ product.price.toLocaleString() }}</td>
            <td class="text-right">
              <button
                @click="editingProduct = product.id"
                class="text-blue-600 hover:text-blue-800 mr-4"
              >
                編集
              </button>
              <button
                @click="handleDelete(product.id)"
                class="btn-danger"
              >
                削除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProductForm
      v-if="showAddForm"
      @close="showAddForm = false"
      @submit="showAddForm = false"
    />

    <ProductForm
      v-if="editingProduct !== null"
      :product-id="editingProduct"
      @close="editingProduct = null"
      @submit="editingProduct = null"
    />
  </div>
</template>