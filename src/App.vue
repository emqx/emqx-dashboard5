<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import useGetInfoFromQuery, { USER_INFO_KEY } from '@/hooks/useGetInfoFromQuery'
import useUpdateBaseInfo from '@/hooks/useUpdateBaseInfo'
import { DashboardSamlBackend } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { waitAMoment } from './common/tools'
import { omit } from 'lodash'

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

const router = useRouter()
const route = useRoute()
const { getUserInfoFromQuery } = useGetInfoFromQuery()
const { updateBaseInfo } = useUpdateBaseInfo()
const handleQuery = async () => {
  const info = getUserInfoFromQuery()
  if (info) {
    location.replace(location.origin + location.pathname + location.hash)
    /**
     * Currently, if info is from location.search, it's using single sign-on;
     * if it's from route.query, it's from ECP (i.e., no backend)
     */
    const backend = info.backend
      ? info.backend
      : location.search
      ? DashboardSamlBackend.saml
      : undefined
    updateBaseInfo(info.username, info, backend)
    // if in login page, redirect to overview page
    if (/login/i.test(location.hash.split('?')[0])) {
      router.push({ name: 'overview' })
    }
    await waitAMoment()
    // remove login meta from query for safe
    if (route.query) {
      const newQuery = omit(route.query, USER_INFO_KEY)
      router.replace({ ...route, query: newQuery })
    }
  }
}
handleQuery()
</script>

<style lang="scss"></style>
