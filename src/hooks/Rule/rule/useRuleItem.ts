import { deleteRules, getRuleInfo, updateRules } from '@/api/ruleengine'
import { RuleItem } from '@/types/rule'

const useRuleItem = () => {
  const { getNsParams } = useNsParams()

  const getRuleDetail = (id: string, namespace?: string) => {
    return getRuleInfo(id, getNsParams(namespace))
  }
  const updateRule = (id: string, rule: Partial<RuleItem>) => {
    const { namespace, ...rest } = rule
    return updateRules(id, rest, getNsParams(namespace))
  }
  const deleteRule = (rule: { id: string; namespace?: string } & unknown) => {
    const { id, namespace } = rule
    return deleteRules(id, getNsParams(namespace))
  }

  return {
    getRuleDetail,
    updateRule,
    deleteRule,
  }
}

export default useRuleItem
