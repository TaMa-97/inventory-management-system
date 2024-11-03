<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const props = defineProps<{
  productId?: number
}>()

const emit = defineEmits<{
  close: []
  submit: []
}>()

const store = useInventoryStore()
const error = ref<string | null>(null)

const formData = ref({
  name: '',
  sku: '',
  quantity: 0,
  price: 0,
  category: ''
})

onMounted(() => {
  if (props.productId) {
    const product = store.products.find(p => p.id === props.productId)
    if (product) {
      formData.value = {
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: product.price,
        category: product.category
      }
    }
  }
})

const handleSubmit = async () => {
  try {
    if (props.productId) {
      await store.updateProduct(props.productId, {
        name: formData.value.name,
        sku: formData.value.sku,
        quantity: formData.value.quantity,
        price: formData.value.price,
        category: formData.value.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } else {
      await store.addProduct({
        name: formData.value.name,
        sku: formData.value.sku,
        quantity: formData.value.quantity,
        price: formData.value.price,
        category: formData.value.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    emit('submit')
  } catch (e) {
    error.value = '操作に失敗しました'
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">
        {{ productId ? '商品編集' : '新規商品登録' }}
      </h2>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">商品名</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">SKU</label>
            <input
              v-model="formData.sku"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">カテゴリ</label>
            <input
              v-model="formData.category"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">在庫数</label>
            <input
              v-model.number="formData.quantity"
              type="number"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">価格</label>
            <input
              v-model.number="formData.price"
              type="number"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {{ productId ? '更新' : '登録' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>