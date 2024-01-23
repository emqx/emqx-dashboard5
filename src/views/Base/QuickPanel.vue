<template>
  <el-dialog v-model="showDialog" destroy-on-close width="500px" class="quick-panel">
    <el-autocomplete
      ref="InputRef"
      v-model="input"
      clearable
      autofocus
      highlight-first-item
      size="large"
      popper-class="quick-panel-popper"
      :debounce="50"
      :placeholder="tl('search')"
      :fetch-suggestions="querySearch"
      @keyup.esc="cancel"
      @select="handleSelect"
    >
      <template #prefix>
        <el-icon :size="20"> <Search /> </el-icon>
      </template>
      <template #default="{ item }">
        <div class="space-between quick-result-item">
          <div class="value">{{ item.label }}</div>
          <p class="tip">{{ item.blockTitle }}</p>
        </div>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script lang="ts" setup>
import { titleCase, waitAMoment } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import useMenus from '@/hooks/useMenus'
import { routes } from '@/router'
import { Search } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouteRecordRaw, useRouter } from 'vue-router'

interface MenuItem {
  path: string
  name?: any
  label: string
  blockTitle: string
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const InputRef = ref()
watch(showDialog, async (val) => {
  if (val) {
    await waitAMoment(100)
    InputRef.value.focus()
  } else {
    input.value = ''
  }
})

const { te } = useI18n()
const { t, tl } = useI18nTl('Base')

const createChildReg = (path: string) => new RegExp(`${path}(/(\\w|-)+)*$`)

const { menuList } = useMenus()
const getMenuBlockTitle = (path: string) => {
  const walk = (menuItem: any) => {
    if (menuItem.path) {
      return createChildReg(menuItem.path).test(path)
    } else if (menuItem.children) {
      return menuItem.children.some((item: any) => walk(item))
    }
    return false
  }
  const ret = menuList.find((item) => walk(item))
  return ret ? t(`components.${ret.title}`) : ''
}

const specialRouteName: Record<string, string> = {
  'alarm-settings': 'system-monitoring',
  'mqtt-general': 'conf-mqtt-general',
  'mqtt-session': 'conf-mqtt-session',
  'mqtt-retainer': 'conf-mqtt-retainer',
  'mqtt-system-topic': 'conf-mqtt-system-topic',
}
const withParamsPathReg = /:/
const generateMeneItems = (totalRoutes: Array<RouteRecordRaw>): Array<MenuItem> => {
  const ret: Array<MenuItem> = []

  const walk = (route: RouteRecordRaw, parent?: any, level = 0) => {
    if (route.path && withParamsPathReg.test(route.path)) {
      return
    }
    // ! just handle level 1
    if (level === 1) {
      const path = `${parent?.path ? parent.path : ''}${parent?.path && route.path ? '/' : ''}${
        route.path
      }`
      const labelKey = specialRouteName[route.name as string] || route.name
      const label = te(`components.${labelKey as string}`)
        ? t(`components.${labelKey as string}`)
        : titleCase(route.name as string)
      const blockTitle = getMenuBlockTitle(path)
      ret.push({ path, name: route.name, label, blockTitle })
    }
    if (route.children && level === 0) {
      route.children.forEach((child) => {
        walk(child, route, level + 1)
      })
    }
  }
  totalRoutes.forEach((route) => walk(route))
  return ret
}
/**
 * remove page with params
 */
const neededMenuList = generateMeneItems(routes)

const input = ref('')

const defaultItemNames = ['overview', 'clients', 'authentication', 'rule']
const querySearch = (query: string, cb: any) => {
  if (!query) {
    cb(neededMenuList.filter(({ name }) => defaultItemNames.includes(name)))
    return
  }
  const queryRegArr = query.split(' ').map((item) => new RegExp(`${item}`, 'i'))
  cb(
    neededMenuList.filter(
      ({ path, name, label }) =>
        queryRegArr.every((reg) => reg.test(path)) ||
        queryRegArr.every((reg) => reg.test(label)) ||
        (name && queryRegArr.every((reg) => reg.test(name))),
    ),
  )
}

const router = useRouter()
const handleSelect = (item: RouteRecordRaw | any) => {
  if (item.name) {
    router.push({ name: item.name })
  } else {
    router.push({ path: item.path })
  }
  showDialog.value = false
}

const cancel = () => {
  showDialog.value = false
}
</script>

<style lang="scss">
.quick-panel {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  $height: 54px;
  .el-autocomplete {
    width: 100%;
    height: $height;
    .el-input__inner {
      --el-input-inner-height: 52px;
    }
  }
}
.quick-panel-popper {
  .el-popper__arrow {
    display: none;
  }
  .tip {
    opacity: 0.5;
  }
  .quick-result-item {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>
