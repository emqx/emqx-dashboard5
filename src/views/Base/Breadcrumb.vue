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

const breadcrumbList = computed<Array<BreadcrumbItem>>(() => {
  if (!currentRoute.value) {
    return []
  }
  const result = uniqueAllMatchRoutes.value.reduce((arr: Array<BreadcrumbItem>, route) => {
    let label: undefined | string = getRouteLabel(route)
    if (!label) {
      const menuItem = getMenuItemByPath(route.path)
      if (menuItem?.title && te(`components.${menuItem.title}`)) {
        label = `${t(`components.${menuItem.title}`)}`
      }
    }
    arr.push({ label: label ?? titleCase(route.path), route })
    return arr
  }, [])
  return result
})
</script>
