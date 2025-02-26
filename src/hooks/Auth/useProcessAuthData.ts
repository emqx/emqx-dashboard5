import { ElMessage as M } from 'element-plus'
import { parseJSONSafely } from '@emqx/shared-ui-utils'
import { LDAPAuthMethod } from '@/types/enum'
//

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useProcessAuthData() {
  const createResourceOpt = () => ({
    // resource_opts: {
    //   auto_restart_interval: AUTO_RESTART_INTERVAL_DEFAULT,
    // },
  })

  const parseJSONSelectively = (data: string | Record<string, any>) =>
    typeof data === 'string' ? parseJSONSafely(data) : data

  const processHttpConfig = (data: any) => {
    try {
      const tempData = cloneDeep(data)
      const { body } = data
      if (body !== '' && body !== undefined) {
        tempData.body = parseJSONSelectively(body)
      } else {
        tempData.body = undefined
      }
      return tempData
    } catch (error: any) {
      M.error(error.toString())
    }
  }
  const processRedisConfig = (data: any) => {
    const tempData = cloneDeep(data)
    const { redis_type } = data
    if (redis_type !== 'sentinel') {
      delete tempData.sentinel
    }
    if (redis_type !== 'single') {
      delete tempData.server
    } else {
      delete tempData.servers
    }
    if (redis_type === 'cluster') {
      delete tempData.database
    }
    return tempData
  }
  const processMongoDBConfig = (data: any) => {
    try {
      let tempData = cloneDeep(data)
      const { mongo_type, filter } = data
      const needDeleteFields = []
      if (mongo_type !== 'single') {
        needDeleteFields.push('server')
      } else {
        needDeleteFields.push('servers')
      }
      if (mongo_type !== 'rs') {
        needDeleteFields.push('w_mode', 'r_mode', 'replica_set_name')
      }
      tempData = omit(tempData, needDeleteFields)
      if (filter !== '' && filter !== undefined) {
        tempData.filter = parseJSONSelectively(filter)
      } else {
        tempData.filter = undefined
      }
      return tempData
    } catch (error: any) {
      M.error(error.toString())
    }
  }
  const processLDAPConfig = (data: any) => {
    const { method } = data
    if (method.type === LDAPAuthMethod.Hash) {
      data.method = omit(method, 'bind_password')
    } else if (method.type === LDAPAuthMethod.Bind) {
      data.method = omit(method, ['password_attribute', 'is_superuser_attribute'])
    }
    return data
  }
  const processJwtConfig = (data: any) => {
    const {
      enable,
      from,
      use_jwks,
      algorithm,
      secret,
      secret_base64_encoded,
      public_key,
      endpoint,
      refresh_interval,
      verify_claims,
      ssl,
      disconnect_after_expire,
      headers,
    } = data
    let tempData: any = {
      enable,
      from,
      use_jwks,
      verify_claims,
      disconnect_after_expire,
    }
    if (use_jwks) {
      tempData = {
        ...tempData,
        endpoint,
        refresh_interval,
        ssl,
        headers,
      }
    } else {
      tempData = { ...tempData, algorithm }
      if (algorithm === 'hmac-based') {
        tempData = { ...tempData, secret, secret_base64_encoded }
      } else if (algorithm === 'public-key') {
        tempData = { ...tempData, public_key }
      }
    }
    return tempData
  }
  const processPasswordHashAlgorithmData = (data: any) => {
    const ret = cloneDeep(data)
    const isBuiltInDatabase = data.backend === 'built_in_database'
    if ('password_hash_algorithm' in ret) {
      ret.password_hash_algorithm = getUsefulPasswordHashAlgorithmData(
        ret.password_hash_algorithm,
        isBuiltInDatabase,
      )
    }
    return ret
  }

  return {
    createResourceOpt,
    processHttpConfig,
    processMongoDBConfig,
    processLDAPConfig,
    processRedisConfig,
    processJwtConfig,
    processPasswordHashAlgorithmData,
  }
}
