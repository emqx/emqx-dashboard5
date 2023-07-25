import useI18nTl from './useI18nTl'
import keys from '@/hooks/Rule/KeysInRule.json'

export default () => {
  const { t, tl } = useI18nTl('Function')
  const funcs = keys.builtInSQLFuncs
}
