import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 添加重定向
  {
    path: '/',
    redirect: '/login'
  },
  // 主要页面
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/view.vue')
  },
  {
    path: '/sso-auth',
    name: 'ssoAuth',
    component: () => import('@/views/login/sso-auth.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/view.vue')
  },
  // 配置404页面
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(),
  routes
})

router.beforeEach((to: any, from: any, next: any) => {
  next()
})

export default router
