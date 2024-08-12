import { IS_ENTERPRISE } from '@/common/constants'
import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

// Configs for different editions
const editionConfigs = {
  enterprise: {
    title: 'Base.enterpriseEdition',
    banner: require('@/assets/img/login-banner-enterprise.png'),
    logo: require('@/assets/img/emqx-logo-enterprise.png'),
  },
  openSource: {
    title: 'Base.openSourceEdition',
    banner: require('@/assets/img/login-banner-open-source.png'),
    logo: require('@/assets/img/emqx-logo-open-source.png'),
  },
}

export default function useEditionConfigs(): {
  edition: ComputedRef<{
    title: string
    banner: string
    logo: string
  }>
  loginTitle: ComputedRef<string>
  loginBgBanner: ComputedRef<string>
  appLogo: ComputedRef<string>
} {
  const { t } = useI18n()
  const edition = computed(() =>
    IS_ENTERPRISE ? editionConfigs.enterprise : editionConfigs.openSource,
  )
  const loginTitle = computed(() => `${t('Base.login')} - EMQX ${t(edition.value.title)}`)
  const loginBgBanner = computed(() => edition.value.banner)
  const appLogo = computed(() => edition.value.logo)

  return {
    edition,
    loginTitle,
    loginBgBanner,
    appLogo,
  }
}
