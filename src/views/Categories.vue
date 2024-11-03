<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '../stores/category'
import CategoryForm from '../components/CategoryForm.vue'

const store = useCategoryStore()
const showAddForm = ref(false)
const editingCategory = ref<number | null>(null)

onMounted(() => {
  store.fetchCategories()
})

const handleDelete = async (id: number) => {
  if (confirm('このカテゴリを削除してもよろしいですか？')) {
    try {
      await store.removeCategory(id)
    } catch (e) {
      // エラーはstore内で処理されます
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">カテゴリ管理</h1>
      <button
        @click="showAddForm = true"
        class="btn-primary"
      >
        新規カテゴリ登録
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
            <th>カテゴリ名</th>
            <th>説明</th>
            <th>商品数</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="category in store.categories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>{{ category.productCount }}</td>
            <td class="text-right">
              <button
                @click="editingCategory = category.id"
                class="text-blue-600 hover:text-blue-800 mr-4"
              >
                編集
              </button>
              <button
                @click="handleDelete(category.id)"
                class="btn-danger"
              >
                削除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CategoryForm
      v-if="showAddForm"
      @close="showAddForm = false"
      @submit="showAddForm = false"
    />

    <CategoryForm
      v-if="editingCategory !== null"
      :category-id="editingCategory"
      @close="editingCategory = null"
      @submit="editingCategory = null"
    />
  </div>
</template>