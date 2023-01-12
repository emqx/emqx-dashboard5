import { ElMessage as M } from 'element-plus'
import _ from 'lodash'
import { getUsefulPasswordHashAlgorithmData } from './usePasswordHashAlgorithmData'
import { parseJSONSafely } from '@/common/tools'
import { AUTO_RESTART_INTERVAL_DEFAULT } from '@/common/constants'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useProcessAuthData() {
  const createResourceOpt = () => ({
    resource_opts: {
      auto_restart_interval: AUTO_RESTART_INTERVAL_DEFAULT,
    },
  })

  const parseJSONSelectively = (data: string | Record<string, any>) =>
    typeof data === 'string' ? parseJSONSafely(data) : data

  const processHttpConfig = (data: any) => {
    try {
      const tempData = _.cloneDeep(data)
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
    const tempData = _.cloneDeep(data)
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
      let tempData = _.cloneDeep(data)
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
      tempData = _.omit(tempData, needDeleteFields)
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
    } = data
    let tempData: any = {
      enable,
      from,
      use_jwks,
      verify_claims,
    }
    if (use_jwks) {
      tempData = {
        ...tempData,
        endpoint,
        refresh_interval,
        ssl,
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
    const ret = _.cloneDeep(data)
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
    processRedisConfig,
    processJwtConfig,
    processPasswordHashAlgorithmData,
  }
}
