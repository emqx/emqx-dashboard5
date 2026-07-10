<template>
  <el-dialog v-model="showDialog" destroy-on-close width="500px" class="quick-panel">
    <el-autocomplete
      ref="InputRef"
      v-model="input"
      clearable
      size="large"
      value-key="name"
      popper-class="quick-panel-popper"
      :debounce="50"
      :placeholder="tl('search')"
      :highlight-first-item="!!input"
      :fetch-suggestions="querySearch"
      @keyup.esc="cancel"
      @select="handleSelect"
    >
      <template #prefix>
        <Search :width="20" :height="20" />
      </template>
      <template #default="{ item }">
        <div class="space-between quick-result-item">
          <div class="value vertical-align-center">
            <div v-show="item.parentLabel" class="flex items-center">
              <span>{{ item.parentLabel }}</span>
              <ArrowRight class="icon-arrow" :size="14" />
            </div>
            <span>{{ item.label }}</span>
          </div>
          <p class="tip">{{ item.blockTitle }}</p>
        </div>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script lang="ts" setup>
import { filterRouteRecordsByFeatureGate, joinRoutePath } from '@/common/featureGate'
import { usePathInMenu } from '@/hooks/useMenus'
import { routes } from '@/router'
import { ArrowRight, Search } from 'lucide-vue-next'

interface MenuItem {
  path: string
  name?: any
  label: string
  parentLabel?: string
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

const { tl } = useI18nTl('Base')
const store = useStore()

const { findPathParentAndBlock, getRouteLabel } = usePathInMenu()

const withParamsPathReg = /:/
const generateMenuItems = (totalRoutes: Array<RouteRecordRaw>): Array<MenuItem> => {
  const ret: Array<MenuItem> = []

  const walk = (route: RouteRecordRaw, parent?: any, level = 0) => {
    if (route.path && withParamsPathReg.test(route.path)) {
      return
    }
    // ! just handle level 1
    if (level === 1) {
      const path = joinRoutePath(parent?.path, route.path)
      const label = getRouteLabel(route)
      if (!label) {
        return
      }
      const { parentLabel, blockTitle } = findPathParentAndBlock(path)
      ret.push({ path, name: route.name, label, parentLabel, blockTitle })
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
const neededMenuList = computed(() =>
  generateMenuItems(filterRouteRecordsByFeatureGate(routes, store.state.featureGate)),
)

const input = ref('')

const defaultItemNames = ['overview', 'clients', 'authentication', 'rule']
const querySearch = (query: string, cb: any) => {
  if (!query) {
    cb(neededMenuList.value.filter(({ name }) => defaultItemNames.includes(name)))
  } else {
    const queryRegArr = query.split(' ').map((item) => new RegExp(`${escapeRegExp(item)}`, 'i'))
    const ret = neededMenuList.value.filter(
      ({ path, name, label }) =>
        queryRegArr.every((reg) => reg.test(path)) ||
        queryRegArr.every((reg) => reg.test(label)) ||
        (name && queryRegArr.every((reg) => reg.test(name))),
    )
    cb(ret)
  }
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
  &.el-dialog {
    padding: 0;
  }
  .el-dialog__header {
    display: none;
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
  .icon-arrow {
    margin: 0 4px;
    opacity: 0.5;
  }
}
</style>
