import { ElMessage as M } from 'element-plus'
import _ from 'lodash'
import { getUsefulPasswordHashAlgorithmData } from './usePasswordHashAlgorithmData'
import { parseJSONSafely } from '@/common/tools'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useProcessAuthData() {
  const processHttpConfig = (data: any) => {
    try {
      const tempData = _.cloneDeep(data)
      const { body } = data
      if (body !== '' && body !== undefined) {
        tempData.body = parseJSONSafely(body)
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
    return tempData
  }
  const processMongoDBConfig = (data: any) => {
    try {
      let tempData = _.cloneDeep(data)
      const { mongo_type, selector } = data
      const needDeleteFields = []
      if (mongo_type !== 'single') {
        needDeleteFields.push('server')
      } else {
        needDeleteFields.push('servers', 'replica_set_name')
      }
      if (mongo_type !== 'rs') {
        needDeleteFields.push('w_mode', 'r_mode')
      }
      tempData = _.omit(tempData, needDeleteFields)
      if (selector !== '' && selector !== undefined) {
        tempData.selector = parseJSONSafely(selector)
      } else {
        tempData.selector = undefined
      }
      return tempData
    } catch (error: any) {
      M.error(error.toString())
    }
  }
  const processJwtConfig = (data: any) => {
    const {
      use_jwks,
      algorithm,
      secret,
      secret_base64_encoded,
      certificate,
      endpoint,
      refresh_interval,
      verify_claims,
    } = data
    const tempData: any = {
      use_jwks,
      verify_claims,
    }
    if (use_jwks) {
      tempData.endpoint = endpoint
      tempData.refresh_interval = refresh_interval
    } else {
      tempData.algorithm = algorithm
      if (algorithm === 'hmac-based') {
        tempData.secret = secret
        tempData.secret_base64_encoded = secret_base64_encoded
      } else if (algorithm === 'public-key') {
        tempData.certificate = certificate
      }
    }
    return tempData
  }
  const processPasswordHashAlgorithmData = (data: any) => {
    const ret = _.cloneDeep(data)
    if ('password_hash_algorithm' in ret) {
      ret.password_hash_algorithm = getUsefulPasswordHashAlgorithmData(ret.password_hash_algorithm)
    }
    return ret
  }

  return {
    processHttpConfig,
    processMongoDBConfig,
    processRedisConfig,
    processJwtConfig,
    processPasswordHashAlgorithmData,
  }
}
