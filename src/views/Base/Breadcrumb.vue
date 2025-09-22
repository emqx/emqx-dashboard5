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
import { last } from 'lodash'
import type { RouteLocationRaw } from 'vue-router'

interface BreadcrumbItem {
  label: string
  route: RouteLocationRaw
}

const route = useRoute()

const currentRoute = computed(() => last(route.matched))
const { findPathParentAndBlock, getRouteLabel } = usePathInMenu()

const breadcrumbList = computed<Array<BreadcrumbItem>>(() => {
  if (!currentRoute.value) {
    return []
  }
  const result = []
  const { parent, parentLabel } = findPathParentAndBlock(currentRoute.value?.path)
  if (parent) {
    result.push({ label: parentLabel ?? '', route: parent.path })
  }
  result.push({ label: getRouteLabel(currentRoute.value), route: currentRoute.value.path })
  return result
})
</script>
