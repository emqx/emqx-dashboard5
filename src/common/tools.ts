import { SSL } from '@/types/common'
import { BridgeItem, ConnectorItem } from '@/types/rule'
import { SSL_VERIFY_VALUE_MAP } from './constants'

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

export const stringifyObjSafely = (obj: Record<string, any>): string => {
  try {
    return JSON.stringify(obj)
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

export const createRawSSLParams = (): SSL => ({
  enable: false,
  verify: SSL_VERIFY_VALUE_MAP.get(false) as string,
  certfile: '',
  keyfile: '',
  cacertfile: '',
})

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

export const fallbackCopyTextToClipboard = async (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text

  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  } catch (err) {
    return Promise.reject()
  } finally {
    document.body.removeChild(textArea)
  }
}

export const copyToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text)
  }
  return navigator.clipboard.writeText(text)
}

export const getKeywordsFromSQL = (sqlStr: string) => {
  const sql = sqlStr.replace(/\n/g, ' ').trim()
  let fieldStr = ''
  let fromStr = ''
  let whereStr = ''

  const matchResult = sql.match(/SELECT(.+)FROM(.+)WHERE(.+)/i) ?? sql.match(/SELECT(.+)FROM(.+)/i)
  if (matchResult && matchResult.length >= 3) {
    const [totalSQL, fields, from, where] = matchResult
    fieldStr = fields.trim()
    fromStr = from
      .trim()
      .split(',')
      .map((item) => {
        const ret = item.trim()
        return ret.replace(/'|"/g, '')
      })
      .join(', ')
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

export const transMemorySizeNumToStr = (byte: number) => {
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
