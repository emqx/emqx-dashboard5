import { useI18n } from 'vue-i18n'
import { UserRole } from '@/types/enum'

interface RoleOption {
  label: string
  value: string
  desc?: string
}

export default function useRole(): {
  apiKeyRoleOptions: RoleOption[]
  userRoleOptions: RoleOption[]
} {
  const { t } = useI18n()
  const userRoleOptions: RoleOption[] = [
    { label: t('General.admin'), value: UserRole.Admin, desc: t('General.adminDesc') },
    { label: t('General.viewer'), value: UserRole.Readonly, desc: t('General.viewerDesc') },
  ]
  const apiKeyRoleOptions: RoleOption[] = [
    ...userRoleOptions,
    {
      label: t('General.publisher'),
      value: UserRole.Publisher,
    },
  ]
  return {
    apiKeyRoleOptions,
    userRoleOptions,
  }
}
