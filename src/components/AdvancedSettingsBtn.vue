<template>
  <!-- not using el-button is for not inherit the disabled state of the form -->
  <div
    ref="ButtonCom"
    class="el-button el-button--primary is-link advanced-settings-btn"
    type="primary"
    link
    @click="toggle"
  >
    {{ buttonText ?? tl('advancedSettings') }}
    <el-icon :class="{ 'is-rotate': modelValue }"><ArrowRight /></el-icon>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { ArrowRight } from '@element-plus/icons-vue'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('RuleEngine')

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss">
.advanced-settings-btn {
  &.el-button.is-link {
    padding-left: 0;
    padding-right: 0;
  }
  margin-top: 8px;
  margin-bottom: 24px;
  .el-icon {
    margin-left: 4px;
    transition: transform 0.3s;
    color: var(--color-text-placeholder);
    &.is-rotate {
      transform: rotate(90deg);
    }
  }
}
</style>
