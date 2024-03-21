<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import useGetInfoFromQuery, { USER_INFO_KEY } from '@/hooks/useGetInfoFromQuery'
import useUpdateBaseInfo from '@/hooks/useUpdateBaseInfo'
import { DashboardSamlBackend } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { ElLoading } from 'element-plus'
import { omit } from 'lodash'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { postSSOLogin } from './api/sso'
import { getValueFromQuery, waitAMoment } from './common/tools'
import { SSOIframeBackend } from './types/typeAlias'

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
  let info = getUserInfoFromQuery()
  const token = getValueFromQuery('token')
  const hideLeftMenu = getValueFromQuery('hideMenu', true)
  if (hideLeftMenu) {
    store.commit('SET_HIDE_LEFT_MENU', hideLeftMenu === 'true')
  }
  if (token) {
    const loading = ElLoading.service({ customClass: 'is-opacity' })
    try {
      info = await postSSOLogin(SSOIframeBackend.iframe, {
        backend: SSOIframeBackend.iframe,
        sinochem_user_token: token,
      } as any)
    } catch (error) {
      // TODO:
    } finally {
      window.setTimeout(loading.close, 300)
    }
  }

  if (info) {
    location.replace(location.origin + location.pathname + location.hash)
    /**
     * Currently, if info is from location.search, it's using single sign-on;
     * if it's from route.query, it's from ECP (i.e., no backend)
     */
    const backend = location.search
      ? DashboardSamlBackend.saml
      : token
      ? SSOIframeBackend.iframe
      : undefined
    updateBaseInfo(info.username, info, backend)
    // if in login page, redirect to overview page
    if (/login/i.test(location.hash.split('?')[0])) {
      router.push({ name: 'overview' })
    }
    await waitAMoment(1000)
    // remove login meta from query for safe
    if (route.query) {
      const newQuery = omit(route.query, [USER_INFO_KEY, 'token'])
      router.replace({ query: newQuery })
    }
  }
}
handleQuery()
</script>

<style lang="scss">
.el-loading-mask.is-opacity {
  background-color: var(--color-bg-content) !important;
  z-index: 2100;
}
</style>
