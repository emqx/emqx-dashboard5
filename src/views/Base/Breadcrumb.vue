<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="item in breadcrumbList"
      :key="item.route.toString()"
      :to="item.route"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { usePathInMenu } from '@/hooks/useMenus'
import { GatewayName } from '@/types/enum'
import { last, sortBy } from 'lodash'
import type { RouteLocationRaw } from 'vue-router'

interface BreadcrumbItem {
  label: string
  route: RouteLocationRaw
}

const route = useRoute()
const { t, te } = useI18nTl('Base')
const router = useRouter()
const currentRoute = computed(() => last(route.matched))
const currentRoutePath = computed(() => currentRoute.value?.path)

const { getRouteLabel, createChildReg, getMenuItemByPath } = usePathInMenu()

const uniqueAllMatchRoutes = computed(() => {
  if (!currentRoutePath.value) {
    return []
  }
  const allRoutes = router.getRoutes()
  const matchedRoutes = allRoutes.filter((route) => {
    const isParent = createChildReg(route.path).test(currentRoutePath.value as string)
    const isSelf = route.path === currentRoutePath.value
    return isParent || isSelf
  })
  const uniqueMatchedRoutes = uniqBy(matchedRoutes, 'path')
  return sortBy(uniqueMatchedRoutes, (item) => item.path?.length)
})

const lastLevelPathReg = /\/(\w|-|:)+$/
const getLastLevelPath = (path: string) => path.match(lastLevelPathReg)?.[0] ?? ''
const routePathWithParamsReg = /((:(\w)+))+/g
const getParamNamesFromPath = (path: string) => {
  const matchParamsResult = getLastLevelPath(path).match(routePathWithParamsReg)
  if (matchParamsResult) {
    return matchParamsResult.map((item) => {
      return item.replace(/^:/, '')
    })
  }
  return undefined
}

const { transGatewayName } = useTransName()
const getGatewayDetailRouteLabel = (): string => {
  const gatewayName = String(route.params.name).toLowerCase() as GatewayName
  return transGatewayName(gatewayName)
}
const { getBackendLabel } = useSSOBackendsLabel()
const getSSODetailRouteLabel = (): string => {
  const backend = route.params.backend.toString()
  return getBackendLabel(backend)
}
const { titleMap } = useAuth()
const authnIdReg = /(?<mechanism>\w+):(?<backend>\w+)/
const getAuthnDetailRouteLabel = (): string => {
  const id = route.params.id.toString()
  const matchResult = id.match(authnIdReg)
  if (matchResult?.groups?.backend) {
    return titleMap[matchResult.groups.backend]
  }
  return titleMap[id] ?? t('Base.detail')
}
const { titleMap: authTitleMap } = useAuth()
const getAuthzDetailRouteLabel = (): string => {
  const type = route.params.type.toString()
  return authTitleMap[type]
}
const specialRouteNameLabelFuncMap = new Map([
  ['gateway-detail', getGatewayDetailRouteLabel],
  ['SSO-detail', getSSODetailRouteLabel],
  ['authenticationDetail', getAuthnDetailRouteLabel],
  ['authorizationDetail', getAuthzDetailRouteLabel],
])
const getBreadcrumbLabel = (breadRoute: RouteRecordRaw) => {
  let label: undefined | string = getRouteLabel(breadRoute)
  const paramNames = getParamNamesFromPath(breadRoute.path)
  if (paramNames) {
    if (breadRoute.name && specialRouteNameLabelFuncMap.get(breadRoute.name as string)) {
      label = specialRouteNameLabelFuncMap.get(breadRoute.name as string)?.(breadRoute)
    } else {
      label = paramNames.map((name) => route.params[name]).join('-')
    }
  }
  if (!label) {
    const menuItem = getMenuItemByPath(breadRoute.path)
    if (menuItem?.title && te(`components.${menuItem.title}`)) {
      label = `${t(`components.${menuItem.title}`)}`
    }
  }
  return label ?? titleCase(breadRoute.path)
}

const breadcrumbList = computed<Array<BreadcrumbItem>>(() => {
  if (!currentRoute.value) {
    return []
  }
  const result = uniqueAllMatchRoutes.value.map((route) => {
    return { label: getBreadcrumbLabel(route), route }
  })
  return result
})
</script>
