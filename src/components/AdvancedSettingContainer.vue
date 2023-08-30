<template>
  <div class="btn-container">
    <AdvancedSettingsBtn v-model="showAdvancedSettings" />
  </div>
  <el-collapse-transition>
    <div class="advanced-settings" v-show="showAdvancedSettings">
      <slot />
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdvancedSettingsBtn from '@/components/AdvancedSettingsBtn.vue'

const showAdvancedSettings = ref(false)
</script>

<style lang="scss" scoped>
.advanced-settings {
  width: 100%;
}
</style>
