<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const isSidebarOpen = ref(true)
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar v-model:is-open="isSidebarOpen" />
    
    <div :class="['transition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-16']">
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>