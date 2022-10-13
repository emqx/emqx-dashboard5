// import sqlFormatter from "sql-formatter";
// import parser from "js-sql-parser";
import store from '@/store'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

export function randomStr(len = 6) {
  let str = ''
  do {
    str += Math.random()
      .toString(36)
      .substring(2)
      .replace(/[^a-z]+/g, '')
  } while (str.length < len)
  return str.substring(0, len)
}

// template ['a.b.c','a','a.d']
export function transformStrToUnitArray(obj, template = [], prefix = '') {
  let dest = {}
  Object.keys(obj).forEach((k) => {
    let kPrefix = prefix ? prefix + '.' + k : k
    if (template.includes(kPrefix)) {
      let matching = obj[k].match(/(\d+)(\w+)/)
      dest[k] = [+matching[1], matching[2]]
    } else if (typeof obj[k] === 'object' && obj[k] && !(obj[k] instanceof Array)) {
      let nextTemplate = template.filter((v) => v.indexOf(kPrefix + '.') >= 0)
      dest[k] = transformStrToUnitArray(obj[k], nextTemplate, kPrefix)
    } else {
      dest[k] = obj[k]
    }
  })
  return dest
}

export function transformUnitArrayToStr(obj) {
  let dest = {}
  Object.entries(obj).forEach((e) => {
    const [k, v] = e
    if (v instanceof Array) {
      if (v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'string') {
        dest[k] = v.join('')
      } else {
        dest[k] = v
      }
    } else if (typeof v === 'object' && v) {
      dest[k] = transformUnitArrayToStr(v)
    } else {
      dest[k] = v
    }
  })
  return dest
}

export const caseInsensitiveCompare = (w, k) => {
  return !!String.prototype.match.call(w, new RegExp(k, 'i'))
}

export const dateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 模糊查询搜索
 * @param data 搜索的数据 searchKey 搜索的字段名称 searchValue 搜索的值
 * @return value Promise<any>
 */
export const matchSearch = (data, searchKey, searchValue) => {
  return new Promise((resolve, reject) => {
    try {
      const filterData = data.filter(($) => {
        if ($[searchKey]) {
          const key = $[searchKey].toLowerCase().replace(/\s+/g, '')
          const value = searchValue.toLocaleLowerCase().replace(/\s+/g, '')
          return key.match(value)
        } else {
          return null
        }
      })
      return resolve(filterData)
    } catch (error) {
      return reject(error)
    }
  })
}

/**
 * 将内存数值转化为 KB MB G
 * @param number 需要转化的数值
 * @return string 转化后的字符串
 */
// export const formatNumberSize = (number) => {
//   const scale = 1000
//   const digitList = ['K', 'M', 'G', 'T']
//   let residue = Math.round((number % scale) / 100) // 小数点后数，1位
//   let $integer = Math.round(number / scale) // 最小单位kb
//   let digit = 0
//   while ($integer > scale) {
//     residue = Math.round(($integer % scale) / 100)
//     $integer = Math.round($integer / scale)
//     digit += 1
//   }
//   return `${$integer}.${residue}${digitList[digit]}B`
// }

export function ruleOldSqlCheck(sql) {
  const $sql = sql.replace(/"/g, '')
  const oldEvent = [
    'message.publish',
    'message.deliver',
    'message.acked',
    'message.dropped',
    'client.connected',
    'client.disconnected',
    'client.subscribe',
    'client.unsubscribe',
  ]
  let matchRes = null
  oldEvent.forEach((e) => {
    const [eventType, eventValue] = e.split('.')
    const eventReg = new RegExp(`${eventType}\\.${eventValue}`, 'gim')
    if ($sql.match(eventReg)) {
      matchRes = $sql.match(eventReg)
    }
  })
  return matchRes
}

// export function ruleNewSqlParser(sql, e) {
//   const oldEventDict = {
//     "message.publish": "",
//     "message.deliver": "$events/message_delivered",
//     "message.acked": "$events/message_acked",
//     "message.dropped": "$events/message_dropped",
//     "client.connected": "$events/client_connected",
//     "client.disconnected": "$events/client_disconnected",
//     "client.subscribe": "$events/session_subscribed",
//     "client.unsubscribe": "$events/session_unsubscribed",
//   };
//   let newEvent = oldEventDict[e];
//   const $sql = sql.replace(/"/g, "");
//   try {
//     const ast = parser.parse($sql);
//     if (newEvent === "") {
//       ast.value.where = null;
//       newEvent = "#";
//     }
//     ast.value.from.value[0].value.value.value = `"${newEvent}"`;
//     return parser.stringify(ast);
//   } catch (err) {
//     // Message.error(err.toString());
//   }
// }

export function formatNumber(num) {
  let number = String(parseInt(num))
  return number.replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,')
}

export function getProgressColor(val, primaryC) {
  let color = primaryC
  let num = parseInt(val)
  if (num >= 100) {
    color = '#E34242FF'
  } else if (num >= 85 && num < 100) {
    color = '#FB9237FF'
  }
  return color
}

/**
 * If there is a unit here, convert it to a value in KB
 */
function transToNumberAndConsiderItsUnit(ipt) {
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

export const calcPercentage = (n1, n2, transZero = true) => {
  let p = (transToNumberAndConsiderItsUnit(n1) / transToNumberAndConsiderItsUnit(n2)) * 100
  //[0,1)
  if (p < 1) return transZero ? 1 : Math.round(p)
  // NaN
  if (!p) return 0
  if (p > 100) return 100
  return p
}

export function getDateDiff(duration) {
  // get total seconds value (s)
  const dateDiff = Math.floor(duration)
  const days = Math.floor(dateDiff / (3600 * 24))

  const daysRemainder = dateDiff % (3600 * 24)
  const hours = Math.floor(daysRemainder / 3600)

  const minutes = Math.floor((dateDiff % 3600) / 60)
  const seconds = dateDiff % 60

  return [days, hours, minutes, seconds]
}

export function getDuration(duration) {
  let dateDiff = getDateDiff(duration / 1000 || [])
  let readableDate = []
  let { t } = useI18n()
  dateDiff.reduce((c, v, i) => {
    if (c == 0 && v == 0 && i < 3) {
      // nothing
    } else {
      switch (i) {
        case 0:
          readableDate.push([v, t('General.day', v)])
          break
        case 1:
          readableDate.push([v, t('General.hour', v)])
          break
        case 2:
          readableDate.push([v, t('General.min', v)])
          break
        case 3:
          readableDate.push([v, t('General.sec', v)])
          break
      }
    }
    return c + v
  }, 0)

  return readableDate
    .map((_) => {
      return _.join(t('General.timeSep'))
    })
    .join(t('General.timePartSep'))
}
