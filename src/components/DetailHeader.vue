<template>
  <el-page-header class="detail-header" :icon="ArrowLeft" :content="item.name" @back="goBack">
    <template #content v-if="$slots.content">
      <slot name="content" />
    </template>
    <template #extra v-if="$slots.extra">
      <slot name="extra" />
    </template>
  </el-page-header>
</template>

<script lang="ts">
export default defineComponent({
  name: 'DetailHeader',
})
</script>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'

interface Item {
  name?: string
  path?: string
  route?: RouteLocationRaw
  routeName?: string
  backFunc?: () => void
}

const router = useRouter()

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>,
  },
})

const goBack = () => {
  const {
    item: { routeName, path, backFunc, route },
  } = props
  if (route) {
    router.push(route)
  } else if (path) {
    router.push({ path })
  } else if (routeName) {
    router.push({ name: routeName })
  } else if (backFunc) {
    backFunc()
  }
}
</script>

<style lang="scss">
.detail-header {
  margin-top: 32px;
  margin-bottom: 24px;
  .el-page-header__breadcrumb {
    display: none;
  }
  .el-page-header__content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    :not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
