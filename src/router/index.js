import { createRouter, createWebHistory } from 'vue-router'
import Expense from '@/components/Expense.vue'
import Income from '@/components/Income.vue'
import Summary from '@/components/Summary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'expense',
      component: Expense
    },
    {
      path: '/income',
      name: 'income',
      component: Income
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary
    },
  ]
})

export default router
