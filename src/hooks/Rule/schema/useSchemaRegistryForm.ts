import { HTTP_POST_DEFAULT_HEADERS } from '@/common/constants'
import { SchemaRegistryType } from '@/types/enum'
import {
  NormalSchemaRegistry,
  SchemaRegistry,
  SchemaRegistryDetail,
  SchemaRegistryExternalHttpParameters,
} from '@/types/rule'
import { SchemaRegistryExternalHttp } from '@/types/typeAlias'

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

  const createFormForCreatePage = () => ({
    ...createRawExternalHttpForm(),
    // the default type is avro
    ...createRawNormalForm(),
  })

  const handleFormDataForCreate = (
    formData: SchemaRegistry | SchemaRegistryDetail,
  ): SchemaRegistry => {
    const { name, type, description, source } = formData as any
    if (formData.type === SchemaRegistryType.ExternalHTTP) {
      return checkNOmitFromObj(
        pick(formData, ['name', 'type', 'description', 'parameters']),
      ) as SchemaRegistryExternalHttp
    }
    return { name, type, description, source }
  }

  const handleFormDataForUpdate = (
    formData: SchemaRegistryDetail,
  ): Omit<SchemaRegistry, 'name'> => {
    const ret = handleFormDataForCreate(formData)
    return omit(ret, 'name')
  }

  return {
    createRawNormalForm,
    createRawExternalHttpForm,
    createFormForCreatePage,
    handleFormDataForCreate,
    handleFormDataForUpdate,
  }
}
