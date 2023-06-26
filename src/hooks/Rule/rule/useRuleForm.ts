import { DEFAULT_FROM, DEFAULT_SELECT } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { BasicRule } from '@/types/rule'

export default (): {
  createRawRuleForm: (from?: string) => BasicRule
} => {
  const createRuleID = () => `rule_${createRandomString(4)}`

  const { transSQLFormDataToSQL } = useRuleUtils()

  const createRawRuleForm = (from = DEFAULT_FROM): BasicRule => ({
    id: createRuleID(),
    sql: transSQLFormDataToSQL(DEFAULT_SELECT, [from]),
    actions: [],
    description: '',
  })

  return {
    createRawRuleForm,
  }
}
