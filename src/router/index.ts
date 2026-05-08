import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),

      children: [
        {
          path: '',
          redirect: '/dashboard',
        },

        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
        },

        {
          path: 'matches',
          component: () => import('@/views/matches/index.vue'),
        },

        {
          path: 'teams',
          component: () => import('@/views/teams/index.vue'),
        },

        {
          path: 'players',
          component: () => import('@/views/players/index.vue'),
        },
      ],
    },

    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
  ],
})

export default router