import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 添加重定向
  {
    path: '/',
    redirect: '/home'
  },

  // 业务页面
  {
    path: '/',
    name: '/',
    component: () => import('@/components/layouts/contents.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/view.vue')
      }
    ]
  },

  // 登录页面
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
