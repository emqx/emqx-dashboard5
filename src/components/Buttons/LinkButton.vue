<template>
  <component
    :is="disabled ? 'el-button' : 'router-link'"
    class="el-button"
    :to="to"
    :class="{ 'is-disabled': disabled }"
  >
    <el-icon v-if="icon" :size="14">
      <component :is="icon" />
    </el-icon>
    <span v-if="icon">
      <slot />
    </span>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { defineProps } from 'vue'

defineProps<{
  to: string
  icon?: Component
  disabled?: boolean
}>()
</script>
