import { createRandomString } from '@/common/tools'
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
    enable: true,
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
