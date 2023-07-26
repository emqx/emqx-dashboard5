import useI18nTl from './useI18nTl'
import RuleFunc from '@/hooks/Rule/RuleFunc.json'

export default () => {
  const { t, tl } = useI18nTl('Function')
  const funcOptList = RuleFunc.map(({ groupLabel, list }) => ({
    groupLabel,
    list: list.filter((item) => item.args.length),
  }))
  return {
    funcOptList,
  }
}
