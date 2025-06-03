import { deleteAICompletionProfile, deleteAIProvider } from '@/api/ai'
import { deleteRules } from '@/api/ruleengine'
import { RuleForm } from '@/types/rule'

export default () => {
  const { getAIDataNameArrFromSQL } = useRuleUtils()
  const deleteAIData = (nameArr: Array<string>) => {
    if (!nameArr || nameArr.length === 0) {
      return Promise.resolve()
    }
    return Promise.allSettled(
      nameArr.map(async (name) => {
        try {
          await deleteAICompletionProfile(name)
          await deleteAIProvider(name)
          return Promise.resolve()
        } catch (error) {
          console.error(error)
          return Promise.reject(error)
        }
      }),
    )
  }
  const deleteRule = async (rule: RuleForm) => {
    const AIData = getAIDataNameArrFromSQL(rule.sql)
    await deleteAIData(AIData)
    await deleteRules(rule.id)
  }

  return {
    deleteRule,
  }
}
