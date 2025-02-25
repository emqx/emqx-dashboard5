import { ExternalSchemaType } from '@/types/typeAlias'

type ExternalSchemaTypeValue = (typeof ExternalSchemaType)[keyof typeof ExternalSchemaType]

export default (): {
  schemaTypeOpts: {
    label: string
    value: ExternalSchemaTypeValue
  }[]
  getLabelByValue: (value: ExternalSchemaTypeValue) => string
} => {
  const schemaTypeOpts: Array<{ label: string; value: ExternalSchemaTypeValue }> = [
    { label: 'Confluent', value: ExternalSchemaType.Confluent },
  ]

  const getLabelByValue = (value: ExternalSchemaTypeValue) =>
    getLabelFromValueInOptionList(value, schemaTypeOpts)

  return { schemaTypeOpts, getLabelByValue }
}
