<template>
  <el-page-header class="detail-header" :icon="ArrowLeft" :content="item.name" @back="goBack" />
</template>

<script lang="ts">
import { defineComponent, defineProps, PropType } from 'vue'
import { useRouter } from 'vue-router'
defineComponent({
  name: 'DetailHeader',
})
</script>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'

interface item {
  name: string
  path?: string
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
  props.item.path ? router.push({ path: props.item.path }) : router.back()
}
</script>

<style lang="scss">
.detail-header {
  margin-top: 18px;
  margin-bottom: 24px;
}
</style>
