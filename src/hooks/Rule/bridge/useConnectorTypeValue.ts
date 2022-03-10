import { ConnectorType } from '@/types/enum'

export default () => {
  const connectorTypeOptions = [{ value: ConnectorType.MQTT, label: 'MQTT' }]

  const getConnectorLabelByValue = (val: ConnectorType): string =>
    connectorTypeOptions.find(({ value }) => value === val)?.label || ''

  return { connectorTypeOptions, getConnectorLabelByValue }
}
