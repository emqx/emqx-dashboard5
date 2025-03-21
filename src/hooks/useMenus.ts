import useI18nTl from './useI18nTl'

export interface Menu {
  title: string
  path?: string
  icon?: string
  children?: Menu[]
}

const useMenus = (): {
  menuList: Array<Menu>
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
    { title: 'schema-validation', path: '/schema-validation' },
    { title: 'schema', path: '/schema' },
    { title: 'message-transform', path: '/message-transform' },
  ]

  const diagnose = [
    { title: 'websocket', path: '/websocket' },
    { title: 'topic-metrics', path: '/topic-metrics' },
    { title: 'slow-sub', path: '/slow-sub' },
    { title: 'log-trace', path: '/log-trace' },
  ]

  const system = [
    { title: 'users', path: '/users' },
    { title: 'audit-log', path: '/audit-log' },
    { title: 'api-key', path: '/api-key' },
    // { title: 'license', path: '/license' },
    { title: 'sso', path: '/sso' },
    { title: 'backup', path: '/backup' },
    { title: 'hot-upgrade', path: '/hot-upgrade' },
  ]

  const menuList = [
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

  return {
    menuList,
  }
}
export default useMenus

export const useMenusTools = () => {
  const { t } = useI18nTl('Base')
  const { menuList } = useMenus()

  const createChildReg = (path: string) => new RegExp(`${path}(/(\\w|-)+)+$`)

  const findParentAndBlock = (path: string) => {
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

    const block = menuList.find((item) => walk(item))
    return {
      parentLabel: parent ? t(`components.${parent.title}`) : undefined,
      blockTitle: block ? t(`components.${block.title}`) : '',
    }
  }
  return {
    findParentAndBlock,
  }
}
