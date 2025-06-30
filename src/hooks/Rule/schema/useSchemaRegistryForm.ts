import { ProtobufCreationMethod, SchemaRegistryType } from '@/types/enum'
import { HTTP_POST_DEFAULT_HEADERS } from '@/common/constants'
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
      headers: HTTP_POST_DEFAULT_HEADERS,
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

  /**
   *
   * If the bundle has a value, use FormData; if the bundle has no value (update), use json.
   */
  const createProtobufBundlePayload = ({
    name = '',
    description = '',
    bundle,
    root_proto_file = '',
  }: SchemaRegistryProtobufBundle): FormData | SchemaRegistryProtobufBundle => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (bundle) {
      formData.append('bundle', bundle as Blob)
    }
    formData.append('root_proto_file', root_proto_file)
    return formData
  }

  const handleFormDataForCreate = (
    formData: SchemaRegistryCreationForm | SchemaRegistryEditForm,
  ): SchemaRegistryCreateData => {
    const {
      name: n,
      type,
      description: d,
      bundle,
      root_proto_file,
      source,
      protobuf_creation_method,
    } = formData as any
    const name = n as string
    const description = d as string
    if (type === SchemaRegistryType.ExternalHTTP) {
      return checkNOmitFromObj(
        pick(formData, ['name', 'type', 'description', 'parameters']),
      ) as SchemaRegistryExternalHttp
    }
    if (protobuf_creation_method === ProtobufCreationMethod.UploadBundle) {
      return createProtobufBundlePayload({ name, description, bundle, root_proto_file })
    }
    return { name, type, description, source }
  }

  const fileNameReg = /^(?<path>.+)\/(?<name>[^/]+)$/
  const getPathAndRootFile = (root_proto_path: string): { path: string; name: string } | string => {
    if (!root_proto_path || typeof root_proto_path !== 'string') {
      return root_proto_path
    }
    const matchResult = root_proto_path.match(fileNameReg)
    if (!matchResult || !matchResult.groups) {
      return root_proto_path
    }
    return { path: matchResult.groups.path, name: matchResult.groups.name }
  }

  const handleDataForViewDetail = (data: SchemaRegistryDetail): SchemaRegistryEditForm => {
    if (
      data.type === SchemaRegistryType.Protobuf &&
      typeof data.source === 'object' &&
      data.source.type === ProtobufBundleSourceType.bundle
    ) {
      const bundleInfo = getPathAndRootFile(data.source.root_proto_path ?? '')
      const name = typeof bundleInfo === 'object' ? bundleInfo.name : data.source.root_proto_path
      return {
        ...data,
        protobuf_creation_method: ProtobufCreationMethod.UploadBundle,
        bundle: undefined,
        root_proto_file: name,
        root_proto_path: data.source.root_proto_path,
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
    getPathAndRootFile,
    handleFormDataForUpdate,
    isProtobufBundleDetail,
    isProtobufBundleData,
  }
}
