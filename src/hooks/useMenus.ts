import type { Component } from 'vue'
import { filterItemsByFeatureGate } from '@/common/featureGate'
import {
  TextAlignCenter,
  Database,
  Gauge,
  Layers,
  Server,
  Settings,
  ShieldCheck,
  Stethoscope,
  Workflow,
  Blocks,
  Bot,
} from 'lucide-vue-next'

export interface Menu {
  title: string
  path?: string
  icon?: Component
  children?: Menu[]
}

const useMenus = (): {
  menuList: Ref<Array<Menu>>
} => {
  const store = useStore()

  const monitoring = [
    { title: 'dashboard', path: '/dashboard' },
    { title: 'clients', path: '/clients' },
    { title: 'subscriptions', path: '/subscriptions' },
    { title: 'namespace-metrics', path: '/namespace-metrics' },
    { title: 'retained', path: '/retained' },
    { title: 'delayed-pub', path: '/delayed-pub' },
    { title: 'alarm', path: '/alarm' },
  ]

  const accessControl = [
    { title: 'authentication', path: '/authentication' },
    { title: 'authorization', path: '/authorization' },
    { title: 'banned-clients', path: '/banned-clients' },
    { title: 'flapping-detect', path: '/flapping-detect' },
  ]

  const management = [
    {
      title: 'clusterSettings',
      children: [
        { title: 'mqtt', path: '/mqtt' },
        { title: 'cluster', path: '/cluster' },
        { title: 'namespace', path: '/namespace' },
        { title: 'rule-engine-security', path: '/rule-engine-security' },
        { title: 'listener', path: '/listener' },
        { title: 'dashboard-listeners', path: '/dashboard-listeners' },
        { title: 'certificates', path: '/certificates' },
        { title: 'log', path: '/log' },
        { title: 'monitoring', path: '/monitoring' },
        { title: 'cluster-linking', path: '/cluster-linking' },
      ],
    },
    {
      title: 'advancedMQTT',
      children: [
        { title: 'topic-rewrite', path: '/topic-rewrite' },
        { title: 'auto-sub', path: '/auto-sub' },
        { title: 'delayed-pub', path: '/delayed-pub-configuration' },
        { title: 'file-transfer', path: '/file-transfer' },
      ],
    },
    {
      title: 'extensions',
      children: [
        { title: 'gateway', path: '/gateway' },
        { title: 'exhook', path: '/exhook' },
      ],
    },
  ]

  const integration = [
    { title: 'webhook', path: '/webhook' },
    { title: 'flowDesigner', path: '/flow' },
    { title: 'rules', path: '/rule' },
    { title: 'connector', path: '/connector' },
  ]

  const smartDataHub = [
    { title: 'schema', path: '/schema' },
    { title: 'schema-validation', path: '/schema-validation' },
    { title: 'message-transform', path: '/message-transform' },
  ]

  const diagnose = [
    { title: 'websocket', path: '/websocket' },
    { title: 'topic-metrics', path: '/topic-metrics' },
    { title: 'slow-sub', path: '/slow-sub' },
    { title: 'log-trace', path: '/log-trace' },
    { title: 'dropped-analysis', path: '/dropped-analysis' },
  ]

  const system = [
    { title: 'users', path: '/users' },
    { title: 'audit-log', path: '/audit-log' },
    { title: 'api-key', path: '/api-key' },
    { title: 'license', path: '/license' },
    { title: 'sso', path: '/sso' },
    { title: 'backup', path: '/backup' },
    // { title: 'hot-upgrade', path: '/hot-upgrade' },
  ]

  const totalMenuList = [
    {
      title: 'monitoring',
      icon: Gauge,
      children: monitoring,
    },
    {
      title: 'auth',
      icon: ShieldCheck,
      children: accessControl,
    },
    {
      title: 'ruleengine',
      icon: Workflow,
      children: integration,
    },
    {
      title: 'smart-data-hub',
      icon: Database,
      children: smartDataHub,
    },
    {
      title: 'message-queue',
      icon: Layers,
      path: '/queues',
    },
    {
      title: 'message-stream',
      icon: TextAlignCenter,
      path: '/streams',
    },
    {
      title: 'plugins',
      icon: Blocks,
      path: '/plugins',
    },
    {
      title: 'a2a-registry',
      icon: Bot,
      path: '/a2a-registry',
    },
    {
      title: 'management',
      icon: Settings,
      children: management,
    },
    {
      title: 'diagnose',
      icon: Stethoscope,
      children: diagnose,
    },
    {
      title: 'system',
      icon: Server,
      children: system,
    },
  ]

  const menuList = computed(() => {
    // if (isNamespaceUser.value) {
    //   return totalMenuList.filter((menu) => menu.title === 'ruleengine')
    // }
    return filterItemsByFeatureGate(totalMenuList, store.state.featureGate)
  })

  return {
    menuList,
  }
}

export default useMenus

export const usePathInMenu = () => {
  const { t, te } = useI18nTl('Base')

  const createChildReg = (path: string) => new RegExp(`${path}(/(\\w|-|:)+)+$`)

  const { menuList } = useMenus()

  const getMenuItemByPath = (path: string): Menu | undefined => {
    let ret = undefined
    const walk = (menuItem: Menu) => {
      if (menuItem.path === path) {
        ret = menuItem
      }
      if (menuItem.children) {
        menuItem.children.forEach((item) => walk(item))
      }
    }
    menuList.value.forEach((item) => walk(item))
    return ret
  }

  const findPathParentAndBlock = (path: string) => {
    let parent: Menu | any = undefined
    const walk = (menuItem: Menu): boolean => {
      if (menuItem.path) {
        const isTarget = menuItem.path === path
        const isChild = createChildReg(menuItem.path).test(path)
        if (isChild) {
          parent = menuItem
        }
        return isTarget || isChild
      } else if (menuItem.children) {
        return menuItem.children.some((item: Menu) => walk(item))
      }
      return false
    }

    const block = menuList.value.find((item) => walk(item))
    return {
      parent,
      parentLabel: parent ? t(`components.${parent.title}`) : undefined,
      blockTitle: block ? t(`components.${block.title}`) : '',
    }
  }

  const getRouteLabel = (route: RouteRecordRaw): string | undefined => {
    if (!route?.name || typeof route.name !== 'string') {
      return undefined
    }
    const labelKey = route.name
    const label = te(`components.${labelKey}`) ? t(`components.${labelKey}`) : titleCase(route.name)
    return label
  }

  return {
    findPathParentAndBlock,
    createChildReg,
    getRouteLabel,
    getMenuItemByPath,
  }
}
