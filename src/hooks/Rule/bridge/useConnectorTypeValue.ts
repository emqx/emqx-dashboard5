import { OptionList } from '@/types/common'
import { ConnectorType } from '@/types/enum'

export default (): {
  connectorTypeOptions: OptionList<ConnectorType>
  getConnectorLabelByValue: (val: ConnectorType) => string
} => {
  const connectorTypeOptions: OptionList<ConnectorType> = [
    { value: ConnectorType.MQTT, label: 'MQTT' },
  ]

  const getConnectorLabelByValue = (val: ConnectorType): string =>
    connectorTypeOptions.find(({ value }) => value === val)?.label || ''

  return { connectorTypeOptions, getConnectorLabelByValue }
}
