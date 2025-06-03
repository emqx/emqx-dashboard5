import { ProtobufCreationMethod, SchemaRegistryType } from '@/types/enum'
import {
  NormalSchemaRegistry,
  SchemaRegistryCreateData,
  SchemaRegistryCreationForm,
  SchemaRegistryEditForm,
  SchemaRegistryExternalHttpParameters,
  SchemaRegistryUpdateData,
} from '@/types/rule'
import {
  ProtobufBundleSourceType,
  SchemaRegistryDetail,
  SchemaRegistryExternalHttp,
  SchemaRegistryProtobufBundle,
  SchemaRegistryProtobufDetail,
} from '@/types/typeAlias'
import { UploadRawFile } from 'element-plus'
import { Merge } from 'type-fest'

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

  const createRawProtobufBundleForm = (): Merge<
    SchemaRegistryProtobufBundle,
    { bundle?: UploadRawFile }
  > => ({
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

  const handleFormDataForCreate = (
    formData: SchemaRegistryCreationForm | SchemaRegistryEditForm,
  ): SchemaRegistryCreateData => {
    const {
      name: n,
      type,
      description: d,
      bundle,
      root_proto_file,
      protobuf_creation_method,
    } = formData as any
    const name = n as string
    const description = d as string
    if (type === SchemaRegistryType.ExternalHTTP) {
      return checkNOmitFromObj(
        pick(formData, ['name', 'type', 'description', 'parameters']),
      ) as SchemaRegistryExternalHttp
    } else if (protobuf_creation_method === ProtobufCreationMethod.UploadBundle) {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('bundle', bundle as unknown as Blob)
      formData.append('root_proto_file', root_proto_file as string)
      return formData
    }
    return omit({ ...formData }, ['parameters']) as NormalSchemaRegistry
  }

  const handleDataForViewDetail = (data: SchemaRegistryDetail): SchemaRegistryEditForm => {
    if (
      data.type === SchemaRegistryType.Protobuf &&
      typeof data.source === 'object' &&
      data.source.type === ProtobufBundleSourceType.bundle
    ) {
      return {
        ...data,
        protobuf_creation_method: ProtobufCreationMethod.UploadBundle,
        bundle: undefined,
        root_proto_file: data.source.root_proto_path,
      }
    }
    return data as Exclude<SchemaRegistryDetail, SchemaRegistryProtobufDetail>
  }

  const isProtobufBundleDetail = (data: SchemaRegistryDetail): boolean =>
    data.type === SchemaRegistryType.Protobuf &&
    typeof data.source === 'object' &&
    data.source.type === ProtobufBundleSourceType.bundle

  const isProtobufBundleData = (data: SchemaRegistryCreateData): data is FormData =>
    data instanceof FormData

  const handleFormDataForUpdate = (formData: SchemaRegistryEditForm): SchemaRegistryUpdateData => {
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
    isProtobufBundleDetail,
    isProtobufBundleData,
  }
}
