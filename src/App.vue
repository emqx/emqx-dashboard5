<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const setTheme = () => {
  let currentTheme = store.state.theme
  document.documentElement.setAttribute('data-theme', currentTheme)
}
setTheme()
</script>

<style lang="scss"></style>
