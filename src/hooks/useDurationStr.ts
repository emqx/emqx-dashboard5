import { TimeUnit } from '@/types/enum'
import useI18nTl from './useI18nTl'

const timeUnitArr: Array<TimeUnit> = [
  TimeUnit.Millisecond,
  TimeUnit.Second,
  TimeUnit.Minute,
  TimeUnit.Hour,
  TimeUnit.Day,
]

type TimeUnitExcludeDay = Exclude<TimeUnit, TimeUnit.Day>

const timeUnitToNextLevelBinary: Record<TimeUnitExcludeDay, number> = {
  [TimeUnit.Millisecond]: 1000,
  [TimeUnit.Second]: 60,
  [TimeUnit.Minute]: 60,
  [TimeUnit.Hour]: 24,
}

const getBinaryArr = (beginIndex: number) => {
  return timeUnitArr.slice(beginIndex, -1).map((unit, index) => {
    let ret = timeUnitToNextLevelBinary[timeUnitArr[beginIndex] as TimeUnitExcludeDay]
    for (let j = beginIndex + 1; j < timeUnitArr.length - 1 - index; j++) {
      ret *= timeUnitToNextLevelBinary[timeUnitArr[j] as TimeUnitExcludeDay]
    }
    return ret
  })
}

export default () => {
  const { t } = useI18nTl('General')

  const unitStrKeyMap = {
    [TimeUnit.Millisecond]: 'General.ms',
    [TimeUnit.Second]: 'General.sec',
    [TimeUnit.Minute]: 'General.min',
    [TimeUnit.Hour]: 'General.hour',
    [TimeUnit.Day]: 'General.day',
  }

  const getDurationStr = (val: number | string, unit: TimeUnit): string | number => {
    if (
      unit === undefined ||
      !timeUnitArr.some((item) => item === unit) ||
      Number.isNaN(Number(val)) ||
      Number(val) === 0
    ) {
      return val
    }
    const valNum = Number(val)
    const beginIndex = timeUnitArr.findIndex((item) => item === unit)
    // arr for [how units is a day, how units is an hour ...]
    const binaryArr = getBinaryArr(beginIndex)
    const needUseUnitArr = timeUnitArr.slice(beginIndex).reverse()
    let ret = ''
    let currentRemaining = valNum
    for (let index = 0; index < binaryArr.length; index++) {
      const currentUnitNum = Math.floor(currentRemaining / binaryArr[index])
      if (currentUnitNum >= 1) {
        ret += ` ${currentUnitNum} ${t(unitStrKeyMap[needUseUnitArr[index]], currentUnitNum)}`
        currentRemaining -= currentUnitNum * binaryArr[index]
      }
    }
    if (currentRemaining !== 0) {
      ret += ` ${currentRemaining} ${t(
        unitStrKeyMap[needUseUnitArr[needUseUnitArr.length - 1]],
        currentRemaining,
      )}`
    }
    return ret.trim()
  }

  const transMsNumToSimpleStr = (num: number) => {
    return getDurationStr(Math.floor(num / 1000), TimeUnit.Second)
  }

  return {
    getDurationStr,
    transMsNumToSimpleStr,
  }
}
