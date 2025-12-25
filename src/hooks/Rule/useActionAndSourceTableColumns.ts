const useActionAndSourceTableColumns = () => {
  const { t, tl } = useI18nTl('RuleEngine')
  const columnLabelMap = new Map<string, string>([
    ['id', tl('name')],
    ['status', t('Base.status')],
    ['enable', t('Base.isEnabled')],
    ['namespace', t('BasicConfig.namespace')],
    ['description', t('BridgeSchema.common.description.label')],
    ['rules.length', tl('associatedRules')],
    ['created_at', t('Base.createdAt')],
    ['last_modified_at', t('Base.lastModified')],
  ])
  const getColumnLabel = (column: string) => columnLabelMap.get(column) || titleCase(column)
  return {
    getColumnLabel,
  }
}

export default useActionAndSourceTableColumns
