import { DEFAULT_FROM, DEFAULT_SELECT } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { BasicRule, RuleItem } from '@/types/rule'

export default (): {
  createRawRuleForm: (from?: string) => BasicRule
  getRuleDataForUpdate: (rule: RuleItem) => Partial<RuleItem>
} => {
  const createRuleID = () => `rule_${createRandomString(4)}`

  const { transSQLFormDataToSQL } = useRuleUtils()

  const createRawRuleForm = (from = DEFAULT_FROM): BasicRule => ({
    id: createRuleID(),
    sql: transSQLFormDataToSQL(DEFAULT_SELECT, [from]),
    actions: [],
    description: '',
  })

  const getRuleDataForUpdate = ({
    id,
    sql,
    enable,
    description,
    actions,
  }: RuleItem): Partial<RuleItem> => ({
    id,
    sql,
    enable,
    description,
    actions,
  })

  return {
    createRawRuleForm,
    getRuleDataForUpdate,
  }
}
