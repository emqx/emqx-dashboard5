<template>
  <div class="slow-sub app-wrapper with-padding-top" v-loading="isLoading">
    <div class="placeholder" v-if="!isEnable">
      <el-empty :description="$t('SlowSub.slowSubPlaceholder')" />
      <el-button
        :disabled="!$hasPermission('put')"
        @click="$router.push({ name: 'slow-sub-config', query: { enable: true } })"
        type="primary"
      >
        {{ $t('SlowSub.enable') }}
      </el-button>
    </div>
    <SlowSubData v-else />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SlowSub',
})
</script>

<script setup lang="ts">
import SlowSubData from './components/SlowSubData.vue'
import { querySlowSubConfig } from '@/api/diagnose'

const isEnable: Ref<boolean> = ref(false)
const isLoading = ref(true)

const getConfig = async () => {
  try {
    isLoading.value = true
    const { enable } = await querySlowSubConfig()
    isEnable.value = enable
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

getConfig()
</script>

<style lang="scss" scoped>
.slow-sub {
  .placeholder {
    padding-top: 80px;
    text-align: center;
  }

  :deep(.el-empty__description) {
    margin-top: 20px;
  }
}
</style>
