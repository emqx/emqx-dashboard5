import { ConnectorType } from '@/types/enum'

export default () => {
  const connectorTypeOptions = [{ value: ConnectorType.MQTT, label: 'MQTT' }]

  return { connectorTypeOptions }
}
