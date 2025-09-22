export interface Menu {
  title: string
  path?: string
  icon?: string
  children?: Menu[]
}

const useMenus = (): {
  menuList: Ref<Array<Menu>>
} => {
  const monitoring = [
    { title: 'dashboard', path: '/dashboard' },
    { title: 'clients', path: '/clients' },
    { title: 'subscriptions', path: '/subscriptions' },
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
        { title: 'listener', path: '/listener' },
        { title: 'log', path: '/log' },
        { title: 'monitoring', path: '/monitoring' },
        { title: 'cluster-linking', path: '/cluster-linking' },
        // { title: 'limiter', path: '/limiter' },
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
        { title: 'plugins', path: '/plugins' },
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
    { title: 'hot-upgrade', path: '/hot-upgrade' },
  ]

  const totalMenuList = [
    {
      title: 'monitoring',
      icon: 'icon-monitoring',
      children: monitoring,
    },
    {
      title: 'auth',
      icon: 'icon-authentication',
      children: accessControl,
    },
    {
      title: 'ruleengine',
      icon: 'icon-integration',
      children: integration,
    },
    {
      title: 'smart-data-hub',
      icon: 'icon-a-SmartDataHub',
      children: smartDataHub,
    },
    {
      title: 'message-queue',
      icon: 'icon-a-messagequeue',
      path: '/message-queue',
    },
    {
      title: 'management',
      icon: 'icon-configuration',
      children: management,
    },
    {
      title: 'diagnose',
      icon: 'icon-diagnosis',
      children: diagnose,
    },
    {
      title: 'system',
      icon: 'icon-system',
      children: system,
    },
  ]

  const menuList = computed(() => {
    // if (isNamespaceUser.value) {
    //   return totalMenuList.filter((menu) => menu.title === 'ruleengine')
    // }
    return totalMenuList
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

  const getRouteLabel = (route: RouteRecordRaw): string => {
    if (!route?.name || typeof route.name !== 'string') {
      return route.name?.toString() ?? ''
    }
    const labelKey = route.name
    const label = te(`components.${labelKey}`) ? t(`components.${labelKey}`) : titleCase(route.name)
    return label
  }

  return {
    findPathParentAndBlock,
    getRouteLabel,
  }
}
