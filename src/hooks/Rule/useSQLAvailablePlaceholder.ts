import { RULE_INPUT_BRIDGE_TYPE_PREFIX, RULE_INPUT_EVENT_PREFIX } from '@/common/constants'
import {
  getKeyPartsFromSQL,
  getRuleSelectionAlias,
  judgeRuleSelectionWithFunc,
  splitOnComma,
  trimSpacesAndLFs,
} from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import { EventForRule } from '@/types/enum'
import { escapeRegExp, isUndefined } from 'lodash'
import type { ComputedRef, Ref } from 'vue'
import { computed, inject } from 'vue'

export default (): {
  availablePlaceholders: ComputedRef<string[]>
} => {
  /**
   * Used to confirm which optional placeholders are provided
   */
  const sql: Ref<string> | undefined = inject('sql')
  /**
   * An event list is needed to find out what available placeholders are for each `from`
   */
  const eventList: Ref<Array<{ columns: string[]; event: string } & unknown>> | undefined =
    inject('eventList')

  const sqlKeyParts = computed<
    Partial<{
      fieldStr: string
      fromStr: string
      whereStr: string
    }>
  >(() => {
    if (sql) {
      return getKeyPartsFromSQL(sql.value)
    }
    return {}
  })
  const { transFromStrToFromArr } = useRuleUtils()
  const selectList = computed<Array<string>>(() => {
    return splitOnComma(sqlKeyParts.value.fieldStr ?? '').map((item) => trimSpacesAndLFs(item))
  })
  const fromList = computed(() => transFromStrToFromArr(sqlKeyParts.value.fromStr || ''))

  const ruleInputEventReg = new RegExp(`^${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}`)
  const ruleInputBridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
  const checkIsTopic = (str: string) =>
    !ruleInputBridgeReg.test(str) && !ruleInputEventReg.test(str)

  const availableFields = computed<Array<string>>(() => {
    let valueSet: Set<string> = new Set()
    // if select `*`
    if (selectList.value.length === 1 && /^\*$/.test(selectList.value[0])) {
      if (!eventList) {
        return []
      }
      valueSet = fromList.value.reduce((set: Set<string>, item) => {
        const itemForFind = checkIsTopic(item) ? EventForRule.MessagePublish : item
        const event = eventList.value.find(({ event }) => event === itemForFind)
        if (event) {
          event.columns.forEach((item) => set.add(item))
        }
        return set
      }, new Set() as Set<string>)
    } else {
      // else output select
      valueSet = selectList.value.reduce((set, item) => {
        const withFunc = judgeRuleSelectionWithFunc(item)
        const alias = getRuleSelectionAlias(item)
        // If using a function and not specifying an alias,
        // emqx will randomize a name of the variable, so it is not dealt with
        if (withFunc && isUndefined(alias)) {
          return set
        }
        set.add(!isUndefined(alias) ? alias : item)
        return set
      }, new Set() as Set<string>)
    }
    return [...valueSet]
  })

  const availablePlaceholders = computed<Array<string>>(() => {
    return availableFields.value.map((item) => `\${${item}}`)
  })

  return { availablePlaceholders }
}
