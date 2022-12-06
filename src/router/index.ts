import store from '@/store'
import { Component } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Layout = (): Promise<Component> => import('@/views/Base/Layout.vue')
const BridgeCreate = (): Promise<Component> => import('@/views/RuleEngine/Bridge/BridgeCreate.vue')
// const Cluster =()=> import('@/views/Config/BasicConfig/Cluster.vue')
// const Dashboard =()=> import('@/views/Config/BasicConfig/Dashboard.vue')
// const Limiter =()=> import('@/views/Config/BasicConfig/Limiter.vue')

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      authRequired: false,
    },
    component: () => import('@/views/Base/Login.vue'),
  },

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/overview',
    meta: {
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/Dashboard/Overview.vue'),
        meta: {},
      },
      {
        path: 'nodes',
        name: 'nodes',
        component: () => import('@/views/Dashboard/Nodes.vue'),
        meta: {},
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: () => import('@/views/Dashboard/Metrics.vue'),
        meta: {},
      },
      {
        path: 'nodes/:nodeName',
        name: 'nodeDetail',
        component: () => import('@/views/Dashboard/NodeDetail.vue'),
        meta: {
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm/current-alarm',
    meta: {
      hideKey: 'alarm',
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'current-alarm',
        name: 'current-alarm',
        component: () => import('@/views/Alarm/CurrentAlarm.vue'),
      },
      {
        path: 'history-alarm',
        name: 'history-alarm',
        component: () => import('@/views/Alarm/HistoryAlarm.vue'),
      },
    ],
  },

  // Connections
  {
    path: '/connections',
    component: Layout,
    meta: {
      hideKey: 'connections',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'connections',
        component: () => import('@/views/Clients/Clients.vue'),
      },
      {
        path: 'detail/:clientId',
        name: 'connection-detail',
        component: () => import('@/views/Clients/ClientDetails.vue'),
      },
    ],
  },

  // Subscription
  {
    path: '/subscriptions',
    redirect: '/subscriptions/subscription',
    component: Layout,
    meta: {
      hideKey: 'subscriptions',
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'subscription',
        name: 'subscription',
        component: () => import('@/views/Subscriptions/Subscriptions.vue'),
      },
      {
        path: 'topics',
        name: 'topics',
        component: () => import('@/views/Topics/Topics.vue'),
      },
    ],
  },

  // Connections
  {
    path: '/retained',
    component: Layout,
    meta: {
      hideKey: 'retained',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'retained',
        component: () => import('@/views/Retained/Retained.vue'),
      },
    ],
  },

  // Users
  {
    path: '/users',
    component: Layout,
    meta: {
      hideKey: 'users',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/General/Users.vue'),
      },
    ],
  },

  // Black list
  {
    path: '/blacklist',
    meta: {
      hideKey: 'blacklist',
      authRequired: true,
    },
    component: Layout,
    children: [
      {
        path: '',
        name: 'blacklist',
        component: () => import('@/views/General/Blacklist.vue'),
      },
    ],
  },
  // Auth
  {
    path: '/authentication',
    component: Layout,
    meta: {
      hideKey: 'authentication',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'authentication',
        component: () => import('@/views/Auth/Authn.vue'),
      },
      {
        path: 'create',
        name: 'authenticationCreate',
        component: () => import('@/views/Auth/AuthnCreate.vue'),
      },
      {
        path: 'detail/:id',
        name: 'authenticationDetail',
        component: () => import('@/views/Auth/AuthnDetails.vue'),
      },
    ],
  },
  {
    path: '/authorization',
    component: Layout,
    meta: {
      hideKey: 'authorization',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'authorization',
        component: () => import('@/views/Auth/Authz.vue'),
      },
      {
        path: 'create',
        name: 'authorizationCreate',
        component: () => import('@/views/Auth/AuthzCreate.vue'),
      },
      {
        path: 'detail/:type',
        name: 'authorizationDetail',
        component: () => import('@/views/Auth/AuthzDetails.vue'),
      },
    ],
  },
  //gateway
  {
    path: '/gateway',
    component: Layout,
    meta: {
      hideKey: 'gateway',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'gateway',
        component: () => import('@/views/Gateway/Gateway.vue'),
      },
      {
        path: 'create/:name',
        name: 'gateway-create',
        component: () => import('@/views/Gateway/GatewayCreate.vue'),
      },
      {
        path: 'detail/:name',
        name: 'gateway-detail',
        component: () => import('@/views/Gateway/GatewayDetail.vue'),
        children: [
          {
            path: 'settings',
            name: 'gateway-detail-settings',
            component: () => import('@/views/Gateway/components/basic.vue'),
          },
          {
            path: 'listeners',
            name: 'gateway-detail-listeners',
            component: () => import('@/views/Gateway/components/listeners.vue'),
          },
          {
            path: 'auth',
            name: 'gateway-detail-auth',
            component: () => import('@/views/Gateway/components/auth.vue'),
          },
          {
            path: 'connections',
            name: 'gateway-detail-connections',
            component: () => import('@/views/Gateway/components/clients.vue'),
          },
        ],
      },
    ],
  },
  // API Key
  {
    path: '/APIKey',
    component: Layout,
    meta: {
      hideKey: 'APIKey',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'APIKey',
        component: () => import('@/views/APIKey/APIKey.vue'),
      },
    ],
  },
  // Plugins
  {
    path: '/plugins',
    component: Layout,
    meta: {
      hideKey: 'Plugins',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'plugins',
        component: () => import('@/views/Plugins/Plugins.vue'),
      },
      {
        path: 'install',
        name: 'plugin-install',
        component: () => import('@/views/Plugins/PluginInstall.vue'),
      },
      {
        path: 'detail/:pluginName-:pluginVersion',
        name: 'plugin-detail',
        component: () => import('@/views/Plugins/PluginDetail.vue'),
      },
    ],
  },
  // Exhook
  {
    path: '/exhook',
    component: Layout,
    meta: {
      hideKey: 'Exhook',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'exhook',
        component: () => import('@/views/Exhook/Exhook.vue'),
      },
      {
        path: 'create',
        name: 'exhook-create',
        component: () => import('@/views/Exhook/ExhookCreate.vue'),
      },
      {
        path: 'detail/:exhookName',
        name: 'exhook-detail',
        component: () => import('@/views/Exhook/ExhookDetail.vue'),
      },
    ],
  },
  // IoT
  {
    path: '/rules',
    component: Layout,
    meta: {
      hideKey: 'iot',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'iot',
        component: () => import('@/views/RuleEngine/IoT/IoT.vue'),
      },
      {
        path: 'create',
        component: () => import('@/views/Base/KeepAliveChildren.vue'),
        redirect: '/iot/create/form',
        children: [
          {
            path: 'form',
            name: 'iot-create',
            component: () => import('@/views/RuleEngine/IoT/IoTCreate.vue'),
          },
        ],
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/Base/KeepAliveChildren.vue'),
        redirect: '/rules/detail/:id/info',
        children: [
          {
            path: 'info',
            name: 'iot-detail',
            component: () => import('@/views/RuleEngine/IoT/IoTDetail.vue'),
          },
          {
            path: 'bridge',
            name: 'create-bridge-for-edit-iot',
            component: BridgeCreate,
          },
        ],
      },
    ],
  },
  // Bridge
  {
    path: '/bridge',
    component: Layout,
    redirect: '/bridge/dataBridge',
    meta: {
      hideKey: 'bridge',
      authRequired: true,
      // subMenu: true,
      // showSubMenuInFirstLevel: true,
    },
    children: [
      {
        path: 'dataBridge',
        name: 'data-bridge',
        component: () => import('@/views/RuleEngine/Bridge/DataBridge.vue'),
        children: [
          {
            path: 'create',
            name: 'bridge-create',
            component: BridgeCreate,
          },
          {
            path: 'detail/:id',
            name: 'bridge-detail',
            component: () => import('@/views/RuleEngine/Bridge/BridgeDetail.vue'),
          },
        ],
      },
    ],
  },
  // configs
  // {
  //   path: '/cluster',
  //   component: Layout,
  //   meta: {
  //     hideKey: 'cluster',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'cluster',
  //       component: Cluster,
  //     },
  //   ],
  // },
  {
    path: '/listener',
    component: Layout,
    meta: {
      hideKey: 'listener',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'listener',
        component: () => import('@/views/Listener/Listener.vue'),
      },
    ],
  },
  // mqtt config
  {
    path: '/mqtt',
    component: Layout,
    redirect: '/mqtt/general',
    meta: {
      hideKey: 'mqtt',
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'general',
        name: 'mqtt-general',
        component: () => import('@/views/Config/BasicConfig/Mqtt.vue'),
      },
      {
        path: 'session',
        name: 'mqtt-session',
        component: () => import('@/views/Config/BasicConfig/Session.vue'),
      },
      {
        path: 'retainer',
        name: 'mqtt-retainer',
        component: () => import('@/views/Config/BasicConfig/Retainer.vue'),
      },
      {
        path: 'system-topic',
        name: 'mqtt-system-topic',
        component: () => import('@/views/Config/BasicConfig/sysTopics.vue'),
      },
      {
        path: 'extension',
        name: 'mqtt-extension',
        component: () => import('@/views/Config/Extension/Extension.vue'),
      },
    ],
  },
  // log config
  {
    path: '/log',
    component: Layout,
    meta: {
      hideKey: 'log',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'log',
        component: () => import('@/views/Config/BasicConfig/Log.vue'),
      },
    ],
  },
  // limiter config
  {
    path: '/limiter',
    component: Layout,
    meta: {
      hideKey: 'limiter',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'limiter',
        component:  () => import('@/views/Config/BasicConfig/Limiter.vue'),
      },
    ],
  },
  // Monitoring integration
  {
    path: '/monitoring',
    component: Layout,
    redirect: '/monitoring/alarm-settings',
    meta: {
      authRequired: true,
      subMenu: true,
    },
    children: [
      {
        path: 'alarm-settings',
        name: 'alarm-settings',
        component: () => import('@/views/Config/Monitoring/AlarmSettings.vue'),
      },
      {
        path: 'integration',
        name: 'monitoring-integration',
        component: () => import('@/views/Config/Monitoring/MonitoringIntegration.vue'),
      },
    ],
  },
  // Flow chart for IoT rule
  {
    path: '/flow',
    component: Layout,
    meta: {
      hideKey: 'flow',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'flow',
        component: () => import('@/views/RuleEngine/FlowChart/FlowChart.vue'),
      },
    ],
  },
  // WebSocket
  {
    path: '/websocket',
    component: Layout,
    meta: {
      hideKey: 'websocket',
      authRequired: true,
    },
    props: {
      keepAlive: true,
    },
    children: [
      {
        path: '',
        name: 'websocket',
        component: () => import('@/views/Diagnose/WebSocket.vue'),
      },
    ],
  },
  // Topic Metrics
  {
    path: '/topic-metrics',
    component: Layout,
    meta: {
      hideKey: 'topicMetrics',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'topic-metrics',
        component: () => import('@/views/Diagnose/TopicMetrics.vue'),
      },
    ],
  },
  // Slow Sub
  {
    path: '/slow-sub',
    component: Layout,
    meta: {
      hideKey: 'slowSub',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'slow-sub',
        component: () => import('@/views/Diagnose/SlowSub.vue'),
      },
      {
        path: 'config',
        name: 'slow-sub-config',
        component: () => import('@/views/Diagnose/SlowSubConfig.vue'),
      },
    ],
  },
  // Log Trace
  {
    path: '/log-trace',
    component: Layout,
    meta: {
      hideKey: 'logTrace',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'log-trace',
        component: () => import('@/views/Diagnose/LogTrace/LogTrace.vue'),
      },
      {
        path: 'detail/:id',
        name: 'log-trace-detail',
        component: () => import('@/views/Diagnose/LogTrace/LogTraceDetail.vue'),
      },
    ],
  },
  // Settings
  {
    path: '/settings',
    component: Layout,
    meta: {
      hideKey: 'settings',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'settings',
        component: () => import('@/views/Settings/Settings.vue'),
      },
    ],
  },
  {
    path: '/help',
    component: Layout,
    meta: {
      hideKey: 'help',
    },
    children: [
      {
        path: '',
        name: 'help',
        component: () => import('@/views/Settings/Help.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: Layout,
    meta: {},
    children: [
      {
        path: '',
        name: 'not-found',
        component: () => import('@/views/Base/NotFound.vue'),
      },
    ],
  },
  // http
  // {
  //   path: '/dashboard-http',
  //   component: Layout,
  //   meta: {
  //     hideKey: 'dashboard-http',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'dashboard-http',
  //       component: Dashboard,
  //     },
  //   ],
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { fullPath, meta } = to
  const { authRequired = false } = meta
  const info = store.state.user

  if (authRequired && !info.token) {
    toLogin(fullPath)
  }
  next()
})

//Logout and go to Login page
export function toLogin(path?: string): void {
  store.commit('UPDATE_USER_INFO', { logOut: true })
  store.commit('UPDATE_EDITION', null)
  const currentPath = router.currentRoute.value.path
  currentPath !== '/login' &&
    router.push({
      path: '/login',
      query: { to: path ? path : currentPath ?? undefined },
    })
}

export default router
