<script setup lang="ts">
import { ref } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const props = defineProps<{
  productId: number
  currentQuantity: number
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useInventoryStore()
const quantity = ref(0)
const note = ref('')
const error = ref<string | null>(null)

const handleSubmit = async () => {
  if (quantity.value === 0) {
    error.value = '数量を入力してください'
    return
  }

  try {
    await store.updateStock(props.productId, quantity.value)
    emit('close')
  } catch (e) {
    error.value = '在庫の調整に失敗しました'
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">在庫数調整</h2>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">現在の在庫数</label>
            <p class="mt-1 text-lg font-semibold">{{ currentQuantity }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              調整数量（入庫: 正数, 出庫: 負数）
            </label>
            <input
              v-model.number="quantity"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">備考</label>
            <textarea
              v-model="note"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
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
            確定
          </button>
        </div>
      </form>
    </div>
  </div>
</template>