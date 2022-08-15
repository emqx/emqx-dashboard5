/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BridgeItem, ConnectorItem } from '@/types/rule'
import { omit, isObject, get } from 'lodash'
import i18n from '@/i18n'

export const checkStringWithUnit = (str: string, units: Array<string>): boolean => {
  const reg = new RegExp(`^\\d+(.\\d+)?(${units.join('|')})$`)
  return reg.test(str)
}

export const checkInRange = (val: number, min?: number, max?: number): boolean => {
  if (min !== undefined && max !== undefined) {
    return val >= min && val <= max
  }
  if (min !== undefined) {
    return val >= min
  }
  if (max !== undefined) {
    return val <= max
  }
  return true
}

export const downloadByURL = (url: string) => {
  const ele = document.createElement('iframe')
  ele.src = url
  ele.style.display = 'none'
  document.body.appendChild(ele)
}

export const downloadBlobData = (blobRes: {
  data: Blob
  headers: { 'content-disposition': string; 'content-type': string }
}) => {
  const { data, headers } = blobRes
  if (!(data instanceof Blob)) {
    return
  }
  const fileName = headers['content-disposition']?.replace(/\w+; filename=(.*)/, '$1') || 'file'
  const blob = new Blob([data], { type: headers['content-type'] })
  const DOM = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  DOM.href = url
  DOM.download = decodeURI(fileName)
  DOM.style.display = 'none'
  document.body.appendChild(DOM)
  DOM.click()
  DOM.parentNode?.removeChild(DOM)
  window.URL.revokeObjectURL(url)
}

export const parseJSONSafely = (str: string): Record<string, any> | void => {
  try {
    return JSON.parse(str)
  } catch (error) {
    console.error('An error occurred while parsing the JSON string')
  }
}

export const stringifyObjSafely = (obj: Record<string, any>, tabSpaces?: number): string => {
  try {
    return JSON.stringify(obj, null, tabSpaces)
  } catch (error) {
    console.error(error)
    return 'stringify error'
  }
}

const cutNumberDecimal = (num: number, length = 10): string => {
  const [integerPart, decimalPart] = num.toString().split('.')
  let decimalPartAfterCut = decimalPart
  if (decimalPart && decimalPart.length > length) {
    decimalPartAfterCut = decimalPartAfterCut.substring(0, length)
  }
  return decimalPartAfterCut ? `${integerPart}.${decimalPartAfterCut}` : integerPart
}

/**
 * with unit ms
 */
const ONE_SECOND = 1000
const ONE_MINUTE = ONE_SECOND * 60
const ONE_HOUR = ONE_MINUTE * 60
const ONE_DAY = ONE_HOUR * 24

/**
 * number (ms) to string (with unit ms/s/m/h/d)
 */
export const transMSNumToString = (num: number): string => {
  if (num < ONE_SECOND) {
    return num + 'ms'
  }
  if (num < ONE_MINUTE) {
    return num / ONE_SECOND + 's'
  }
  if (num < ONE_HOUR) {
    return cutNumberDecimal(num / ONE_MINUTE) + 'm'
  }
  if (num < ONE_DAY) {
    return cutNumberDecimal(num / ONE_HOUR) + 'h'
  }
  return cutNumberDecimal(num / ONE_DAY) + 'd'
}

export const getLabelFromValueInOptionList = <T>(
  targetValue: T,
  optionList: Array<{ value: T; label: string }>,
): string => {
  const target = optionList.find(({ value }) => value === targetValue)
  return target?.label || ''
}

export const commonTimeUnits = ['ms', 's', 'm', 'h', 'd']

export const formatNumber = (num: number) => {
  const ret = new Intl.NumberFormat().format(num)
  return ret === 'NaN' ? '' : ret
}

const ZERO_ASCII = 48
const LOWER_A_ASCII = 97
const charLib = String.fromCharCode(
  ...new Array(10)
    .fill(ZERO_ASCII)
    .map((item, index) => item + index)
    .concat(new Array(26).fill(LOWER_A_ASCII).map((item, index) => item + index)),
)

export const createRandomString = (length = 8) => {
  const libLength = charLib.length
  return new Array(length).fill('').reduce((str) => {
    const randomIndex = Math.floor(Math.random() * libLength)
    return str + charLib.substring(randomIndex, randomIndex + 1)
  }, '')
}

interface SQLKeywords {
  fieldStr: string
  fromStr: string
  whereStr: string
}

export const handleSQLFromPartStatement = (fromStr: string): string => {
  return fromStr
    .trim()
    .split(',')
    .map((item) => {
      const ret = item.trim()
      return ret.replace(/'|"/g, '')
    })
    .join(', ')
}

/**
 * If there is FOREACH in the SQL statement
 * put the FOREACH and the following statements into the SELECT
 */
export const getKeywordsFromSQL = (sqlStr: string): SQLKeywords => {
  const sql = sqlStr.trim()
  let fieldStr = ''
  let fromStr = ''
  let whereStr = ''
  let matchResult = null

  const isForeachReg = /^FOREACH/i
  if (isForeachReg.test(sql)) {
    matchResult = sql.match(/(.|\n)+WHERE(?<where>(.|\n)+)/)
  } else {
    matchResult =
      sql.match(/^SELECT(?<select>(.|\n)+)FROM(?<from>(.|\n)+)(WHERE(?<where>(.|\n)+))/i) ||
      sql.match(/^SELECT(?<select>(.|\n)+)FROM(?<from>(.|\n)+)/i)
  }
  if (matchResult) {
    const { groups } = matchResult
    const { foreach = '', select = '', from = '', where = '' } = groups || {}
    fieldStr = foreach ? foreach : select.trim()
    fromStr = handleSQLFromPartStatement(from)
    if (where) {
      whereStr = where.trim()
    }
  }
  return {
    fieldStr,
    fromStr,
    whereStr,
  }
}

export const formatSELECTStatement = (str: string): string => {
  const isForeach = /^FOREACH(.|\n)+/i.test(str)
  if (isForeach) {
    return str
  }
  return str
    .split(',')
    .map((item) => item.trim())
    .join(',\n  ')
}

export const getBridgeKey = ({
  type,
  name,
}: Omit<BridgeItem, 'id' | 'idForRuleFrom'> | Omit<ConnectorItem, 'id'>): string =>
  `${type}:${name}`

export const getConnectorKey = getBridgeKey

export const usefulMemoryUnit = ['Byte', 'KB', 'MB', 'GB']

const ONE_KB = 1024
const ONE_MB = ONE_KB * 1024
const ONE_GB = ONE_MB * 1024

export const transMemorySizeNumToStr = (byte: number): string => {
  if (byte < ONE_KB) {
    return byte + 'Byte'
  }
  if (byte < ONE_MB) {
    return byte / ONE_KB + 'KB'
  }
  if (byte < ONE_GB) {
    return byte / ONE_MB + 'MB'
  }
  return byte / ONE_GB + 'GB'
}

const memoryStrReg = new RegExp(`^(\\d+(\\.\\d+)?)(${usefulMemoryUnit.join('|')})$`)
export const transMemorySizeStrToNum = (sizeStr: string): number | string => {
  const matchResult = sizeStr.match(memoryStrReg)
  if (!matchResult) {
    return sizeStr
  }
  const [totalStr, numPart, decimalPart, unit] = matchResult
  switch (unit) {
    case 'Byte':
      return Number(numPart)
    case 'KB':
      return Number(numPart) * ONE_KB
    case 'MB':
      return Number(numPart) * ONE_MB
    case 'GB':
      return Number(numPart) * ONE_GB
  }
  return parseFloat(sizeStr)
}

export const checkIsValidArr = (arr: Array<any>): boolean => arr.filter((item) => !!item).length > 0

export const waitAMoment = (ms = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

export const numToFixed = (number: number, digits = 3): number => parseFloat(number.toFixed(digits))

/**
 * @param scrollWindow set to false when the form is in dialog or form is in container which can scroll
 */
export const jumpToErrorFormItem = (
  scrollWindow = true,
  className = '.el-form-item.is-error',
): void => {
  const el = document.querySelector(className)
  if (el) {
    if (scrollWindow) {
      const top = el.getBoundingClientRect().top - 100
      // can not use scrollIntoView directly, because el will be hidden by header
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export const findExtensionByName = (name: string): string => {
  const reg = /.+\.(.+)/
  const matchResult = name.match(reg)
  return !matchResult ? '' : matchResult[1]
}

export const sortStringArr = (strArr: Array<string>, isAsc = true): Array<string> => {
  return strArr.sort((a, b) => {
    const ret = a.localeCompare(b)
    return isAsc ? ret : -ret
  })
}

/**
 * the title -> The Title
 */
export const titleCase = (str: string): string => {
  return str.replace(/(^[a-z])|(\s[a-z])/g, (a: string) => {
    return a.toUpperCase()
  })
}

export const tryToCompleteURL = (url: string): string => {
  if (!/^(http)/.test(url)) {
    return `http://${url}`
  }
  return url
}

/**
 * is obj[key] is string and is empty, delete it
 */
export const checkNOmitFromObj = (obj: Record<string, any>): Record<string, any> => {
  const emptyValueKeyArr = Object.keys(obj).filter((key) => {
    if (isObject(obj[key]) && !Array.isArray(obj[key])) {
      obj[key] = checkNOmitFromObj(obj[key])
    }
    return typeof obj[key] === 'string' ? !obj[key] : false
  })
  return omit(obj, emptyValueKeyArr)
}

// { a: { b: c: 1 } } => { 'a.b.c': 1 }
export const flattenObject = (
  obj: { [key: string]: any },
  prefix: any[] = [],
  current: { [key: string]: any } = {},
) => {
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    for (const key of Object.keys(obj)) {
      flattenObject(obj[key], prefix.concat(key), current)
    }
  } else {
    current[prefix.join('.')] = obj
  }
  return current
}
// { 'a.b.c': 1 } => { a: { b: { c: 1 } } }
export const unflattenObject = (obj: { [key: string]: any }) => {
  if (Object(obj) !== obj && !Array.isArray(obj)) return obj
  const regex = /\.?([^.[\]]+)|\[(\d+)\]/g
  const resultholder: { [key: string]: any } = {}
  try {
    for (const p in obj) {
      let current = resultholder
      let prop = ''
      let m: any
      while ((m = regex.exec(p))) {
        current = current[prop] || (current[prop] = m[2] ? [] : {})
        prop = m[2] || m[1]
      }
      current[prop] = obj[p]
    }
  } catch (error) {
    console.error(error)
  }
  return resultholder[''] || resultholder
}

export const replaceSpaceForHTML = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return str
  }
  return str.replace(/\s/g, '\u00a0')
}

export const chunkStr = (str: string, chunkLength = 4) => {
  const reg = new RegExp(`.{1,${chunkLength}}`, 'g')
  return str.match(reg)
}

export const getLocalMessage = (path: string) => {
  const local = i18n.global.locale
  const messages = i18n.global.messages[local]
  return get(messages, path)
}
