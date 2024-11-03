<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
  HomeIcon,
  CubeIcon,
  ArchiveBoxIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const route = useRoute()

const navigation = [
  { name: 'ダッシュボード', icon: HomeIcon, route: '/' },
  { name: '商品管理', icon: CubeIcon, route: '/products' },
  { name: '在庫管理', icon: ArchiveBoxIcon, route: '/inventory' },
  { name: 'カテゴリ管理', icon: TagIcon, route: '/categories' }
]

const toggleSidebar = () => {
  emit('update:isOpen', !props.isOpen)
}
</script>

<template>
  <div
    class="fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 border-r border-gray-200"
    :class="[isOpen ? 'w-64' : 'w-16']"
  >
    <div class="flex h-16 items-center justify-between px-4 border-b border-gray-200">
      <h1 class="text-xl font-bold text-blue-600" :class="{ 'hidden': !isOpen }">在庫管理</h1>
      <button
        @click="toggleSidebar"
        class="rounded p-1 hover:bg-gray-100 text-gray-500"
      >
        <ChevronDoubleLeftIcon v-if="isOpen" class="h-5 w-5" />
        <ChevronDoubleRightIcon v-else class="h-5 w-5" />
      </button>
    </div>

    <nav class="mt-4">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.route"
        class="flex items-center px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
        :class="{ 'bg-blue-50 text-blue-600': route.path === item.route }"
      >
        <component :is="item.icon" class="h-5 w-5" />
        <span
          v-if="isOpen"
          class="ml-3"
        >{{ item.name }}</span>
      </RouterLink>
    </nav>
  </div>
</template>