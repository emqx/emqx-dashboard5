import { getLabelFromValueInOptionList } from '@/common/tools'
import { SchemaRegistryType } from '@/types/enum'

export default (): {
  schemaTypeOpts: {
    label: string
    value: SchemaRegistryType
  }[]
  getLabelByValue: (value: SchemaRegistryType) => string
} => {
  const schemaTypeOpts: Array<{ label: string; value: SchemaRegistryType }> = [
    { label: 'Avro', value: SchemaRegistryType.Avro },
    { label: 'Protobuf', value: SchemaRegistryType.Protobuf },
  ]

  const getLabelByValue = (value: SchemaRegistryType) =>
    getLabelFromValueInOptionList(value, schemaTypeOpts)

  return { schemaTypeOpts, getLabelByValue }
}
