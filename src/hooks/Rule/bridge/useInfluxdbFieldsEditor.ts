export enum FieldValueType {
  Float,
  Integer,
  UInteger,
  String,
  Boolean,
  Placeholder,
}

const STRING_REGEX = /^".*"$/
const BOOL_REGEX = /^((t|true)|(f|false))$/i
const INT_REGEX = /^\d+i$/
const U_INT_REGEX = /^\d+u$/
const NUMBER_REGEX = /\d+(\.\d+)?/
const SCIENTIFIC_NOTATION_REGEX = new RegExp(`${NUMBER_REGEX.source}e(\\+|-)\\d+`)
const FLOAT_REGEX = new RegExp(`^${SCIENTIFIC_NOTATION_REGEX.source}|${NUMBER_REGEX.source}$`)
const PLACEHOLDER_REGEX = /.+/
const typeRegexMap: Record<FieldValueType, RegExp> = {
  [FieldValueType.String]: STRING_REGEX,
  [FieldValueType.Integer]: INT_REGEX,
  [FieldValueType.UInteger]: U_INT_REGEX,
  [FieldValueType.Boolean]: BOOL_REGEX,
  [FieldValueType.Float]: FLOAT_REGEX,
  [FieldValueType.Placeholder]: PLACEHOLDER_REGEX,
}

export default () => {
  const typeRegexMapKeys: Array<FieldValueType> = Object.keys(typeRegexMap).map((key) =>
    Number(key),
  )

  const judgeFieldValueType = (str: string) => {
    const ret = typeRegexMapKeys.find((type: FieldValueType) => {
      return typeRegexMap[type].test(str)
    })
    return ret ?? undefined
  }

  const convertToRawValueByType = (valueInProtocolLine: string, type: FieldValueType) => {
    switch (type) {
      case FieldValueType.String:
        if (STRING_REGEX.test(valueInProtocolLine)) {
          return valueInProtocolLine.slice(1, -1)
        }
        break
      case FieldValueType.Integer:
        if (INT_REGEX.test(valueInProtocolLine)) {
          return valueInProtocolLine.slice(0, -1)
        }
        break
      case FieldValueType.UInteger:
        if (U_INT_REGEX.test(valueInProtocolLine)) {
          return valueInProtocolLine.slice(0, -1)
        }
        break
      case FieldValueType.Boolean:
        if (BOOL_REGEX.test(valueInProtocolLine)) {
          return valueInProtocolLine[0].toLocaleLowerCase() === 't' ? true : false
        }
        break
    }
    // float and others, return value directly
    return valueInProtocolLine
  }

  /**
   * convert raw value to value in line protocol
   */
  const handleValueByType = (value: string | boolean, type: FieldValueType) => {
    switch (type) {
      case FieldValueType.String:
        return `"${value}"`
      case FieldValueType.Integer:
        if (Number.isNaN(Number(value))) {
          throw new Error()
        }
        return `${value}i`
      case FieldValueType.UInteger:
        if (Number.isNaN(Number(value))) {
          throw new Error()
        }
        return `${value}u`
      case FieldValueType.Boolean:
        return value
      case FieldValueType.Float:
        return value
      default:
        return value
    }
  }

  return {
    judgeFieldValueType,
    convertToRawValueByType,
    handleValueByType,
  }
}
