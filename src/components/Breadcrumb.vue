<template>
  <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
    <template v-for="item in items">
      <el-breadcrumb-item v-if="item.path" :key="item.name" :to="{ path: item.path }">
        {{ item.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else :key="item.name">
        {{ item.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, defineProps, PropType } from 'vue'
defineComponent({
  name: 'Breadcrumb',
})
</script>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'

interface item {
  path?: string
  name: string
}

defineProps({
  items: {
    required: true,
    type: Array as PropType<item[]>,
  },
})
</script>

<style lang="scss">
.breadcrumb {
  margin-top: 18px;
  margin-bottom: 24px;
  .el-breadcrumb__item {
    font-size: 18px;
  }
  .el-breadcrumb__inner.is-link {
    color: var(--color-title-primary);
    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
