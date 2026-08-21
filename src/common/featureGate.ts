import type { RouteRecordRaw } from 'vue-router'
import { FeatureName } from '@/types/enum'
import type { FeatureGateInfo, FeatureGateState } from '@/types/featureGate'

export const FEATURE_ROUTE_MAP: Record<FeatureName, string[]> = {
  [FeatureName.AI]: ['/a2a-registry'],
  [FeatureName.ClusterLink]: ['/cluster-linking'],
  [FeatureName.Dashboard]: [],
  [FeatureName.DataIntegration]: [
    '/webhook',
    '/flow',
    '/rule',
    '/connector',
    '/rule-engine-security',
  ],
  [FeatureName.Exhook]: ['/exhook'],
  [FeatureName.FileTransfer]: ['/file-transfer'],
  [FeatureName.Gateways]: ['/gateway'],
  [FeatureName.MessageTransformation]: ['/message-transform'],
  [FeatureName.Metrics]: ['/topic-metrics', '/monitoring/integration'],
  [FeatureName.MQTTExtensions]: [
    '/delayed-pub',
    '/delayed-pub-configuration',
    '/topic-rewrite',
    '/auto-sub',
    '/slow-sub',
    '/queues',
    '/streams',
    '/mqtt/queues',
    '/mqtt/streams',
  ],
  [FeatureName.MultiTenancy]: ['/namespace', '/namespace-metrics'],
  [FeatureName.OpenTelemetry]: ['/monitoring/integration'],
  [FeatureName.Plugins]: ['/plugins'],
  [FeatureName.SchemaRegistry]: ['/schema'],
  [FeatureName.SchemaValidation]: ['/schema-validation'],
}

export const createInitialFeatureGateState = (): FeatureGateState => ({
  initialized: false,
  preset: null,
  enabled: [],
  disabled: [],
  fallbackFull: false,
})

export const createFullFallbackFeatureGateState = (): FeatureGateState => ({
  initialized: true,
  preset: null,
  enabled: [],
  disabled: [],
  fallbackFull: true,
})

export const normalizeFeatureGateInfo = ({
  preset,
  enabled = [],
  disabled = [],
}: FeatureGateInfo): FeatureGateState => ({
  initialized: true,
  preset: preset ?? null,
  enabled: [...new Set(enabled)],
  disabled: [...new Set(disabled)],
  fallbackFull: false,
})

export const normalizePath = (path: string): string => {
  const normalizedPath = path.replace(/\/+/g, '/').replace(/\/$/, '')
  return normalizedPath || '/'
}

export const joinRoutePath = (parentPath = '', routePath = ''): string => {
  if (routePath.startsWith('/')) {
    return normalizePath(routePath)
  }
  if (!parentPath) {
    return normalizePath(routePath ? `/${routePath}` : '/')
  }
  return normalizePath(`${parentPath}/${routePath}`)
}

export const isFeatureEnabled = (
  { initialized, fallbackFull, enabled, disabled }: FeatureGateState,
  feature: FeatureName,
): boolean => {
  if (!initialized || fallbackFull) {
    return true
  }
  if (disabled.includes(feature)) {
    return false
  }
  if (enabled.includes(feature)) {
    return true
  }
  return true
}

const isFeaturePathMatched = (path: string, featurePath: string): boolean => {
  const normalizedPath = normalizePath(path)
  const normalizedFeaturePath = normalizePath(featurePath)
  return (
    normalizedPath === normalizedFeaturePath ||
    normalizedPath.startsWith(`${normalizedFeaturePath}/`)
  )
}

export const getFeaturesByPath = (path: string): FeatureName[] =>
  Object.entries(FEATURE_ROUTE_MAP).reduce<FeatureName[]>((ret, [feature, featurePaths]) => {
    if (featurePaths.some((featurePath) => isFeaturePathMatched(path, featurePath))) {
      ret.push(feature as FeatureName)
    }
    return ret
  }, [])

export const isPathFeatureEnabled = (path: string, featureGate: FeatureGateState): boolean => {
  const features = getFeaturesByPath(path)
  if (!features.length) {
    return true
  }
  return features.some((feature) => isFeatureEnabled(featureGate, feature))
}

export const filterItemsByFeatureGate = <T extends { path?: string; children?: Array<any> }>(
  items: T[],
  featureGate: FeatureGateState,
): T[] =>
  items.reduce<T[]>((ret, item) => {
    if (item.path && !isPathFeatureEnabled(item.path, featureGate)) {
      return ret
    }

    const children = item.children
      ? filterItemsByFeatureGate(item.children, featureGate)
      : undefined
    if (item.children && !children?.length && !item.path) {
      return ret
    }

    ret.push({
      ...item,
      ...(children ? { children } : {}),
    })
    return ret
  }, [])

export const filterRouteRecordsByFeatureGate = (
  routeRecords: Array<RouteRecordRaw>,
  featureGate: FeatureGateState,
  parentPath = '',
): Array<RouteRecordRaw> =>
  routeRecords.reduce<Array<RouteRecordRaw>>((ret, route) => {
    const path = joinRoutePath(parentPath, route.path)
    if (!isPathFeatureEnabled(path, featureGate)) {
      return ret
    }
    const children = route.children
      ? filterRouteRecordsByFeatureGate(route.children, featureGate, path)
      : undefined

    ret.push({
      ...route,
      ...(children ? { children } : {}),
    } as RouteRecordRaw)
    return ret
  }, [])

export const getEnabledRouteChildren = (
  route: RouteRecordRaw,
  featureGate: FeatureGateState,
): Array<RouteRecordRaw> => {
  if (!route.children?.length) {
    return []
  }
  return filterRouteRecordsByFeatureGate(route.children, featureGate, route.path)
}
