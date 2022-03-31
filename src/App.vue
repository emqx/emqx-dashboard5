<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const setTheme = () => {
  const currentTheme = store.state.theme
  document.documentElement.setAttribute('data-theme', currentTheme)
}
const setLang = () => {
  const lang = store.state.lang
  document.documentElement.setAttribute('lang', lang)
}
setTheme()
setLang()
</script>

<style lang="scss"></style>
