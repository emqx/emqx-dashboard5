import { RULE_LOGICAL_OPERATORS } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import { FilterLogicalOperator } from '@/types/enum'
import { FilterForm, FilterItem } from './useFlowNode'

const parseWhere = (sql: string): FilterForm | FilterItem => {
  return parseOrCondition(sql.trim())
}

const parseOrCondition = (sql: string): FilterForm | FilterItem => {
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

const parseAndCondition = (sql: string): FilterForm | FilterItem => {
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
      } else if (level === 0 && separatorReg.test(sql.substring(i, i + separator.length))) {
        result.push(sql.substring(start, i).trim())
        i += separator.length - 1
        start = i + 1
      }
    }
  }
  result.push(sql.substring(start).trim())
  return result
}

// The sorting is done to prioritize longer comparison operators.
const separator = new RegExp(
  `(${RULE_LOGICAL_OPERATORS.sort((a, b) => b.length - a.length).join('|')})`,
)

const parseCondition = (condition: string): FilterItem | FilterForm => {
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
    valueForComparison:
      value.startsWith("'") && value.endsWith("'") ? value.slice(1, -1) : Number(value),
  }
}

export default (): {
  generateFilterForm: (whereStr: string) => FilterForm
} => {
  const generateFilterForm = (whereStr: string): FilterForm => {
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

  return {
    generateFilterForm,
  }
}
