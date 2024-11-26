import store from '@/store'
import { Component } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Layout = (): Promise<Component> => import('@/views/Base/Layout.vue')
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

  // Overview
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

  // Alarm
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
        component: () => import('@/views/Clients/Clients.vue'),
      },
      {
        path: 'detail/:clientId',
        name: 'clients-detail',
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

  // Delayed Pub
  {
    path: '/delayed-pub',
    component: Layout,
    meta: {
      hideKey: 'delayed-pub',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'delayed-pub',
        component: () => import('@/views/DelayedPub/DelayedPub.vue'),
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

  // Audit Log
  {
    path: '/audit-log',
    component: Layout,
    meta: {
      hideKey: 'audit-log',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'audit-log',
        component: () => import('@/views/General/AuditLog.vue'),
      },
    ],
  },

  // Black list
  {
    path: '/banned-clients',
    meta: {
      hideKey: 'banned-clients',
      authRequired: true,
    },
    component: Layout,
    children: [
      {
        path: '',
        name: 'banned-clients',
        component: () => import('@/views/General/BannedClient.vue'),
      },
    ],
  },
  {
    path: '/flapping-detect',
    meta: {
      hideKey: 'flapping-detect',
      authRequired: true,
    },
    component: Layout,
    children: [
      {
        path: '',
        name: 'flapping-detect',
        component: () => import('@/views/General/FlappingDetect.vue'),
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
        name: 'authentication-create',
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
        name: 'authorization-create',
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
            path: 'clients',
            name: 'gateway-detail-clients',
            component: () => import('@/views/Gateway/components/clients.vue'),
          },
        ],
      },
    ],
  },
  // API Key
  {
    path: '/api-key',
    component: Layout,
    meta: {
      hideKey: 'api-key',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'api-key',
        component: () => import('@/views/General/APIKey.vue'),
      },
    ],
  },
  // License
  {
    path: '/license',
    component: Layout,
    meta: {
      hideKey: 'license',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'license',
        component: () => import('@/views/General/License.vue'),
      },
    ],
  },
  // SSO
  {
    path: '/sso',
    component: Layout,
    meta: {
      hideKey: 'sso',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'sso',
        component: () => import('@/views/General/SSO.vue'),
      },
      {
        path: ':backend',
        name: 'SSO-detail',
        component: () => import('@/views/General/SSODetail.vue'),
      },
    ],
  },
  // Backup
  {
    path: '/backup',
    component: Layout,
    meta: {
      hideKey: 'backup',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'backup',
        component: () => import('@/views/General/Backup.vue'),
      },
    ],
  },
  // Hot Upgrade
  {
    path: '/hot-upgrade',
    component: Layout,
    meta: {
      hideKey: 'hot-upgrade',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'hot-upgrade',
        component: () => import('@/views/General/HotUpgrade.vue'),
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
  // Webhook
  {
    path: '/webhook',
    component: Layout,
    meta: {
      hideKey: 'Webhook',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'webhook',
        component: () => import('@/views/Webhook/Webhook.vue'),
      },
      {
        path: 'create',
        name: 'webhook-create',
        component: () => import('@/views/Webhook/WebhookCreate.vue'),
      },
      {
        path: ':name',
        name: 'webhook-detail',
        component: () => import('@/views/Webhook/WebhookDetail.vue'),
      },
    ],
  },
  // Rule
  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/rules',
    meta: {
      hideKey: 'rule',
      authRequired: true,
      subMenu: true,
      showSubMenuInFirstLevel: true,
    },
    children: [
      {
        path: 'rules',
        name: 'rule',
        component: () => import('@/views/RuleEngine/Rule/Rule.vue'),
      },
      {
        path: 'rules/create',
        name: 'rule-create',
        component: () => import('@/views/RuleEngine/Rule/RuleCreate.vue'),
        meta: { hideInMenu: true },
      },
      {
        path: 'rules/:id',
        name: 'rule-detail',
        component: () => import('@/views/RuleEngine/Rule/RuleDetail.vue'),
        meta: { hideInMenu: true },
      },
      {
        path: 'actions',
        name: 'actions',
        component: () => import('@/views/RuleEngine/Bridge/DataBridge.vue'),
      },
      {
        path: 'actions/:id',
        name: 'action-detail',
        component: () => import('@/views/RuleEngine/Bridge/BridgeDetail.vue'),
        meta: { hideInMenu: true },
      },
      // {
      //   path: 'actions/create',
      //   name: 'action-create',
      //   component: () => import('@/views/RuleEngine/Bridge/BridgeCreate.vue'),
      //   meta: { hideInMenu: true },
      // },
      {
        path: 'source',
        name: 'source',
        component: () => import('@/views/RuleEngine/Source/Source.vue'),
      },
      {
        path: 'source/:id',
        name: 'source-detail',
        component: () => import('@/views/RuleEngine/Source/SourceDetail.vue'),
        meta: { hideInMenu: true },
      },
    ],
  },
  // Connector
  {
    path: '/connector',
    component: Layout,
    meta: {
      hideKey: 'connectors',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'connector',
        component: () => import('@/views/RuleEngine/Connector/Connector.vue'),
      },
      {
        path: 'create',
        name: 'connector-create',
        component: () => import('@/views/RuleEngine/Connector/ConnectorCreate.vue'),
      },
      {
        path: ':id',
        name: 'connector-detail',
        component: () => import('@/views/RuleEngine/Connector/ConnectorDetail.vue'),
      },
    ],
  },
  // Flow
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
        component: () => import('@/views/Flow/Index.vue'),
      },
      {
        path: 'create',
        name: 'flow-create',
        component: () => import('@/views/Flow/FlowHandler.vue'),
      },
      {
        path: ':id',
        name: 'flow-detail',
        component: () => import('@/views/Flow/FlowHandler.vue'),
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
        path: 'session-persistence',
        name: 'mqtt-session-persistence',
        component: () => import('@/views/Config/BasicConfig/DurableSessions.vue'),
      },
      {
        path: 'retainer',
        name: 'mqtt-retainer',
        component: () => import('@/views/Config/BasicConfig/Retainer.vue'),
      },
      {
        path: 'system-topic',
        name: 'mqtt-system-topic',
        component: () => import('@/views/Config/BasicConfig/SystemTopics.vue'),
      },
    ],
  },
  // Advanced MQTT
  {
    path: '/topic-rewrite',
    component: Layout,
    meta: {
      hideKey: 'topic-rewrite',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'topic-rewrite',
        component: () => import('@/views/AdvancedMQTT/Rewrite.vue'),
      },
    ],
  },
  {
    path: '/auto-sub',
    component: Layout,
    meta: {
      hideKey: 'auto-sub',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'auto-sub',
        component: () => import('@/views/AdvancedMQTT/AutoSub.vue'),
      },
    ],
  },
  {
    path: '/delayed-pub-configuration',
    component: Layout,
    meta: {
      hideKey: 'delayed-pub-configuration',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'delayed-pub-configuration',
        component: () => import('@/views/AdvancedMQTT/DelayedPub.vue'),
      },
    ],
  },
  {
    path: '/file-transfer',
    component: Layout,
    meta: {
      hideKey: 'file-transfer',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'file-transfer',
        component: () => import('@/views/Config/FileTransfer.vue'),
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
  // {
  //   path: '/limiter',
  //   component: Layout,
  //   meta: {
  //     hideKey: 'limiter',
  //     authRequired: true,
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'limiter',
  //       component: () => import('@/views/Config/BasicConfig/Limiter.vue'),
  //     },
  //   ],
  // },
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
  {
    path: '/cluster-linking',
    component: Layout,
    meta: {
      hideKey: 'cluster-linking',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'cluster-linking',
        component: () => import('@/views/Config/ClusterLinking/ClusterLinking.vue'),
      },
      {
        path: 'create',
        name: 'cluster-linking-create',
        component: () => import('@/views/Config/ClusterLinking/ClusterLinkingCreate.vue'),
      },
      {
        path: ':linkingName',
        name: 'cluster-linking-detail',
        component: () => import('@/views/Config/ClusterLinking/ClusterLinkingDetail.vue'),
      },
    ],
  },
  // Schema Validation
  {
    path: '/schema-validation',
    component: Layout,
    meta: {
      hideKey: 'schema-validation',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'schema-validation',
        component: () => import('@/views/RuleEngine/SchemaValidation/SchemaValidation.vue'),
      },
      {
        path: 'create',
        name: 'schema-validation-create',
        component: () => import('@/views/RuleEngine/SchemaValidation/ValidationCreate.vue'),
      },
      {
        path: ':validationName',
        name: 'schema-validation-detail',
        component: () => import('@/views/RuleEngine/SchemaValidation/ValidationDetail.vue'),
      },
    ],
  },
  // Message Transform
  {
    path: '/message-transform',
    component: Layout,
    meta: {
      hideKey: 'message-transform',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'message-transform',
        component: () => import('@/views/RuleEngine/MessageTransform/MessageTransform.vue'),
      },
      {
        path: 'create',
        name: 'message-transform-create',
        component: () => import('@/views/RuleEngine/MessageTransform/TransformCreate.vue'),
      },
      {
        path: ':transformName',
        name: 'message-transform-detail',
        component: () => import('@/views/RuleEngine/MessageTransform/TransformDetail.vue'),
      },
    ],
  },
  // Schema Registry
  {
    path: '/schema',
    component: Layout,
    redirect: '/schema/internal',
    meta: {
      hideKey: 'schema',
      authRequired: true,
      subMenu: true,
      showSubMenuInFirstLevel: true,
    },
    children: [
      {
        path: 'internal',
        name: 'internal-schema',
        component: () => import('@/views/RuleEngine/Schema/Schema.vue'),
      },
      {
        path: 'internal/create',
        name: 'internal-schema-create',
        component: () => import('@/views/RuleEngine/Schema/SchemaCreate.vue'),
        meta: { hideInMenu: true },
      },
      {
        path: 'internal/:schemaName',
        name: 'internal-schema-detail',
        component: () => import('@/views/RuleEngine/Schema/SchemaDetail.vue'),
        meta: { hideInMenu: true },
      },
      {
        path: 'external',
        name: 'external-schema',
        component: () => import('@/views/RuleEngine/Schema/ExternalSchema.vue'),
      },
      {
        path: 'external/create',
        name: 'external-schema-create',
        component: () => import('@/views/RuleEngine/Schema/ExternalSchemaCreate.vue'),
        meta: { hideInMenu: true },
      },
      {
        path: 'external/:schemaName',
        name: 'external-schema-detail',
        component: () => import('@/views/RuleEngine/Schema/ExternalSchemaDetail.vue'),
        meta: { hideInMenu: true },
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
  // SSO
  {
    path: '/sso',
    name: 'sso-login',
    component: () => import('@/views/Base/SSOLogin.vue'),
  },
  // Stream Overview
  {
    path: '/streaming-overview',
    component: Layout,
    meta: {
      hideKey: 'streaming-overview',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'stream',
        component: () => import('@/views/Streaming/StreamingOverview.vue'),
      },
    ],
  },
  // Stream
  {
    path: '/stream',
    component: Layout,
    meta: {
      hideKey: 'stream',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'stream',
        component: () => import('@/views/Streaming/Stream.vue'),
      },
      {
        path: 'detail/:name',
        name: 'stream-detail',
        component: () => import('@/views/Streaming/StreamDetail.vue'),
      },
    ],
  },
  // Consumer Group
  {
    path: '/consumer-group',
    component: Layout,
    meta: {
      hideKey: 'consumer-group',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'consumer-group',
        component: () => import('@/views/Streaming/ConsumerGroup.vue'),
      },
      {
        path: 'detail/:name',
        name: 'consumer-group-detail',
        component: () => import('@/views/Streaming/ConsumerGroupDetail.vue'),
      },
    ],
  },
  // Streaming Authn
  {
    path: '/streaming-authn',
    component: Layout,
    meta: {
      hideKey: 'streaming-authn',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'streaming-authn',
        component: () => import('@/views/Streaming/StreamingAuthn.vue'),
      },
    ],
  },
  // Streaming Authz
  {
    path: '/streaming-authz',
    component: Layout,
    meta: {
      hideKey: 'streaming-authz',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'streaming-authz',
        component: () => import('@/views/Streaming/StreamingAuthz.vue'),
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
  store.commit('CLEAR_ABORT_CONTROLLERS') // Cenceled All pending request
  store.commit('UPDATE_LOGIN_BACKEND', null) // Cenceled All pending request
  const currentPath = router.currentRoute.value.path
  currentPath !== '/login' &&
    router.push({
      path: '/login',
      query: { to: path ? path : currentPath ?? undefined },
    })
}

export default router
