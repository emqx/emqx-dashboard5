import { RULE_INPUT_BRIDGE_TYPE_PREFIX, RULE_INPUT_EVENT_PREFIX } from '@/common/constants'
import {
  getKeyPartsFromSQL,
  getRuleSelectionAlias,
  judgeRuleSelectionWithFunc,
  splitOnComma,
  trimSpacesAndLFs,
} from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import { RuleInputType } from '@/types/enum'
import { RuleEvent } from '@/types/rule'

// store kafka, rabbit columns...can not get from api like mqtt
const _events: Array<RuleEvent> = [] as Array<RuleEvent>

export default (): {
  sql: Ref<string> | undefined
  availableFields: ComputedRef<string[]>
  availablePlaceholders: ComputedRef<string[]>
} => {
  /**
   * Used to confirm which optional placeholders are provided
   */
  const sql: Ref<string> | undefined = inject('sql', ref(''))
  /**
   * An event list is needed to find out what available placeholders are for each `from`
   */
  const eventList: Ref<Array<{ columns: string[]; event: string } & unknown>> | undefined = inject(
    'eventList',
    ref([]),
  )

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
  const { transFromStrToFromArr, getTestTargetEvent } = useRuleUtils()
  const selectList = computed<Array<string>>(() => {
    if (isUndefined(sqlKeyParts.value.fieldStr)) {
      return []
    }
    return splitOnComma(sqlKeyParts.value.fieldStr).map((item) => trimSpacesAndLFs(item))
  })
  const fromList = computed(() => transFromStrToFromArr(sqlKeyParts.value.fromStr || ''))

  const ruleInputEventReg = new RegExp(`^${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}`)
  const ruleInputBridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
  const checkIsBridge = (str: string) => ruleInputBridgeReg.test(str)
  const checkIsTopic = (str: string) =>
    !ruleInputBridgeReg.test(str) && !ruleInputEventReg.test(str)

  /**
   * if is `xxx`, output `xxx`
   * if is `xxx.yyy`, output `xxx`
   */
  const withLevelReg = new RegExp(/^[^.]+/)
  const getOutputValue = (value: string): string => {
    const withLevel = withLevelReg.exec(value)
    return withLevel ? withLevel[0] : value
  }

  const totalEventList = computed(() => [...eventList.value, ..._events] as Array<RuleEvent>)

  const availableFields = computed<Array<string>>(() => {
    if (selectList.value.length === 0) {
      return []
    }
    let valueSet: Set<string> = new Set()
    // if select `*`, fields is from `from`
    if (selectList.value.length === 1 && /^\*$/.test(selectList.value[0])) {
      if (!eventList) {
        return []
      }
      valueSet = fromList.value.reduce((set: Set<string>, item) => {
        const itemType = checkIsBridge(item)
          ? RuleInputType.Bridge
          : checkIsTopic(item)
            ? RuleInputType.Topic
            : RuleInputType.Event
        const value =
          itemType === RuleInputType.Bridge ? item.replace(ruleInputBridgeReg, '') : item
        const targetEvent = getTestTargetEvent(itemType, value, totalEventList.value)
        if (targetEvent) {
          targetEvent.columns.forEach((item) => set.add(item))
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
        if (!withFunc || !isUndefined(alias)) {
          const value = !isUndefined(alias) ? alias : item
          set.add(getOutputValue(value))
        }
        return set
      }, new Set() as Set<string>)
    }
    return [...valueSet]
  })

  const availablePlaceholders = computed<Array<string>>(() => {
    return availableFields.value.map((item) => `\${${item}}`)
  })

  return { sql, availableFields, availablePlaceholders }
}
