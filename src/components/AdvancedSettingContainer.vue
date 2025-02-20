<template>
  <div class="btn-container">
    <AdvancedSettingsBtn v-model="showAdvancedSettings" :button-text="buttonText" />
  </div>
  <el-collapse-transition>
    <div class="advanced-settings" v-show="showAdvancedSettings">
      <slot />
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
import AdvancedSettingsBtn from '@/components/AdvancedSettingsBtn.vue'
import { useStore } from 'vuex'

defineProps<{
  buttonText?: string
}>()

const showAdvancedSettings = ref(false)
const { getters } = useStore()
/**
 * default show advanced settings to find issue in time
 */
if (getters.isDev) {
  showAdvancedSettings.value = true
}
</script>

<style lang="scss" scoped>
.advanced-settings {
  width: 100%;
}
</style>
