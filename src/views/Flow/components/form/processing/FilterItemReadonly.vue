<template>
  <div class="filter-item-readonly">
    <p class="field">{{ data.field }}</p>
    <span class="operator">{{ data.operator }}</span>
    <p class="tip">{{ data.valueForComparison }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss">
.filter-item-readonly {
  display: flex;
  align-items: center;
  padding: 8px 0;
  line-height: 20px;
  &::before {
    
  }

  p {
    margin: 0;
  }
  .field {
    font-weight: 600;
  }
  .operator {
    margin: 0 8px;
  }
}
</style>
