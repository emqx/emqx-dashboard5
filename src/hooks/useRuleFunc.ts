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

export default (): {
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
