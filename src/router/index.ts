import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // 添加重定向
  {
    path: "/",
    redirect: "/home",
  },

  // 业务页面
  {
    path: "/",
    name: "/",
    component: () => import("@/components/layouts/contents.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/view.vue"),
      },
      {
        path: "/users-manage",
        name: "users-manage",
        component: () => import("@/views/manages/users.vue"),
      },
    ],
  },

  // 登录页面
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/view.vue"),
  },
  {
    path: "/sso-auth",
    name: "ssoAuth",
    component: () => import("@/views/login/sso-auth.vue"),
  },

  // 组件测试页面
  {
    path: "/forms-using",
    name: "forms-using",
    component: () => import("@/components/forms/using.vue"),
  },
  {
    path: "/echarts-using",
    name: "echarts-using",
    component: () => import("@/components/echarts/using.vue"),
  },
  {
    path: "/chats-using",
    name: "chats-using",
    component: () => import("@/components/chats/using.vue"),
  },
  {
    path: "/editors-using",
    name: "editors-using",
    component: () => import("@/components/editors/using.vue"),
  },
  {
    path: "/flips-using",
    name: "flips-using",
    component: () => import("@/components/flips/using.vue"),
  },
  {
    path: "/workflows-using",
    name: "workflows-using",
    component: () => import("@/components/workflows/using.vue"),
  },
  {
    path: "/gsap-using",
    name: "gsap-using",
    component: () => import("@/components/gsap/using.vue"),
  },
  {
    path: "/directives-using",
    name: "directives-using",
    component: () => import("@/commons/directives/using.vue"),
  },
  {
    path: "/extend-using",
    name: "extend-using",
    component: () => import("@/commons/utils/extends/using.vue"),
  },
    {
    path: "/grid-using",
    name: "grid-using",
    component: () => import("@/components/grids/using.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(),
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  next();
});

export default router;
