import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'

export default (): {
  createRawInfluxDBForm: () => OtherBridge
  createRawDataLayersForm: () => OtherBridge
  createRawAWSTimestreamForm: () => OtherBridge
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
    fallback_actions: [],
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

  const createRawAWSTimestreamForm = () => ({
    ...createRawInfluxDBForm(),
    type: BridgeType.AWSTimestream,
  })

  return {
    createRawInfluxDBForm,
    createRawDataLayersForm,
    createRawAWSTimestreamForm,
  }
}
