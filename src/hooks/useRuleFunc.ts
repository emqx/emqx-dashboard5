import RuleFunc from './Rule/RuleFunc.json'

export const enum ArgumentType {
  Number = 'number',
  Any = 'any',
  Float = 'float',
  Integer = 'integer',
  String = 'string',
  Enum = 'enum',
  Object = 'object',
  Array = 'array',
  Binary = 'binary',
}

export interface ArgItem {
  name: string
  type: ArgumentType
  required: boolean
  optionalValues?: Array<string>
  /**
   * for type number
   */
  range?: [null | number, null | number]
  default?: string | number
}

export interface FuncItem {
  name: string
  args: Array<ArgItem>
}

interface GroupFuncData {
  groupLabel: string
  name: string
  value: string
  list: Array<FuncItem>
}

type FuncData = Array<GroupFuncData>

const useRuleFunc = (): {
  funcOptList: FuncData
  getFuncItemByName: (name: string) => FuncItem | null
  getFuncGroupByName: (name: string) => string | null
  getArgIndex: (func: FuncItem, groupLabel: string) => number
} => {
  const { tl } = useI18nTl('Function')

  const funcOptList: FuncData = (RuleFunc as FuncData).map(({ groupLabel, list }) => ({
    groupLabel,
    name: tl(groupLabel),
    value: groupLabel,
    list: list.filter((item) => item.args.length) as Array<FuncItem>,
  }))

  const getFuncItemByName = (name: string): FuncItem | null => {
    for (const { list } of funcOptList) {
      for (const item of list) {
        if (item.name === name) {
          return item
        }
      }
    }
    return null
  }

  const getFuncGroupByName = (name: string): string | null => {
    for (const { groupLabel, list } of funcOptList) {
      for (const item of list) {
        if (item.name === name) {
          return groupLabel
        }
      }
    }
    return null
  }

  const funcGroupMainArgTypeMap: Record<string, ArgumentType> = {
    stringFunc: ArgumentType.String,
    mapFunc: ArgumentType.Object,
    arrFunc: ArgumentType.Array,
  }
  /**
   * Get the index of the most important parameter in a function
   */
  const getArgIndex = (func: FuncItem, groupLabel: string) => {
    const targetArgType = funcGroupMainArgTypeMap[groupLabel]
    let targetIndex = -1

    // Find the first parameter of the current group operation type,
    // if not found, it will be placed first by default
    if (targetArgType) {
      targetIndex = func.args.findIndex((item) => item.type === targetArgType)
    } else if (/time/i.test(groupLabel)) {
      targetIndex = func.args.findIndex((item) => /timestamp/i.test(item.name))
    }
    targetIndex = targetIndex > -1 ? targetIndex : 0
    return targetIndex
  }

  return {
    funcOptList,
    getFuncItemByName,
    getFuncGroupByName,
    getArgIndex,
  }
}

export default useRuleFunc

export const numberArgTypes = [ArgumentType.Number, ArgumentType.Float, ArgumentType.Integer]

type FunctionItemProps = Readonly<{
  modelValue: FunctionItem
  readonly: boolean
  availableFields: Array<string>
}>
export const useFunctionItemData = (
  props: FunctionItemProps,
  emit: { (e: 'update:modelValue', value: FunctionItem): void } & unknown,
): {
  record: WritableComputedRef<FunctionItem>
  getFieldList: (queryString: string, cb: any) => void
  handleFieldChanged: (val: string) => void
  funcOptList: FuncData
  args: ComputedRef<ArgItem[]>
  handleSelectFunc: (funcName: string) => void
  handleArgChanged: (val: string, index: number, type: ArgumentType) => void
} => {
  const { funcOptList, getFuncItemByName, getFuncGroupByName, getArgIndex } = useRuleFunc()

  const record = computed<FunctionItem>({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    },
  })

  const fillParams = (
    field: string,
    { groupLabel, func }: { groupLabel: string; func: FuncItem },
  ) => {
    const targetIndex = getArgIndex(func, groupLabel)
    return func.args.map((_, index) => (index === targetIndex ? field : ''))
  }

  const selectedFunc = computed(() => {
    const funcName = record.value?.func?.name
    return funcName ? getFuncItemByName(funcName) : null
  })

  const args = computed(() => (selectedFunc.value ? selectedFunc.value.args : []))

  const showArgsBlock = computed(() => {
    return !(args.value.length === 0 || (args.value.length === 1 && args.value[0].required))
  })

  const handleSelectFunc = (funcName: string) => {
    if (!funcName) {
      record.value.func.args = []
      return
    }
    const groupLabel = getFuncGroupByName(funcName)
    if (!groupLabel || !selectedFunc.value) {
      return
    }
    if (showArgsBlock.value) {
      record.value.func.args = fillParams(record.value.field, {
        groupLabel,
        func: selectedFunc.value,
      })
    } else {
      record.value.func.args = [record.value.field]
    }
  }

  const totalList = computed(() => props.availableFields.map((value) => ({ value })))
  const getFieldList = (queryString: string, cb: any) => {
    if (!queryString) {
      cb(totalList.value)
    }
    const ret = totalList.value.filter(({ value }) => value.includes(queryString))
    cb(ret)
  }

  const handleFieldChanged = (val: string) => {
    if (args.value.length && !showArgsBlock.value) {
      record.value.func.args = [val]
    }
  }

  /**
   * When the type of the parameter is a number type and
   * no placeholder is used, convert the type of its value
   */
  const handleArgChanged = (val: string, index: number, type: ArgumentType) => {
    if (numberArgTypes.includes(type) && val !== '' && !Number.isNaN(Number(val))) {
      record.value.func.args[index] = Number(val)
    }
  }

  return {
    record,
    getFieldList,
    handleFieldChanged,
    funcOptList,
    args,
    handleSelectFunc,
    handleArgChanged,
  }
}
