import RuleFunc from '@/hooks/Rule/RuleFunc.json'

export const enum ArgumentType {
  Number = 'number',
  Any = 'any',
  Float = 'float',
  Integer = 'integer',
  String = 'string',
  Enum = 'enum',
  Object = 'Object',
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

interface FuncItem {
  name: string
  args: Array<ArgItem>
}

interface GroupFuncData {
  groupLabel: string
  list: Array<FuncItem>
}

type FuncData = Array<GroupFuncData>

export default () => {
  const funcOptList: FuncData = RuleFunc.map(({ groupLabel, list }) => ({
    groupLabel,
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
  return {
    funcOptList,
    getFuncItemByName,
  }
}
