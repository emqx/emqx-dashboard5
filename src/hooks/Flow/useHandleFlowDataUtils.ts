import useRuleFunc, { ArgumentType, numberArgTypes } from '../useRuleFunc'
import {
  EditedWay,
  FilterForm,
  FilterFormData,
  FilterItem,
  FunctionForm,
  FunctionItem,
} from './useFlowNode'

export default (): {
  getFuncExpressionFromForm: (funcForm: FunctionForm) => string
  getFuncExpressionFromFuncList: (funcList: Array<FunctionItem>) => string
  getFilterExpressionFromFormData: (filterData: FilterFormData, level?: number) => string
  getFilterExpressionFromForm: (filterData: FilterForm, level?: number) => string
} => {
  /* FUNCTION */
  const { getFuncItemByName } = useRuleFunc()
  const getExpressionFromFunctionItem = (
    {
      name,
      args,
    }: {
      name: string
      args: Array<string | number>
    },
    field: string,
  ): string => {
    const argsStr = args.reduce((result, argItem, index) => {
      if (argItem === '' || argItem === undefined) {
        return result
      }
      const funcItem = getFuncItemByName(name)
      const argInfo = funcItem?.args[index]
      const isStringType =
        argInfo?.type === ArgumentType.String ||
        (argInfo?.type === ArgumentType.Enum &&
          typeof argInfo?.optionalValues?.find((enumItem) => enumItem === argItem) === 'string')
      const isNumType = argInfo?.type && numberArgTypes.includes(argInfo?.type)
      let argResult = argItem
      if (argItem !== field) {
        if (isStringType) {
          argResult = `'${argItem}'`
        } else if (isNumType && Number(argItem).toString() === argItem) {
          argResult = Number(argItem)
        }
      }
      return result ? `${result}, ${argResult}` : `${argResult}`
    }, '')
    return `${name}(${argsStr})`
  }

  const getFuncExpressionFromFormItem = (formItem: FunctionItem) => {
    const { field, func, alias } = formItem
    const selection = func.name ? getExpressionFromFunctionItem(func, field) : field
    const aliasStr = alias ? ` as ${alias}` : ''
    return selection + aliasStr
  }

  const getFuncExpressionFromFuncList = (funcList: Array<FunctionItem>) => {
    return funcList.reduce((str: string, item: FunctionItem) => {
      const currentExpression = getFuncExpressionFromFormItem(item)
      return str ? `${str}, ${currentExpression}` : currentExpression
    }, '')
  }

  const getFuncExpressionFromForm = (formData: FunctionForm) => {
    const { editedWay, form, sql } = formData
    if (editedWay === EditedWay.SQL) {
      return sql
    }
    return getFuncExpressionFromFuncList(form)
  }

  /* FILTER */
  const getFilterExpressionFromFormData = (filterData: FilterFormData, level = 0) => {
    if (Array.isArray(filterData.items)) {
      const clauses: Array<string> = filterData.items.map((item) =>
        getFilterExpressionFromFormData(item as FilterFormData, level + 1),
      )
      return `${level > 0 ? '(' : ''}${clauses.join(` ${filterData.groupOperator} `)}${
        level > 0 ? ')' : ''
      }`
    }
    const { field, operator, valueForComparison } = filterData as unknown as FilterItem
    if (!field || !operator || !valueForComparison) {
      return ''
    }
    // TODO:Confirm how to determine the type of input data.
    const strForComparison =
      typeof valueForComparison === 'string' ? `'${valueForComparison}'` : valueForComparison
    return `${field} ${operator} ${strForComparison}`
  }

  const getFilterExpressionFromForm = (filterData: FilterForm) => {
    const { editedWay, form, sql } = filterData
    if (editedWay === EditedWay.SQL) {
      return sql
    }
    return getFilterExpressionFromFormData(form)
  }

  return {
    getFuncExpressionFromForm,
    getFuncExpressionFromFuncList,
    getFilterExpressionFromFormData,
    getFilterExpressionFromForm,
  }
}
