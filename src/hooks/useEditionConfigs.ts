import enterpriseLogo from '@/assets/img/emqx-logo-enterprise.svg'
import enterpriseBanner from '@/assets/img/login-banner-enterprise.png'

export default function useEditionConfigs(): {
  loginTitle: ComputedRef<string>
  loginBgBanner: string
  appLogo: string
} {
  const { t } = useI18n()
  const loginTitle = computed(() => `${t('Base.login')} - EMQX ${t('Base.enterpriseEdition')}`)

  return {
    loginTitle,
    loginBgBanner: enterpriseBanner,
    appLogo: enterpriseLogo,
  }
}
