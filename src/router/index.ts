import store from '@/store'

const Layout = (): Promise<Component> => import('@/views/Base/Layout.vue')

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
    },
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/Dashboard/Overview.vue'),
        meta: {},
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

  {
    path: '/subscriptions',
    redirect: '/subscriptions/subscription',
    component: Layout,
    meta: {
      hideKey: 'subscriptions',
      authRequired: true,
      subMenu: true,
      showSubMenuInFirstLevel: true,
    },
    children: [
      {
        path: 'subscription',
        name: 'subscription',
        component: () => import('@/views/Subscriptions/Subscriptions.vue'),
      },
      {
        path: 'client/:clientId',
        name: 'subscription-client',
        component: () => import('@/views/Clients/ClientDetails.vue'),
        meta: { hideInMenu: true },
      },
      {
        path: 'topics',
        name: 'topics',
        component: () => import('@/views/Topics/Topics.vue'),
      },
    ],
  },

  {
    path: '/monitoring-metrics',
    component: Layout,
    meta: {
      hideKey: 'monitoring-metrics',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'monitoring-metrics',
        component: () => import('@/views/Dashboard/Metrics.vue'),
      },
    ],
  },

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
  {
    path: '/log-view',
    component: Layout,
    meta: {
      hideKey: 'log-view',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'log-view',
        component: () => import('@/views/Diagnose/LogView.vue'),
      },
    ],
  },
  {
    path: '/message-analysis',
    component: Layout,
    meta: {
      hideKey: 'message-analysis',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'message-analysis',
        component: () => import('@/views/Diagnose/MessageAnalysis.vue'),
      },
    ],
  },

  {
    path: '/dropped-analysis',
    component: Layout,
    meta: {
      hideKey: 'dropped-analysis',
      authRequired: true,
    },
    children: [
      {
        path: '',
        name: 'dropped-analysis',
        component: () => import('@/views/Diagnose/DroppedAnalysis.vue'),
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

export function toLogin(path?: string): void {
  store.commit('UPDATE_USER_INFO', { logOut: true })
  store.commit('UPDATE_EDITION', null)
  const currentPath = router.currentRoute.value.path
  currentPath !== '/login' &&
    router.push({
      path: '/login',
      query: { to: path ? path : (currentPath ?? undefined) },
    })
}

export default router
