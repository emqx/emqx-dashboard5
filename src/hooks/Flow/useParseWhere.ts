import { FilterLogicalOperator } from '@/types/enum'
import { FilterFormData, FilterItem } from './useFlowNode'
import { cloneDeep } from 'lodash'

const parseWhere = (sql: string): FilterFormData | FilterItem => {
  return parseOrCondition(sql.trim())
}

const parseOrCondition = (sql: string): FilterFormData | FilterItem => {
  const parts = splitCondition(sql, FilterLogicalOperator.Or)
  if (parts.length === 1) {
    return parseAndCondition(parts[0])
  }
  return {
    id: createRandomString(),
    groupOperator: FilterLogicalOperator.Or,
    items: parts.map((part) => parseAndCondition(part)),
  }
}

const parseAndCondition = (sql: string): FilterFormData | FilterItem => {
  const parts = splitCondition(sql, FilterLogicalOperator.And)
  if (parts.length === 1) {
    return parseCondition(parts[0])
  }
  return {
    id: createRandomString(),
    groupOperator: FilterLogicalOperator.And,
    items: parts.map((part) => parseCondition(part)),
  }
}

const splitCondition = (sql: string, separator: string) => {
  const result = []
  let level = 0
  let start = 0
  let inString = false
  const separatorReg = new RegExp(`${separator}`, 'i')
  const spaceReg = /\s|\n/
  for (let i = 0; i < sql.length; i++) {
    const currentChar = sql[i]
    const preChar = sql[i - 1]
    if (currentChar === "'" && preChar !== '\\') {
      inString = !inString
    }
    if (!inString) {
      if (currentChar === '(') {
        level++
      } else if (currentChar === ')') {
        level--
      } else if (
        level === 0 &&
        separatorReg.test(sql.substring(i, i + separator.length)) &&
        preChar &&
        spaceReg.test(preChar)
      ) {
        // Make sure there are spaces or newlines before and after the operator
        const nextChar = sql[i + separator.length]
        if (nextChar && spaceReg.test(nextChar)) {
          result.push(sql.substring(start, i).trim())
          i += separator.length - 1
          start = i + 1
        }
      }
    }
  }
  result.push(sql.substring(start).trim())
  return result
}

// The sorting is done to prioritize longer comparison operators.
const separator = new RegExp(
  `(${cloneDeep(RULE_LOGICAL_OPERATORS)
    .sort((a, b) => b.length - a.length)
    .join('|')})`,
)

const parseCondition = (condition: string): FilterItem | FilterFormData => {
  if (condition[0] === '(') {
    return parseWhere(condition.slice(1, -1))
  }
  const parts = condition.split(separator)

  const field = parts[0].trim()
  const operator = parts[1].trim()
  const value = parts.slice(2).join('').trim()
  return {
    field,
    operator,
    valueForComparison: value.startsWith("'") && value.endsWith("'") ? value.slice(1, -1) : value,
  }
}

export default (): {
  detectFilterFormLevel: (filterForm: FilterFormData) => number
  discardHighLevelCondition: (data: FilterFormData, level?: number) => FilterFormData
  generateFilterForm: (whereStr: string) => FilterFormData
} => {
  const generateFilterForm = (whereStr: string): FilterFormData => {
    const filterForm = parseWhere(whereStr)
    if (!('items' in filterForm)) {
      return {
        groupOperator: FilterLogicalOperator.And,
        id: createRandomString(),
        items: [filterForm],
      }
    }
    return filterForm
  }

  type DataOrItem = FilterFormData | FilterItem
  const discardHighLevelCondition = (data: FilterFormData, maxLevel = 2): FilterFormData => {
    const processItem = (item: DataOrItem, currentLevel: number): DataOrItem | null => {
      if (
        currentLevel > maxLevel ||
        (currentLevel === maxLevel && 'items' in item && item.items.length)
      ) {
        return null
      }

      if ('items' in item) {
        const filteredItems = item.items
          .map((i) => processItem(i, currentLevel + 1))
          .filter(Boolean) as DataOrItem[]
        return { ...item, items: filteredItems }
      }

      return item
    }

    return processItem(data, 0) as FilterFormData
  }

  const detectFilterFormLevel = (filterForm: FilterFormData): number => {
    const getMaxLevel = ({ items }: FilterFormData): number => {
      if (!items || !items.length) {
        return 0
      }

      const level = items.map((item) => ('items' in item ? getMaxLevel(item) : 0))
      return 1 + Math.max(...level)
    }

    return getMaxLevel(filterForm)
  }

  return {
    detectFilterFormLevel,
    discardHighLevelCondition,
    generateFilterForm,
  }
}
