import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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

            {
          path: 'users',
          component: () => import('@/views/users/index.vue'),
        },
      ],
    },

    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('loginInfo')
  const userStore = useUserStore()

  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (
    token &&
    userStore.userType === 'normal' &&
    to.path !== '/dashboard' &&
    to.path !== '/login' &&
    !userStore.permission.includes(to.path.replace('/', ''))
  ) {
    next('/dashboard')
  } else {
    next()
  }
})


export default router