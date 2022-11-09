<template>
  <span class="text-easy-copy" ref="textWrap" @click="handleClick">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useCopy from '@/hooks/useCopy'

const textWrap = ref()

const { copyText } = useCopy()

const handleClick = () => {
  const text = textWrap.value.innerText
  copyText(text)
}
</script>

<style lang="scss">
.text-easy-copy {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px;
  cursor: default;
  &:hover {
    background-color: var(--color-hover);
  }
}
</style>
