<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../api/client'
import type { StockMovement } from '../types'

const props = defineProps<{
  productId: number
}>()

const movements = ref<StockMovement[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchStockMovements = async () => {
  isLoading.value = true
  error.value = null
  try {
    movements.value = await api.getStockMovements(props.productId)
  } catch (e) {
    error.value = '在庫履歴の取得に失敗しました'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStockMovements()
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ja-JP')
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">在庫移動履歴</h3>

    <div v-if="error" class="p-3 bg-red-100 text-red-700 rounded text-sm">
      {{ error }}
    </div>

    <div v-if="isLoading" class="text-center text-gray-500">
      読み込み中...
    </div>

    <div v-else-if="movements.length === 0" class="text-center text-gray-500">
      履歴がありません
    </div>

    <div v-else class="border rounded-lg divide-y">
      <div
        v-for="movement in movements"
        :key="movement.id"
        class="p-4"
      >
        <div class="flex justify-between items-start">
          <div>
            <span
              :class="[
                'inline-block px-2 py-1 text-sm rounded-full',
                movement.type === 'IN'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ movement.type === 'IN' ? '入庫' : '出庫' }}
            </span>
            <span class="ml-2 text-lg font-medium">
              {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
            </span>
          </div>
          <time class="text-sm text-gray-500">
            {{ formatDate(movement.created_at) }}
          </time>
        </div>
        <p v-if="movement.note" class="mt-2 text-gray-600">
          {{ movement.note }}
        </p>
      </div>
    </div>
  </div>
</template>