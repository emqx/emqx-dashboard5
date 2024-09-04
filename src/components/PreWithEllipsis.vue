<template>
  <div class="pre-with-ellipsis">
    <!-- To eliminate the difference in range.getBoundingClientRect calculation results in Firefox. -->
    <p class="placeholder"><slot /></p>
    <pre><slot /></pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PreWithEllipsis',
})
</script>

<script setup lang="ts">
import {} from 'vue'
</script>

<style lang="scss">
@import '@/style/common.scss';
.pre-with-ellipsis {
  white-space: nowrap;
  .placeholder {
    visibility: hidden;
    margin: 0;
    height: 0;
  }
  pre {
    margin: 0;
    font-family: $font;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
