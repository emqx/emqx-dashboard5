import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Base/Login.vue";
import store from "@/store";
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
import Advanced from "@/views/Advanced/Advanced.vue";
import Users from "@/views/General/Users.vue";
import Blacklist from "@/views/General/Blacklist.vue";
import Gateway from "@/views/Gateway/Gateway.vue";
import GatewayDetail from "@/views/Gateway/GatewayDetail.vue";
import GatewayDetailBasic from "@/views/Gateway/components/basic.vue";
import GatewayDetailListener from "@/views/Gateway/components/listeners.vue";
import GatewayDetailAuth from "@/views/Gateway/components/auth.vue";
import GatewayDetailClients from "@/views/Gateway/components/clients.vue";
import GatewayCreate from "@/views/Gateway/GatewayCreate.vue";
import IoT from "@/views/RuleEngine/IoT.vue";
import Bridge from "@/views/RuleEngine/Bridge.vue";
import BridgeCreate from "@/views/RuleEngine/BridgeCreate.vue";

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

  // 用户
  {
    path: "/users",
    component: Layout,
    meta: {
      hideKey: "users",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "users",
        component: Users,
      },
    ],
  },

  // 黑名单
  {
    path: "/blacklist",
    meta: {
      hideKey: "blacklist",
      authRequired: true,
    },
    component: Layout,
    children: [
      {
        path: "",
        name: "blacklist",
        component: Blacklist,
      },
    ],
  },
  // Auth
  {
    path: "/authentication",
    component: Layout,
    meta: {
      hideKey: "authentication",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "authentication",
        component: () => import("@/views/Auth/Authn.vue"),
      },
      {
        path: "create",
        name: "authenticationCreate",
        component: () => import("@/views/Auth/AuthnCreate.vue"),
      },
      {
        path: "detail/:id",
        name: "authenticationDetail",
        component: () => import("@/views/Auth/AuthnDetails.vue"),
      },
    ],
  },
  {
    path: "/authorization",
    component: Layout,
    meta: {
      hideKey: "authorization",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "authorization",
        component: () => import("@/views/Auth/Authz.vue"),
      },
      {
        path: "create",
        name: "authorizationCreate",
        component: () => import("@/views/Auth/AuthzCreate.vue"),
      },
      {
        path: "settings",
        name: "authorizationSetting",
        component: () => import("@/views/Auth/AuthzSetting.vue"),
      },
      {
        path: "detail/:type",
        name: "authorizationDetail",
        component: () => import("@/views/Auth/AuthzDetails.vue"),
      },
    ],
  },
  //gateway
  {
    path: "/gateway",
    component: Layout,
    meta: {
      hideKey: "gateway",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "gateway",
        component: Gateway,
      },
      {
        path: "create/:name",
        name: "gateway-create",
        component: GatewayCreate,
      },
      {
        path: "detail/:name",
        name: "gateway-detail",
        component: GatewayDetail,
        children: [
          {
            path: "basic",
            name: "gateway-detail-basic",
            component: GatewayDetailBasic,
          },
          {
            path: "listeners",
            name: "gateway-detail-listeners",
            component: GatewayDetailListener,
          },
          {
            path: "auth",
            name: "gateway-detail-auth",
            component: GatewayDetailAuth,
          },
          {
            path: "clients",
            name: "gateway-detail-clients",
            component: GatewayDetailClients,
          },
        ],
      },
    ],
  },
  //iot
  {
    path: "/iot",
    component: Layout,
    meta: {
      hideKey: "iot",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "iot",
        component: IoT,
      },
    ],
  },
  //bridge
  {
    path: "/bridge",
    component: Layout,
    meta: {
      hideKey: "bridge",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "bridge",
        component: Bridge,
      },
      {
        path: "create",
        name: "bridge-create",
        component: BridgeCreate,
      },
    ],
  },
  {
    path: "/advanced",
    component: Layout,
    meta: {
      hideKey: "advanced",
      authRequired: true,
    },
    children: [
      {
        path: "",
        name: "advanced",
        component: Advanced,
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
export function toLogin(path?: string): void {
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
