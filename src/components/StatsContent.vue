<template>
  <div class="stats-content">
    <div class="stat-header">
      <component v-if="icon" :is="icon" class="stat-icon" />
      <span class="stat-label">{{ title }}</span>
    </div>
    <div class="stat-value">
      <span class="stat-number">{{ _formatNumber(value) }}</span>
      <span class="stat-unit" v-if="unit">{{ unit }}</span>
    </div>
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: Component
  title: string
  value: number
  unit?: string
}>()

const _formatNumber = (num: number) => (num === undefined ? 0 : formatNumber(num))
</script>

<style lang="scss" scoped>
.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 18px;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  color: var(--color-title-primary);
  transition: color 0.2s ease;
}

.stat-unit {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 20px;
}
</style>
