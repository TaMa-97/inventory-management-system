<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '../stores/category'

const props = defineProps<{
  categoryId?: number
}>()

const emit = defineEmits<{
  close: []
  submit: []
}>()

const store = useCategoryStore()
const error = ref<string | null>(null)

const formData = ref({
  name: '',
  description: ''
})

onMounted(() => {
  if (props.categoryId) {
    const category = store.categories.find(c => c.id === props.categoryId)
    if (category) {
      formData.value = {
        name: category.name,
        description: category.description
      }
    }
  }
})

const handleSubmit = async () => {
  try {
    const categoryData = {
      name: formData.value.name,
      description: formData.value.description
    }

    if (props.categoryId) {
      await store.updateCategory(props.categoryId, categoryData)
    } else {
      await store.addCategory(categoryData)
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
        {{ categoryId ? 'カテゴリ編集' : '新規カテゴリ登録' }}
      </h2>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">カテゴリ名</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">説明</label>
            <textarea
              v-model="formData.description"
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
            {{ categoryId ? '更新' : '登録' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>