<template>
  <div class="slow-sub app-wrapper" v-loading="isLoading">
    <div class="placeholder" v-if="!isEnable">
      <el-empty :description="$t('SlowSub.slowSubPlaceholder')" />
      <el-button class="link-btn" type="primary">
        <router-link :to="{ name: 'slow-sub-config' }">
          {{ $t('SlowSub.enable') }}
        </router-link>
      </el-button>
    </div>
    <SlowSubData v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SlowSub',
})
</script>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import SlowSubData from './components/SlowSubData.vue'
import { querySlowSubConfig } from '@/api/diagnose'

const isEnable: Ref<boolean> = ref(false)
const isLoading = ref(true)

const getConfig = async () => {
  try {
    isLoading.value = true
    const { enable } = await querySlowSubConfig()
    isEnable.value = enable
    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

getConfig()
</script>

<style lang="scss" scoped>
.slow-sub {
  .placeholder {
    text-align: center;
  }

  :deep(.el-empty__description) {
    margin-top: 20px;
  }
}
</style>
