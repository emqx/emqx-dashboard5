<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const lang = computed(() => {
  return store.state.lang
})
const theme = computed(() => {
  return store.state.theme
})
const syncOsTheme = computed(() => {
  return store.state.syncOsTheme
})

const updateThemeState = (theme: string) => {
  store.dispatch('UPDATE_SETTINGS', {
    lang: lang.value,
    theme,
    syncOsTheme: syncOsTheme.value,
  })
}

// Sync OS theme
const hadleSyncOSTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    updateThemeState('dark')
  } else {
    updateThemeState('light')
  }
}
// Watch the OS theme change
const setWatchOSTheme = () => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    const osTheme = event.matches ? 'dark' : 'light'
    if (store.state.syncOsTheme && osTheme !== theme.value) {
      updateThemeState(osTheme)
    }
  })
}
const setTheme = () => {
  const currentTheme = theme.value
  document.documentElement.setAttribute('data-theme', currentTheme)
}
const setLang = () => {
  const currentLag = lang.value
  document.documentElement.setAttribute('lang', currentLag)
}
setTheme()
setLang()
setWatchOSTheme()
if (syncOsTheme.value) {
  hadleSyncOSTheme()
}
</script>

<style lang="scss"></style>
