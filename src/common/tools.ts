/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BridgeItem } from '@/types/rule'
import { cloneDeep, escape, isFunction, isObject, omit } from 'lodash'
import moment from 'moment'
import { COPY_SUFFIX } from './constants'
import { ListDataWithPagination } from '@/types/common'
import { BridgeType } from '@/types/enum'

export const dateFormat = (
  date: Date | string | number | (number | string)[] | null | undefined,
): string => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const caseInsensitiveCompare = (w: string, k: string): boolean => {
  if (typeof w !== 'string' || typeof k !== 'string') {
    throw false
  }
  return !!String.prototype.match.call(w, new RegExp(k, 'i'))
}

export function getProgressColor(val: number): string | undefined {
  const num = parseInt(val.toString())
  if (num >= 100) {
    return '#E34242FF'
  } else if (num >= 85 && num < 100) {
    return '#FB9237FF'
  }
  return undefined
}

/**
 * If there is a unit here, convert it to a value in KB
 */
function transToNumberAndConsiderItsUnit(ipt: number | string | undefined): number {
  if (typeof ipt === 'number') {
    return ipt
  }
  if (ipt === undefined) {
    return 0
  }
  const units = 'KMGTP'
  const reg = new RegExp(`^\\d+(\\.\\d+)?[${units}]$`)
  if (typeof ipt === 'string' && reg.test(ipt.toUpperCase())) {
    const unit = ipt.toUpperCase().slice(-1)
    return (
      parseFloat(ipt) *
      Math.pow(
        1024,
        units.split('').findIndex((item) => item === unit),
      )
    )
  }
  return parseFloat(ipt)
}

export const calcPercentage = (
  n1: string | number,
  n2: string | number,
  transZero = true,
): number => {
  const p = (transToNumberAndConsiderItsUnit(n1) / transToNumberAndConsiderItsUnit(n2)) * 100
  //[0,1)
  if (p < 1) return transZero ? 1 : Math.round(p)
  // NaN
  if (!p) return 0
  if (p > 100) return 100
  return p
}

export const checkStringWithUnit = (str: string, units: Array<string>): boolean => {
  const reg = new RegExp(`^\\d+(.\\d+)?(${units.join('|')})$`)
  return reg.test(str)
}

const strWithUnitReg = /^\d+(\.\d+)?(?<unit>\D+)$/
export const getUnitInStr = (str: string) => {
  const matchRet = str.match(strWithUnitReg)
  return matchRet && matchRet.groups?.unit ? matchRet.groups.unit : ''
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

export const parseJSONSafely = (str: any): Record<string, any> | void => {
  try {
    return JSON.parse(str)
  } catch (error) {
    console.error('An error occurred while parsing the JSON string')
  }
}

export const stringifyObjSafely = (obj: Record<string, any>, tabSpaces?: number): string => {
  try {
    if (typeof obj === 'string') {
      return obj
    }
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

export const formatNumber = (num: number | string | undefined) => {
  const numType = typeof num
  if (numType !== 'string' && numType !== 'number') {
    return num
  }
  const ret = new Intl.NumberFormat().format(Number(num))
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
 * Compared with the `getKeywordsFromSQL` below, the difference is that when a value cannot be obtained here, it returns undefined.
 * TODO: Merge the function below.
 */
export const getKeyPartsFromSQL = (sqlStr: string) => {
  const sql = sqlStr.trim()
  let fieldStr = undefined
  let fromStr = undefined
  let whereStr = undefined
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

/**
 * If there is FOREACH in the SQL statement
 * put the FOREACH and the following statements into the SELECT
 */
export const getKeywordsFromSQL = (sqlStr: string): SQLKeywords => {
  const { fieldStr = '', fromStr = '', whereStr = '' } = getKeyPartsFromSQL(sqlStr)
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
}: { type: BridgeType; name: string } & unknown): string => `${type}:${name}`

export const usefulMemoryUnit = ['KB', 'MB', 'GB']

const ONE_KB = 1024
const ONE_MB = ONE_KB * 1024
const ONE_GB = ONE_MB * 1024

export const transMemorySizeNumToStr = (byte: number, toFixed?: number): string => {
  const getNumPart = (num: number) => (toFixed ? num.toFixed(toFixed) : num)
  if (byte < ONE_KB) {
    return getNumPart(byte) + 'Byte'
  }
  if (byte < ONE_MB) {
    return getNumPart(byte / ONE_KB) + 'KB'
  }
  if (byte < ONE_GB) {
    return getNumPart(byte / ONE_MB) + 'MB'
  }
  return getNumPart(byte / ONE_GB) + 'GB'
}

const memoryStrReg = new RegExp(`^(\\d+(\\.\\d+)?)(${usefulMemoryUnit.join('|')})$`)
export const transMemorySizeStrToNum = (sizeStr: string): number | string => {
  const matchResult = sizeStr.match(memoryStrReg)
  if (!matchResult) {
    return sizeStr
  }
  const [, numPart, , unit] = matchResult
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

export const customValidate = async (form: any) => {
  try {
    if (form.validate && isFunction(form.validate)) {
      await form.validate()
    }
    return Promise.resolve()
  } catch (error) {
    jumpToErrorFormItem()
    return Promise.reject(error)
  }
}

/**
 * @param scrollWindow set to false when the form is in dialog or form is in container which can scroll
 */
export const jumpToErrorFormItem = (className = '.el-form-item.is-error'): boolean => {
  const el = document.querySelector(className)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return true
  }
  return false
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

/**
 * Reset fields when usually used for updates
 */
export const checkNSetToNullFromObj = (obj: Record<string, any>): Record<string, any> => {
  const checkALevel = (obj: Record<string, any>) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (isObject(value) && !Array.isArray(value)) {
        checkALevel(value)
      } else if (typeof obj[key] === 'string' && !obj[key]) {
        obj[key] = null
      }
    })
  }
  checkALevel(obj)
  return obj
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

export const URLReg =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/

const codeBlockReg = /```<\/br>(?<code>(.|\n)+)<\/br>```/
export const escapeCode = (desc: string) => {
  if (!(typeof desc === 'string')) {
    return desc
  }
  return desc.replace(codeBlockReg, (total, code) => escape(code))
}

const linkReg = new RegExp(`\\[(?<text>[^\\]]+)\\]\\((?<link>${URLReg.source})\\)`, 'g')
const createATag = (text: string, link: string) =>
  `<a href="${link}" target="_blank" rel="noopener noreferrer">${text}</a>`
export const transLink = (desc: string) => {
  if (!(typeof desc === 'string')) return desc
  return desc.replace(linkReg, (total: string, text: string, link: string) =>
    createATag(text, link),
  )
}

export const getEmptyValueByDefaultValue = (value: 'string' | 'number' | 'boolean') => {
  const type = typeof value
  return type === 'string' ? '' : undefined
}

/**
 * empty all fields in obj
 */
export const emptyObject = (obj: Record<string, any>) => {
  const ret = cloneDeep(obj)
  const walkALevel = (aLevelDefaultRecord: Record<string, any>) => {
    const keys = Object.keys(aLevelDefaultRecord)
    keys.forEach((key) => {
      const rawValue = aLevelDefaultRecord[key]
      if (typeof rawValue === 'object') {
        walkALevel(aLevelDefaultRecord[key])
      } else {
        aLevelDefaultRecord[key] = getEmptyValueByDefaultValue(aLevelDefaultRecord[key])
      }
    })
  }
  walkALevel(ret)
  return ret
}

/**
 * because the field will be deleted if value is empty when submit form
 * so we need give these field a empty value
 */
export const fillEmptyValueToUndefinedField = (
  formData: Record<string, any>,
  defaultData: Record<string, any>,
): Record<string, any> => {
  const walkALevel = (record: Record<string, any>, defaultRecord: Record<string, any>) => {
    const keys = Object.keys(defaultRecord)
    keys.forEach((key) => {
      const rawValue = defaultRecord[key]
      const isValueObj = typeof rawValue === 'object'

      if (!(key in record)) {
        if (isValueObj) {
          record[key] = emptyObject(rawValue)
        } else {
          record[key] = getEmptyValueByDefaultValue(rawValue)
        }
      } else if (isValueObj) {
        walkALevel(record[key], rawValue)
      }
    })
  }
  walkALevel(formData, defaultData)
  return formData
}

const selectReg = /select\s+/i
const fromReg = /\s+from\s+/i
const whereReg = /\s+where\s+/i
/**
 * format SQL roughly
 */
export const formatSQL = (sql: string): string => {
  if (typeof sql !== 'string') {
    return sql
  }
  const ret: string = [selectReg, fromReg, whereReg].reduce(
    (ret, reg) => (reg.test(ret) ? ret.replace(reg, (str) => `\n${str.trim()}\n  `) : ret),
    sql,
  )
  return ret[0] === `\n` ? ret.slice(1) : ret
}

export const sortedUniq = <T>(arr: Array<T>): Array<T> => [...new Set(arr)]

const isCopyReg = new RegExp(`${COPY_SUFFIX}$`)
const isReCopyReg = new RegExp(`${COPY_SUFFIX}_(?<numPart>\\d+)$`)
export const countDuplicationName = (rawName: string): string => {
  if (isCopyReg.test(rawName)) {
    return `${rawName}_1`
  }
  if (isReCopyReg.test(rawName)) {
    return rawName.replace(/\d+$/, (matched) => {
      return (Number(matched) + 1).toString()
    })
  }
  return `${rawName}${COPY_SUFFIX}`
}

export const isEmptyObj = (obj: Record<any, any>) => Object.keys(obj).length === 0

export const isJSONString = (str: string): boolean => {
  if (typeof str !== 'string') return false
  try {
    const obj = JSON.parse(str)
    return typeof obj === 'object' && obj !== null
  } catch (e) {
    return false
  }
}

export const createOrderObj = (keyArr: Array<string>, beginning: number) =>
  keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

export const getAllListData = async <T>(
  requestFunc: (params: any) => Promise<ListDataWithPagination<T>>,
): Promise<Array<T>> => {
  try {
    const limit = 1000
    let page = 1
    let allData: T[] = []
    let data: ListDataWithPagination<T>

    do {
      data = await requestFunc({ page, limit })
      allData = allData.concat([...data.data])
      page++
    } while (data.meta.count && allData.length < data.meta.count && data.data.length)

    return Promise.resolve(allData)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * will change original arr
 */
export const removeFromArr = <T>(arr: Array<T>, index: number): Array<T> => {
  arr.splice(index, 1)
  return arr
}
