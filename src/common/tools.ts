import vueInstance from '@/main'
import { SSL } from '@/types/common'
import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'
import { SSL_VERIFY_VALUE_MAP } from './constants'

export const checkStringWithUnit = (str: string, units: Array<string>): boolean => {
  const reg = new RegExp(`^\\d+(.\\d+)?(${units.join('|')})$`)
  return reg.test(str)
}

export const checkInRange = (val: number, min: number, max: number): boolean =>
  val >= min && val <= max

export const createClipboardEleWithTargetText = (
  btn: HTMLElement,
  text: string,
  sucHandler?: () => void,
  errorHandler?: () => void,
) => {
  const t = vueInstance.$t
  const clipboard = new Clipboard(btn, { text: () => text })
  const sucFunc = sucHandler ?? (() => ElMessage.success(t('Base.copied')))
  const errorFunc = errorHandler ?? (() => ElMessage.error(t('Base.opErr')))
  clipboard.on('success', sucFunc)
  clipboard.on('error', errorFunc)
  return clipboard
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

export const parseJSONSafely = (str: string) => {
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

export const commonTimeUnits = [
  { value: 'ms', label: 'ms' },
  { value: 's', label: 's' },
  { value: 'm', label: 'm' },
  { value: 'h', label: 'h' },
  { value: 'd', label: 'd' },
]

export const formatNumber = (num: number) => new Intl.NumberFormat().format(num)
