import { AuthzRuleAction, AuthzRulePermission } from '@/types/typeAlias'

export default () => {
  const { t, tl } = useI18nTl('Auth')
  const actionOpts = [
    { value: AuthzRuleAction.publish, label: tl('publish') },
    { value: AuthzRuleAction.subscribe, label: tl('subscribe') },
    { value: AuthzRuleAction.all, label: tl('all') },
  ]

  const permissionOpts = [
    { value: AuthzRulePermission.allow, label: t('Base.allow') },
    { value: AuthzRulePermission.deny, label: t('Base.deny') },
  ]

  return {
    actionOpts,
    permissionOpts,
  }
}
