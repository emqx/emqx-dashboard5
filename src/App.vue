<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { DashboardSamlBackend } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { postSSOTokenExchange } from './api/sso'
import { toLogin } from './router'

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
const enableSQLAI = computed(() => {
  return store.state.enableSQLAI
})
const updateThemeState = (theme: string) => {
  store.dispatch('UPDATE_SETTINGS', {
    lang: lang.value,
    theme,
    syncOsTheme: syncOsTheme.value,
    enableSQLAI: enableSQLAI.value,
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

const { printVersion } = useDashboardVersion()
printVersion()

const router = useRouter()
const route = useRoute()
const { getUserInfoFromQuery } = useGetInfoFromQuery()
const { updateBaseInfo } = useUpdateBaseInfo()
const handleQuery = async () => {
  try {
    const info = getUserInfoFromQuery()
    if (!info) return

    if (info.code) {
      const to = getValueFromQuery('to')
      // New flow: exchange the one-time SSO code for a token or MFA prompt
      try {
        const result = await postSSOTokenExchange(info.code)
        if ('token' in result) {
          // Login success
          updateBaseInfo(result.username, result, result.backend)
          router.push({ path: to ?? '/' })
        } else {
          // MFA required — store the pending state and go to login page
          store.commit('SET_SSO_MFA_PENDING', result)
          router.push({ path: '/login' })
        }
      } catch (error) {
        console.error('SSO token exchange failed', error)
        toLogin()
      }
    } else if (info.token) {
      // Backward-compatible flow: login_meta contains a JWT directly
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
    }
    await waitAMoment()
    // remove login meta from query for safe
    if (route.query) {
      const newQuery = omit(route.query, USER_INFO_KEY)
      router.replace({ ...route, query: newQuery })
    }
    // Clear the login_meta from the URL immediately for security
    window.history.replaceState(
      {},
      '',
      location.origin + location.pathname + location.hash.split('?')[0],
    )
  } catch (error) {
    console.error(error)
  }
}
handleQuery()
</script>

<style lang="scss"></style>
