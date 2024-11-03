import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import Inventory from '../views/Inventory.vue'
import Categories from '../views/Categories.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: Inventory
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    }
  ]
})

export default router