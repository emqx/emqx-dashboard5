import useI18nTl from '@/hooks/useI18nTl'

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
const INT_REGEX = /^-?\d+i$/
const U_INT_REGEX = /^\d+u$/
const NUMBER_REGEX = /-?\d+(\.\d+)?/
const SCIENTIFIC_NOTATION_REGEX = new RegExp(`${NUMBER_REGEX.source}e(\\+|-)\\d+`)
const FLOAT_REGEX = new RegExp(`^${SCIENTIFIC_NOTATION_REGEX.source}|${NUMBER_REGEX.source}$`)
const PLACEHOLDER_REGEX = /.*\$\{.+\}.*/
const VALUE_WITH_TYPE_REGEX = new RegExp(`^(\\d+|${NUMBER_REGEX.source}|\\$\\{.+\\})(i|u)$`)
const typeRegexMap: Record<FieldValueType, RegExp> = {
  [FieldValueType.String]: STRING_REGEX,
  [FieldValueType.Integer]: INT_REGEX,
  [FieldValueType.UInteger]: U_INT_REGEX,
  [FieldValueType.Float]: FLOAT_REGEX,
  [FieldValueType.Boolean]: BOOL_REGEX,
  [FieldValueType.Placeholder]: PLACEHOLDER_REGEX,
}

export default () => {
  const { t, tl } = useI18nTl('RuleEngine')

  const typeRegexMapKeys: Array<FieldValueType> = Object.keys(typeRegexMap).map((key) =>
    Number(key),
  )

  /**
   * value in the line protocol that have not been processed
   */
  const judgeFieldValueType = (str: string) => {
    const ret = typeRegexMapKeys.find((type: FieldValueType) => {
      return typeRegexMap[type].test(str)
    })
    return ret ?? undefined
  }

  /**
   * value in the input of field value when editing in json mode
   */
  const typesDoNotNeedHandle = [
    FieldValueType.Integer,
    FieldValueType.UInteger,
    FieldValueType.Float,
    FieldValueType.Boolean,
    FieldValueType.Placeholder,
  ]
  const judgeValueInInput = (str: string) => {
    const type = typesDoNotNeedHandle.find((typeName) => typeRegexMap[typeName].test(str))
    if (typesDoNotNeedHandle.some((type) => typeRegexMap[type].test(str))) {
      return str
    }
    return type ? type : FieldValueType.String
  }

  const explicitlySpecifyTypeInValue = (
    value: string,
  ): boolean | FieldValueType.Integer | FieldValueType.UInteger => {
    const withType = VALUE_WITH_TYPE_REGEX.test(value)
    if (!withType) {
      return withType
    }
    return /i/i.test(value.slice(-1)) ? FieldValueType.Integer : FieldValueType.UInteger
  }

  const typeLabelMap = {
    [FieldValueType.Integer]: tl('integer'),
    [FieldValueType.UInteger]: tl('uInteger'),
  }
  const getTypeLabel = (type: FieldValueType.Integer | FieldValueType.UInteger) => {
    return typeLabelMap[type] || ''
  }

  return {
    judgeFieldValueType,
    judgeValueInInput,
    explicitlySpecifyTypeInValue,
    getTypeLabel,
  }
}
