<template>
  <div class="btn-container">
    <AdvancedSettingsBtn v-model="showAdvancedSettings" :button-text="buttonText" />
  </div>
  <el-collapse-transition>
    <div class="advanced-settings" v-if="showAdvancedSettings">
      <slot />
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
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
.btn-container {
  margin-top: 14px;
}
.advanced-settings {
  width: 100%;
}
</style>
