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

export function setLanguage(lang = false) {
  let language = lang ?? null
  if (!language) {
    language = navigator.language.substring(0, 2)
  }
  store.commit('SET_LANGUAGE', language)
  document.documentElement.setAttribute('lang', language)
}

export const caseInsensitiveCompare = (w, k) => {
  return !!String.prototype.match.call(w, new RegExp(k, 'i'))
}

export const dateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 填充转化对象类型的 i18n
 * @param data 转化的数据，key 对象的 key 值，autoSearch 是否自动搜索
 * @return data: object
 */
// function fillObjectI18n(data = {}) {
//   const { lang = "zh" } = store.state;

//   Object.keys(data).forEach((key) => {
//     let value = data[key];
//     if (typeof value !== "object") {
//       return;
//     }
//     if ("en" in value && "zh" in value) {
//       data[key] = value[lang];
//     } else {
//       fillObjectI18n(value);
//     }
//   });
//   return data;
// }
// 将 [{ title: { en: 'Title', zh: '标题' } }] 翻译为 [{ title: '标题' }]
// export function fillI18n(data = [], keys = [], autoSearch = false) {
//   if (!data) {
//     return data;
//   }
//   const { lang = "zh" } = store.state;
//   const dataIsArray = Array.isArray(data);

//   // if (typeof keys === 'boolean') {
//   //   autoSearch = keys
//   //   keys = []
//   // }

//   if (dataIsArray) {
//     data.forEach((item) => {
//       if (autoSearch) {
//         return fillObjectI18n(item);
//       }
//       keys.forEach((key) => {
//         if (!item[key]) {
//           return;
//         }
//         item[key] = item[key][lang];
//       });
//     });
//   } else {
//     if (autoSearch) {
//       return fillObjectI18n(data);
//     }
//     keys.forEach((key) => {
//       if (!data[key]) {
//         return;
//       }
//       data[key] = data[key][lang];
//     });
//   }
//   return data;
// }

/**
 * 根据参数生成 render 数据
 * @param params 资源或动作参数
 * @return {{form: Array, rules}}
 */
// export function renderParamsForm(params = {}, propPrefix = "") {
//   let form = [];
//   const rules = {};
//   let oneObjOfArray = {};
//   let extraConfigs = {};

//   for (const [k, v] of Object.entries(params)) {
//     if (k === "$resource") {
//       continue;
//     }
//     const {
//       default: defaultValue,
//       description = "",
//       enum: enumValue,
//       title,
//       type,
//       input = "text",
//       order = 10,
//       format,
//       required = false,
//       items,
//     } = v;
//     let inputType = type;
//     let elType = "input";
//     let field = {};
//     switch (type) {
//       case "string":
//         inputType = input || "text";
//         break;
//       case "number":
//         inputType = "number";
//         break;
//       case "boolean":
//         inputType = "text";
//         elType = "select";
//         field = { list: [true, false] };
//         break;
//       case "object":
//         defaultValue = !Object.keys(defaultValue).length ? {} : defaultValue;
//         elType = "object";
//         break;
//       case "file":
//         defaultValue =
//           typeof defaultValue === "string"
//             ? {
//                 file: "",
//                 filename: defaultValue,
//               }
//             : defaultValue;
//         elType = "file";
//         break;
//       case "array":
//         if (items.type === "object") {
//           const { schema } = items;
//           oneObjOfArray = renderParamsForm(schema);
//           defaultValue = !defaultValue.length ? [] : defaultValue;
//         }
//         elType = "array";
//         break;
//       case "cfgselect":
//         elType = "cfgselect";
//         field = { list: enumValue };
//         extraConfigs = items;
//     }
//     if (enumValue && elType !== "cfgselect") {
//       elType = "select";
//       field = { list: enumValue };
//     }
//     const inputPlaceholder =
//       description.length < 24 && propPrefix !== "configs" ? description : "";
//     // 表单类型, 渲染使用的属性
//     form.push({
//       formItemAttributes: {
//         prop: propPrefix ? `${propPrefix}.${k}` : k,
//         label: title,
//         description:
//           inputPlaceholder && elType !== "file" && propPrefix !== "configs"
//             ? null
//             : description.replace(/\n/g, "<br/>"),
//       },
//       bindAttributes: {
//         type: inputType,
//         field:
//           elType === "select" || elType === "cfgselect" ? field : undefined,
//         placeholder: inputPlaceholder,
//         rows: inputType === "textarea" ? 5 : 0,
//       },
//       key: k,
//       type: inputType,
//       elType,
//       value: !defaultValue && propPrefix === "configs" ? "" : defaultValue,
//       order,
//       oneObjOfArray: elType === "array" ? oneObjOfArray : {},
//       extraConfigs: elType === "cfgselect" ? extraConfigs : {},
//     });
//     // rules 的属性
//     rules[k] = [];
//     const requiredInputText = "Field required";
//     const requiredSelectText = "Please select";
//     const requiredArrayText = "Please Add";

//     if (required) {
//       if (elType === "array") {
//         rules[k].push({ required: true, message: requiredArrayText });
//       } else {
//         rules[k].push({
//           required: true,
//           message: elType === "input" ? requiredInputText : requiredSelectText,
//         });
//       }
//     }
//     if (enumValue) {
//       const options = enumValue.map(($) =>
//         typeof $ === "boolean" ? $.toString() : $
//       );
//       rules[k].push({ type: "enum", enum: options });
//     }
//   }
//   form = form.sort((prev, next) => prev.order - next.order);
//   // form 综合排序
//   return { form, rules };
// }

/**
 * sql 语句格式化
 * @param sql 传入的 sql 语句
 * @return sql: string
 */
// export const sqlExampleFormatter = (sql) => {
//   const newSQL = sqlFormatter.format(sql);
//   let text = newSQL.replace(/= ~/g, "=~").replace(/\n/g, "!#!");
//   const paramsRe = text.match(/SELECT!#!(.+)!#!FROM/);
//   if (paramsRe) {
//     const paramsText = paramsRe[1];
//     if (paramsText) {
//       const newParamsText = paramsText
//         .replace(/(!#!|\s)/g, " ")
//         .split(/[,，]/)
//         .join(", ");
//       text = text.replace(paramsText, `${newParamsText}`);
//     }
//   }
//   return text.replace(/!#!/g, "\n\r");
// };

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
