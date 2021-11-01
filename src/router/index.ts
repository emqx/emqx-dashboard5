import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Home from "../views/Home.vue";
import Login from "@/views/Base/Login.vue";
import store from "@/store";
// import { toLogin } from '@/common/utils'
import Layout from "@/views/Base/Layout.vue";
import Overview from "@/views/Dashboard/Overview.vue";
import Nodes from "@/views/Dashboard/Nodes.vue";
import Metrics from "@/views/Dashboard/Metrics.vue";
import Alarm from "@/views/Alarm/Alarm.vue";
import TopicMetrics from "@/views/Tools/TopicMetrics.vue";
import Websocket from "@/views/Tools/WebSocket.vue";
import Clients from "@/views/Clients/Clients.vue";
import ClientDetails from "@/views/Clients/ClientDetails.vue";
import Topics from "@/views/Topics/Topics.vue";
import Subscriptions from "@/views/Subscriptions/Subscriptions.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/login",
    name: "login",
    meta: {
      authRequired: false,
    },
    component: Login,
  },

  {
    path: "/dashboard",
    component: Layout,
    redirect: "/dashboard/overview",
    meta: {
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: "overview",
        name: "overview",
        component: Overview,
      },
      {
        path: "nodes",
        name: "nodes",
        component: Nodes,
      },
      {
        path: "metrics",
        name: "metrics",
        component: Metrics,
      },
    ],
  },
  {
    path: "/alarm",
    component: Layout,
    meta: {
      hideKey: "alarm",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "alarm",
        component: Alarm,
      },
    ],
  },

  // 工具
  {
    path: "/tools",
    component: Layout,
    redirect: "/tools/websocket",
    meta: {
      hideKey: "tools",
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: "websocket",
        name: "websocket",
        component: Websocket,
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "topic-metrics",
        name: "topic-metrics",
        component: TopicMetrics,
      },
      // {
      //   path: 'httpapi',
      //   name: 'httpapi',
      //   component: () => import('@/views/Tools/Httpapi'),
      // },
    ],
  },

  // 连接
  {
    path: "/clients",
    component: Layout,
    meta: {
      hideKey: "clients",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "clients",
        component: Clients,
      },
      {
        path: "detail/:clientId",
        name: "clients-detail",
        component: ClientDetails,
      },
    ],
  },

  // 主题
  {
    path: "/topics",
    component: Layout,
    meta: {
      hideKey: "topics",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "topics",
        component: Topics,
      },
    ],
  },
  // 订阅
  {
    path: "/subscriptions",
    component: Layout,
    meta: {
      hideKey: "subscriptions",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "subscriptions",
        component: Subscriptions,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { fullPath, meta } = to;
  const { authRequired = false } = meta;
  const info = store.state.user;

  if (authRequired && !info.token) {
    toLogin(fullPath);
  }
  next();
});

//Logout and go to Login page
export function toLogin(path: string) {
  store.commit("UPDATE_USER_INFO", { logOut: true });
  store.commit("UPDATE_EDITION", null);
  store.commit("SET_LANGUAGE", null);
  const currentPath = router.currentRoute.value.path;
  currentPath !== "/login" &&
    router.push({
      path: "/login",
      query: { to: path ? path : currentPath ?? undefined },
    });
}

export default router;
