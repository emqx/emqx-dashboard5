import { useI18n } from 'vue-i18n'
import { UserRole } from '@/types/enum'

interface RoleOption {
  label: string
  value: string
}

interface RoleOptionWithDesc extends RoleOption {
  desc: string
}

export default function useRole(): {
  apiKeyRoleOptions: RoleOption[]
  userRoleOptions: RoleOptionWithDesc[]
} {
  const { t } = useI18n()
  const apiKeyRoleOptions: RoleOption[] = [
    { label: t('General.admin'), value: 'api_administrator' },
    { label: t('General.viewer'), value: 'api_viewer' },
    { label: t('General.publisher'), value: 'api_publisher' },
  ]
  const userRoleOptions: RoleOptionWithDesc[] = [
    { label: t('General.admin'), value: UserRole.Admin, desc: t('General.adminDesc') },
    { label: t('General.viewer'), value: UserRole.Readonly, desc: t('General.viewerDesc') },
  ]
  return {
    apiKeyRoleOptions,
    userRoleOptions,
  }
}
