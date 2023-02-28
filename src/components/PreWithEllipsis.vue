<template>
  <div class="pre-with-ellipsis">
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
@import '~@/style/common.scss';
.pre-with-ellipsis {
  white-space: nowrap;
  pre {
    margin: 0;
    font-family: $font;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
