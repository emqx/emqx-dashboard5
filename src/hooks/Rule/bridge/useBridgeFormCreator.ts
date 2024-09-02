import useResourceOpt from '@/hooks/Rule/bridge/useResourceOpt'
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'

export default (): {
  createRawInfluxDBForm: () => OtherBridge
  createRawDataLayersForm: () => OtherBridge
} => {
  const { createDefaultResourceOptsForm } = useResourceOpt()

  const createRawInfluxDBForm = () => ({
    type: BridgeType.InfluxDB,
    name: '',
    connector: '',
    parameters: {
      write_syntax: '',
      precision: 'ms',
    },
    resource_opts: createDefaultResourceOptsForm({
      inflight: true,
      batch: true,
      withoutRequestTimeout: false,
      withoutStartTimeout: true,
    }),
  })

  const createRawDataLayersForm = () => ({
    ...createRawInfluxDBForm(),
    type: BridgeType.Datalayers,
  })

  return {
    createRawInfluxDBForm,
    createRawDataLayersForm,
  }
}
