import enterpriseLogo from '@/assets/img/emqx-logo-enterprise.svg'
import openSourceLogo from '@/assets/img/emqx-logo-open-source.png'
import enterpriseBanner from '@/assets/img/login-banner-enterprise.png'
import openSourceBanner from '@/assets/img/login-banner-open-source.png'
import { IS_ENTERPRISE } from '@/common/constants'
import { useI18n } from 'vue-i18n'

// Configs for different editions
const editionConfigs = {
  enterprise: {
    title: 'Base.enterpriseEdition',
    banner: enterpriseBanner,
    logo: enterpriseLogo,
  },
  openSource: {
    title: 'Base.openSourceEdition',
    banner: openSourceBanner,
    logo: openSourceLogo,
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
