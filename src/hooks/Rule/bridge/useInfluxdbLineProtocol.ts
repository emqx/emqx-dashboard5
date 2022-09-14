interface KeyValueItem {
  key: string
  value: string
}

interface ParseResult {
  measurement: string
  tagArr: Array<KeyValueItem>
  fieldArr: Array<KeyValueItem>
  timestamp: number | undefined
}

export default (): {
  parseLine: (line: string) => ParseResult | undefined
  convertArrToMap: (arr: Array<KeyValueItem>) => Record<string, string>
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

  const measurementReg = /[^,]+/
  // TODO:Consider the case of spaces or commas inside string value
  const tagItemReg = /(?<tagKey>[^\s,]+)=(?<tagValue>[^\s,]+)/
  const tagPartReg = new RegExp(`(${tagItemReg.source},?)+`)
  const fieldItemReg = /(?<fieldKey>[^\s,]+)((?<!\/)=)(?<fieldValue>[^\s,]+)/
  const fieldsPartReg = new RegExp(`(${fieldItemReg.source},?)+`)
  const timestampPart = /\d+/

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
      const { measurement, tags, fields, timestamp: t } = matchRet.groups
      const tagArr = getTags(tags)
      const fieldArr = getFields(fields)
      const timestamp = t && !Number.isNaN(Number(t)) ? Number(t) : undefined
      return { measurement, tagArr, fieldArr, timestamp }
    }
    return
  }

  const convertArrToMap = (arr: Array<KeyValueItem>) => {
    return arr.reduce((map, item) => {
      return { ...map, [item.key]: item.value }
    }, {})
  }

  return {
    parseLine,
    convertArrToMap,
  }
}
