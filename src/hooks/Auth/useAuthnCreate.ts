import _ from 'lodash'
import useProcessAuthData from './useProcessAuthData'
import { getPasswordHashAlgorithmObj } from './usePasswordHashAlgorithmData'
import useSSL from '@/hooks/useSSL'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useAuthnCreate() {
  const { createSSLForm, handleSSLDataBeforeSubmit } = useSSL()
  const getBuiltInConfig = (type: string) => {
    if (type === 'password_based') {
      return {
        user_id_type: 'username',
        ...getPasswordHashAlgorithmObj(),
      }
    } else if (type === 'scram') {
      return {
        algorithm: 'sha256',
      }
    }
  }
  const getHttpConfig = () => {
    return {
      method: 'post',
      url: 'http://127.0.0.1:8080',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(
        {
          username: '${username}',
          password: '${password}',
        },
        null,
        2,
      ),
      pool_size: 8,
      connect_timeout: '5s',
      request_timeout: '5s',
      enable_pipelining: true,
      ssl: createSSLForm(),
    }
  }
  const getDatabaseConfig = (backend: string) => {
    const data: any = {
      server: '',
      username: 'root',
      password: '',
      database: '',
      pool_size: 8,
      auto_reconnect: true,
      ssl: createSSLForm(),
      query: '',
      ...getPasswordHashAlgorithmObj(),
    }
    if (backend === 'mysql') {
      data.query_timeout = '5s'
    }
    return data
  }
  const getRedisConfig = () => {
    return {
      server: '127.0.0.1:6379',
      servers: '127.0.0.1:6379,127.0.0.2:6379,127.0.0.3:6379',
      sentinel: 'mysentinel',
      redis_type: 'single',
      database: 0,
      auto_reconnect: true,
      password: '',
      ...getPasswordHashAlgorithmObj(),
      pool_size: 8,
      cmd: '',
      ssl: createSSLForm(),
    }
  }
  const getMongodbConfig = () => {
    return {
      mongo_type: 'single',
      server: '127.0.0.1:27017',
      servers: '127.0.0.1:27017,127.0.0.2:27017',
      database: 'mqtt',
      collection: 'users',
      selector: '',
      password_hash_field: 'password_hash',
      salt_field: 'salt',
      r_mode: 'master',
      w_mode: 'safe',
      ...getPasswordHashAlgorithmObj(),
      pool_size: 8,
      ssl: createSSLForm(),
      topology: {
        connect_timeout_ms: '20s',
      },
    }
  }
  const getJwtConfig = () => {
    return {
      use_jwks: false,
      algorithm: 'hmac-based',
      secret: 'emqxsecret',
      secret_base64_encoded: false,
      endpoint: 'http://127.0.0.1:8080',
      refresh_interval: 300,
      verify_claims: {},
    }
  }
  const {
    processHttpConfig,
    processMongoDBConfig,
    processRedisConfig,
    processJwtConfig,
    processPasswordHashAlgorithmData,
  } = useProcessAuthData()
  const factory = (mechanism: string, backend: string) => {
    switch (mechanism) {
      case 'password_based':
        if (backend === 'http') {
          return getHttpConfig()
        } else if (backend === 'built_in_database') {
          return getBuiltInConfig('password_based')
        } else if (backend === 'mysql' || backend === 'postgresql') {
          return getDatabaseConfig(backend)
        } else if (backend === 'redis') {
          return getRedisConfig()
        } else if (backend === 'mongodb') {
          return getMongodbConfig()
        }
        break
      case 'scram':
        if (backend === 'built_in_database') {
          return getBuiltInConfig('scram')
        }
        break
      case 'jwt':
        return getJwtConfig()
    }
  }
  const create = (config: any, backend: string, mechanism: string) => {
    let data: any = {}
    if (mechanism === 'jwt') {
      data = processJwtConfig(config)
    } else {
      switch (backend) {
        case 'http':
          data = processHttpConfig(config)
          break
        case 'redis':
          data = processRedisConfig(config)
          break
        case 'mongodb':
          data = processMongoDBConfig(config)
          break
        default:
          data = _.cloneDeep(config)
          break
      }
      data.backend = backend
    }
    data.mechanism = mechanism
    data = processPasswordHashAlgorithmData(data)
    if (data.ssl && typeof data.ssl === 'object') {
      data.ssl = handleSSLDataBeforeSubmit(data.ssl)
    }
    return data
  }
  return {
    factory,
    create,
  }
}
