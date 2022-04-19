<template>
  <el-page-header class="detail-header" :icon="ArrowLeft" :content="item.name" @back="goBack" />
</template>

<script lang="ts">
import { defineComponent, defineProps, PropType } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'DetailHeader',
})
</script>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'

interface item {
  name: string
  path?: string
  routeName?: string
  backFunc?: () => void
}

const router = useRouter()

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<item>,
  },
})

const goBack = () => {
  const {
    item: { routeName, path, backFunc },
  } = props
  if (path) {
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
  margin-top: 18px;
  margin-bottom: 24px;
}
</style>
