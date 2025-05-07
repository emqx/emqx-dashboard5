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
    { title: 'subscriptions', path: '/subscriptions' },
    { title: 'monitoringMetrics', path: '/monitoring-metrics' },
    { title: 'dropped-analysis', path: '/dropped-analysis' },
    { title: 'alarm', path: '/alarm' },
  ]

  const management = [{ title: 'listener', path: '/listener' }]

  const integration = [
    { title: 'rules', path: '/rule' },
    { title: 'connector', path: '/connector' },
  ]

  const diagnose = [
    { title: 'log-trace', path: '/log-trace' },
    { title: 'topic-metrics', path: '/topic-metrics' },
  ]

  const menuList = [
    {
      title: 'monitoring',
      icon: 'icon-monitoring',
      children: monitoring,
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
  ]

  return {
    menuList,
  }
}
