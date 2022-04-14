import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/views/Base/Login.vue'
import store from '@/store'
import Layout from '@/views/Base/Layout.vue'
import KeepAliveChildren from '@/views/Base/KeepAliveChildren.vue'
import Overview from '@/views/Dashboard/Overview.vue'
import Nodes from '@/views/Dashboard/Nodes.vue'
import NodeDetail from '@/views/Dashboard/NodeDetail.vue'
import Metrics from '@/views/Dashboard/Metrics.vue'
import Alarm from '@/views/Alarm/Alarm.vue'
import TopicMetrics from '@/views/Diagnose/TopicMetrics.vue'
import Websocket from '@/views/Diagnose/WebSocket.vue'
import SlowSub from '@/views/Diagnose/SlowSub.vue'
import SlowSubConfig from '@/views/Diagnose/SlowSubConfig.vue'
import LogTrace from '@/views/Diagnose/LogTrace/LogTrace.vue'
import LogTraceDetail from '@/views/Diagnose/LogTrace/LogTraceDetail.vue'
import Clients from '@/views/Clients/Clients.vue'
import ClientDetails from '@/views/Clients/ClientDetails.vue'
import Topics from '@/views/Topics/Topics.vue'
import Subscriptions from '@/views/Subscriptions/Subscriptions.vue'
import Advanced from '@/views/Config/Advanced/Advanced.vue'
import BasicConfig from '@/views/Config/BasicConfig/BasicConfig.vue'
import Users from '@/views/General/Users.vue'
import Blacklist from '@/views/General/Blacklist.vue'
import Gateway from '@/views/Gateway/Gateway.vue'
import GatewayDetail from '@/views/Gateway/GatewayDetail.vue'
import GatewayDetailBasic from '@/views/Gateway/components/basic.vue'
import GatewayDetailListener from '@/views/Gateway/components/listeners.vue'
import GatewayDetailAuth from '@/views/Gateway/components/auth.vue'
import GatewayDetailClients from '@/views/Gateway/components/clients.vue'
import GatewayCreate from '@/views/Gateway/GatewayCreate.vue'
import IoT from '@/views/RuleEngine/IoT/IoT.vue'
import IoTCreate from '@/views/RuleEngine/IoT/IoTCreate.vue'
import IoTDetail from '@/views/RuleEngine/IoT/IoTDetail.vue'
import Bridge from '@/views/RuleEngine/Bridge/DataBridge.vue'
import BridgeCreate from '@/views/RuleEngine/Bridge/BridgeCreate.vue'
import BridgeDetail from '@/views/RuleEngine/Bridge/BridgeDetail.vue'
import Connector from '@/views/RuleEngine/Connector/Connector.vue'
import ConnectorCreate from '@/views/RuleEngine/Connector/ConnectorCreate.vue'
import FlowChart from '@/views/RuleEngine/FlowChart/FlowChart.vue'
import APIKey from '@/views/APIKey/APIKey.vue'
import Plugins from '@/views/Plugins/Plugins.vue'
import PluginInstall from '@/views/Plugins/PluginInstall.vue'
import PluginDetail from '@/views/Plugins/PluginDetail.vue'
import ConfigDocs from '@/views/Config/ConfigDocs.vue'
import Exhook from '@/views/Exhook/Exhook.vue'
import ExhookCreate from '@/views/Exhook/ExhookCreate.vue'
import ExhookDetail from '@/views/Exhook/ExhookDetail.vue'
import Listener from '@/views/Listener/Listener.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
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
    component: Login,
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
        component: Overview,
        meta: {},
      },
      {
        path: 'nodes',
        name: 'nodes',
        component: Nodes,
        meta: {},
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: Metrics,
        meta: {},
      },
      {
        path: 'nodes/:nodeName',
        name: 'nodeDetail',
        component: NodeDetail,
        meta: {
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: '/alarm',
    component: Layout,
    meta: {
      hideKey: 'alarm',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'alarm',
        component: Alarm,
      },
    ],
  },

  // Connections
  {
    path: '/clients',
    component: Layout,
    meta: {
      hideKey: 'clients',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'clients',
        component: Clients,
      },
      {
        path: 'detail/:clientId',
        name: 'clients-detail',
        component: ClientDetails,
      },
    ],
  },

  // Topics
  {
    path: '/topics',
    component: Layout,
    meta: {
      hideKey: 'topics',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'topics',
        component: Topics,
      },
    ],
  },
  // Subscription
  {
    path: '/subscriptions',
    component: Layout,
    meta: {
      hideKey: 'subscriptions',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'subscriptions',
        component: Subscriptions,
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
        component: Users,
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
        component: Blacklist,
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
        path: 'settings',
        name: 'authorizationSetting',
        component: () => import('@/views/Auth/AuthzSetting.vue'),
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
        component: Gateway,
      },
      {
        path: 'create/:name',
        name: 'gateway-create',
        component: GatewayCreate,
      },
      {
        path: 'detail/:name',
        name: 'gateway-detail',
        component: GatewayDetail,
        children: [
          {
            path: 'basic',
            name: 'gateway-detail-basic',
            component: GatewayDetailBasic,
          },
          {
            path: 'listeners',
            name: 'gateway-detail-listeners',
            component: GatewayDetailListener,
          },
          {
            path: 'auth',
            name: 'gateway-detail-auth',
            component: GatewayDetailAuth,
          },
          {
            path: 'clients',
            name: 'gateway-detail-clients',
            component: GatewayDetailClients,
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
        component: APIKey,
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
        component: Plugins,
      },
      {
        path: 'install',
        name: 'plugin-install',
        component: PluginInstall,
      },
      {
        path: 'detail/:pluginName-:pluginVersion',
        name: 'plugin-detail',
        component: PluginDetail,
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
        component: Exhook,
      },
      {
        path: 'create',
        name: 'exhook-create',
        component: ExhookCreate,
      },
      {
        path: 'detail/:exhookName',
        name: 'exhook-detail',
        component: ExhookDetail,
      },
    ],
  },
  // IoT
  {
    path: '/iot',
    component: Layout,
    meta: {
      hideKey: 'iot',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'iot',
        component: IoT,
      },
      {
        path: 'create',
        component: KeepAliveChildren,
        redirect: '/iot/create/form',
        children: [
          {
            path: 'form',
            name: 'iot-create',
            component: IoTCreate,
          },
          {
            path: 'bridge',
            name: 'create-bridge-for-create-iot',
            component: BridgeCreate,
          },
          {
            path: 'bridge/detail',
            name: 'edit-bridge-for-create-iot',
            component: BridgeDetail,
          },
        ],
      },
      {
        path: 'detail/:id',
        component: KeepAliveChildren,
        redirect: '/iot/detail/:id/info',
        children: [
          {
            path: 'info',
            name: 'iot-detail',
            component: IoTDetail,
          },
          {
            path: 'bridge',
            name: 'create-bridge-for-edit-iot',
            component: BridgeCreate,
          },
          {
            path: 'bridge/detail',
            name: 'edit-bridge-for-edit-iot',
            component: BridgeDetail,
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
      subMenu: true,
      showSubMenuInFirstLevel: true,
    },
    children: [
      {
        path: 'dataBridge',
        name: 'data-bridge',
        component: Bridge,
        children: [
          {
            path: 'create',
            name: 'bridge-create',
            component: BridgeCreate,
          },
          {
            path: 'detail/:id',
            name: 'bridge-detail',
            component: BridgeDetail,
          },
        ],
      },
      {
        path: 'connector',
        name: 'bridge-connector',
        component: Connector,
        children: [
          {
            path: 'create',
            name: 'connector-create',
            component: ConnectorCreate,
          },
        ],
      },
    ],
  },
  // Basic config
  {
    path: '/basic-config',
    component: Layout,
    meta: {
      hideKey: 'basic-config',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'basic-config',
        component: BasicConfig,
      },
    ],
  },
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
        component: Listener,
      },
    ],
  },
  // Advanced
  {
    path: '/advanced',
    component: Layout,
    meta: {
      hideKey: 'advanced',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'advanced',
        component: Advanced,
      },
    ],
  },
  // Config docs
  {
    path: '/config-docs',
    component: Layout,
    meta: {
      hideKey: 'config-docs',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'config-docs',
        component: ConfigDocs,
      },
    ],
  },
  // Flow chart for IoT rule
  {
    path: '/flow-chart',
    component: Layout,
    meta: {
      hideKey: 'flow-chart',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'flow-chart',
        component: FlowChart,
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
        component: Websocket,
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
        component: TopicMetrics,
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
        component: SlowSub,
      },
      {
        path: 'config',
        name: 'slow-sub-config',
        component: SlowSubConfig,
      },
    ],
  },
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
        component: LogTrace,
      },
      {
        path: 'detail/:id',
        name: 'log-trace-detail',
        component: LogTraceDetail,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
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
