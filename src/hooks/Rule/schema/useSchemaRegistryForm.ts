import { ProtobufCreationMethod, SchemaRegistryType } from '@/types/enum'
import {
  NormalSchemaRegistry,
  SchemaRegistry,
  SchemaRegistryCreationForm,
  SchemaRegistryDetail,
  SchemaRegistryExternalHttpParameters,
} from '@/types/rule'
import {
  ProtobufBundleSourceType,
  SchemaRegistryExternalHttp,
  SchemaRegistryProtobufBundle,
} from '@/types/typeAlias'

export default () => {
  const createRawNormalForm = (): NormalSchemaRegistry => ({
    name: '',
    description: '',
    type: SchemaRegistryType.Avro,
    source: '',
  })

  const { createSSLForm } = useSSL()
  const createRawExternalHttpParams = () =>
    ({
      url: '',
      headers: {},
      max_retries: 2,
      request_timeout: '10s',
      external_params: '',
      connect_timeout: '15s',
      pool_type: 'random',
      pool_size: 8,
      enable_pipelining: 100,
      max_inactive: '10s',
      ssl: createSSLForm(),
    }) as SchemaRegistryExternalHttpParameters

  const createRawExternalHttpForm = (): SchemaRegistryExternalHttp => ({
    name: '',
    description: '',
    type: SchemaRegistryType.ExternalHTTP,
    parameters: createRawExternalHttpParams(),
  })

  const createRawProtobufBundleForm = (): SchemaRegistryProtobufBundle => ({
    bundle: undefined,
    root_proto_file: '',
  })

  const createFormForCreatePage = (): SchemaRegistryCreationForm => ({
    ...createRawExternalHttpForm(),
    // the default type is avro
    ...createRawNormalForm(),
    ...createRawProtobufBundleForm(),
    protobuf_creation_method: ProtobufCreationMethod.Input,
  })

  const handleFormDataForCreate = (formData: SchemaRegistryCreationForm): SchemaRegistry => {
    const {
      name: n,
      type,
      description: d,
      parameters,
      bundle,
      root_proto_file,
      protobuf_creation_method,
      source,
    } = formData
    const name = n as string
    const description = d as string
    if (type === SchemaRegistryType.ExternalHTTP) {
      return { name, type, description, parameters }
    } else if (protobuf_creation_method === ProtobufCreationMethod.UploadBundle) {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('bundle', bundle as unknown as Blob)
      formData.append('root_proto_file', root_proto_file as string)
      return formData as unknown as SchemaRegistry
    }
    return { name, type, description, source }
  }

  const handleDataForViewDetail = (data) => {
    if (data.source.type === ProtobufBundleSourceType.bundle) {
      return {
        ...data,
        protobuf_creation_method: ProtobufCreationMethod.UploadBundle,
        bundle: undefined,
        root_proto_file: data.source.root_proto_path,
      }
    }
    return {
      ...data,
      protobuf_creation_method: ProtobufCreationMethod.Input,
    }
  }

  const isProtobufBundleData = (data) => data instanceof FormData

  const handleFormDataForUpdate = (
    formData: SchemaRegistryDetail,
  ): Omit<SchemaRegistry, 'name'> => {
    const ret = handleFormDataForCreate(formData)
    return isProtobufBundleData(ret) ? ret : omit(ret, 'name')
  }

  return {
    createRawNormalForm,
    createRawExternalHttpForm,
    createFormForCreatePage,
    handleFormDataForCreate,
    handleDataForViewDetail,
    handleFormDataForUpdate,
    isProtobufBundleData,
  }
}
