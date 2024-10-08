export interface Menu {
  title: string
  path?: string
  icon?: string
  children?: Menu[]
}

export default (): {
  menuList: Array<Menu>
} => {
  const monitoring = [
    { title: 'dashboard', path: '/dashboard' },
    { title: 'clients', path: '/clients' },
    { title: 'subscriptions', path: '/subscriptions' },
    { title: 'retained', path: '/retained' },
  ]

  const accessControl = [
    { title: 'authentication', path: '/authentication' },
    { title: 'authorization', path: '/authorization' },
    { title: 'banned-clients', path: '/banned-clients' },
  ]

  const management = [
    {
      title: 'clusterSettings',
      children: [
        { title: 'mqtt', path: '/mqtt' },
        { title: 'listener', path: '/listener' },
        { title: 'log', path: '/log' },
        // { title: 'limiter', path: '/limiter' },
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
    { title: 'rules', path: '/rule' },
    { title: 'connector', path: '/connector' },
  ]

  const diagnose = [
    { title: 'websocket', path: '/websocket' },
    { title: 'log-trace', path: '/log-trace' },
  ]

  const system = [
    { title: 'users', path: '/users' },
    { title: 'api-key', path: '/api-key' },
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
