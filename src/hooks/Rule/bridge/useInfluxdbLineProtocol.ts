import { trim } from 'lodash'
import useInfluxdbFieldsEditor, {
  FieldValueType,
} from '@/hooks/Rule/bridge/useInfluxdbFieldsEditor'
export interface KeyValueItem {
  key: string
  value: string
}

interface ParseResult {
  measurement: string
  tagArr: Array<KeyValueItem>
  fieldArr: Array<KeyValueItem>
  timestamp: string | undefined
}

export default (): {
  parseLine: (line: string) => ParseResult | undefined
  convertArrToMap: (arr: Array<KeyValueItem>) => Record<string, string>
  trimLineProtocol: (lineProtocol: string) => string
  escape: (str: string) => string
  escapeFieldValue: (str: string) => string
  unescape: (str: string) => string
  unescapeFieldValue: (str: string) => string
} => {
  /* 
    # Syntax
    <measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]

    # Example
    myMeasurement,tag1=value1,tag2=value2 fieldKey="fieldValue" 1556813561098000000
  */

  /*
    can use there sample to confirm func
    const SQL1 = 'weather,location=us-midwest,closeSea=true temperature=82,humidity=71 1465839830100400200'
    const SQL2 = `my\ Measurement,tag\ Key1=tag\ Value1,tag\ Key2=tag\ Value2,tagKey=🍭 fieldKey="\"string\" within a string",fieldKey2="Launch 🚀"`
   */
  // FIXME: process new row (\n)
  const measurementReg = /([^,\s]|(?<=\\),|(?<=\\)\s)+/
  const keyNValueReg = /([^,\s=]|(?<=\\),|(?<=\\)\s|(?<=\\)=)+/
  const fieldValueReg = /(".+")|[^"\s,]+/
  const tagItemReg = new RegExp(
    `(?<tagKey>${keyNValueReg.source})=(?<tagValue>${keyNValueReg.source})`,
  )
  const tagPartReg = new RegExp(`(${tagItemReg.source},?)+`)
  const fieldItemReg = new RegExp(
    `(?<fieldKey>${keyNValueReg.source})=(?<fieldValue>${fieldValueReg.source})`,
  )
  const fieldsPartReg = new RegExp(`(${fieldItemReg.source},?)+`)
  const timestampPart = /.+/

  const protocolReg = new RegExp(
    `^(?<measurement>${measurementReg.source})(,(?<tags>${tagPartReg.source}))?(\\s(?<fields>${fieldsPartReg.source}))(\\s(?<timestamp>${timestampPart.source}))?$`,
  )

  const getTags = (tags: string): Array<KeyValueItem> => {
    if (!tags) {
      return []
    }
    const matchRet: Array<string> | null = tags.match(new RegExp(tagItemReg.source, 'g'))
    if (matchRet) {
      return matchRet.reduce((arr: Array<KeyValueItem>, item) => {
        const { groups } = item.match(tagItemReg) || {}
        if (groups) {
          return [...arr, { key: groups.tagKey, value: groups.tagValue }]
        }
        return arr
      }, [])
    }
    return []
  }

  const getFields = (fields: string): Array<KeyValueItem> => {
    if (!fields) {
      return []
    }
    const matchRet: Array<string> | null = fields.match(new RegExp(fieldItemReg.source, 'g'))
    if (matchRet) {
      return matchRet.reduce((arr: Array<KeyValueItem>, item) => {
        const { groups } = item.match(fieldItemReg) || {}
        if (groups) {
          return [...arr, { key: groups.fieldKey, value: groups.fieldValue }]
        }
        return arr
      }, [])
    }
    return []
  }

  const parseLine = (line: string): ParseResult | undefined => {
    const matchRet = line.match(protocolReg)
    if (matchRet && matchRet.groups) {
      const { measurement, tags, fields, timestamp } = matchRet.groups
      const tagArr = getTags(tags)
      const fieldArr = getFields(fields)
      return { measurement, tagArr, fieldArr, timestamp }
    }
    return
  }

  const convertArrToMap = (arr: Array<KeyValueItem>) => {
    return arr.reduce((map, item) => {
      return { ...map, [item.key]: item.value }
    }, {})
  }

  const specialLetterReg = /,|\s|=/g
  /**
   * add \ before comma, space and equals sign, for form to line protocol
   * can escape tag key, tag value and field key
   * @param str key or value, not the total line protocol
   */
  const escape = (str: string): string => {
    return str.replace(specialLetterReg, (matched) => `\\${matched}`)
  }
  const fieldValueEscapeReg = /"|\\/g
  const escapeFieldValue = (str: string): string => {
    if (judgeFieldValueType(str) === FieldValueType.String) {
      return `${str[0]}${str
        .slice(1, -1)
        .replace(fieldValueEscapeReg, (matched) => `\\${matched}`)}${str.slice(-1)}`
    }
    return str
  }

  const strPartAfterEscapeReg = /\\(=|\s|,)/g
  /**
   * remove \ before comma, space and equals sign, for line protocol to form
   * can unescape tag key, tag value and field key
   * @param str key or value, not the total line protocol
   */
  const unescape = (str: string): string => {
    return str.replace(strPartAfterEscapeReg, (matched, p1) => p1)
  }
  const { judgeFieldValueType } = useInfluxdbFieldsEditor()

  const fieldValueUnescapeReg = /\\("|\\)/g
  /**
   * backslash and double quotes
   */
  const unescapeFieldValue = (str: string): string => {
    if (judgeFieldValueType(str) === FieldValueType.String) {
      return `${str[0]}${str
        .slice(1, -1)
        .replace(fieldValueUnescapeReg, (matched, target) => target)}${str.slice(-1)}`
    }
    return str
  }

  const trimLineProtocol = (lineProtocol: string): string => trim(trim(lineProtocol), `\n`)

  return {
    parseLine,
    convertArrToMap,
    trimLineProtocol,
    escape,
    escapeFieldValue,
    unescape,
    unescapeFieldValue,
  }
}
