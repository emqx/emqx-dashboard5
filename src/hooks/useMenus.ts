import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import useStreamingStatus from './useStreamingStatus'

export interface Menu {
  title: string
  path?: string
  icon?: string
  children?: Menu[]
  disabled?: boolean
}

export default (): {
  menuList: ComputedRef<Menu[]>
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

  const { isStreamingEnabled } = useStreamingStatus()
  const streaming = computed(() => [
    { title: 'streaming-overview', path: '/streaming-overview' },
    { title: 'stream', path: '/stream', disabled: !isStreamingEnabled.value },
    {
      title: 'consumer-group',
      path: '/consumer-group',
      disabled: !isStreamingEnabled.value,
    },
    {
      title: 'streaming-authn',
      path: '/streaming-authn',
      disabled: !isStreamingEnabled.value,
    },
    {
      title: 'streaming-authz',
      path: '/streaming-authz',
      disabled: !isStreamingEnabled.value,
    },
  ])

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
    { title: 'license', path: '/license' },
    { title: 'sso', path: '/sso' },
    { title: 'backup', path: '/backup' },
    { title: 'hot-upgrade', path: '/hot-upgrade' },
  ]

  const menuList = computed(() => [
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
      title: 'streaming',
      icon: 'icon-Stream',
      children: streaming.value,
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
  ])

  return {
    menuList,
  }
}
