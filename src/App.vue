<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const setTheme = () => {
  let currentTheme = store.state.theme
  const bodyTag: HTMLBodyElement | null = document.querySelector('body')
  if (!bodyTag) {
    return
  }
  bodyTag.className = currentTheme
}
setTheme()
</script>

<style lang="scss"></style>
