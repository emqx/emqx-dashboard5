import _ from 'lodash'
import useProcessAuthData from './useProcessAuthData'

export default function useAuthnCreate() {
  const getBuiltInConfig = (type) => {
    if (type === 'password-based') {
      return {
        user_id_type: 'username',
        password_hash_algorithm: {
          name: 'sha256',
        },
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
        '',
        2,
      ),
      pool_size: 8,
      connect_timeout: '5s',
      request_timeout: '5s',
      enable_pipelining: true,
      ssl: {
        enable: false,
      },
    }
  }
  const getDatabaseConfig = (backend) => {
    const data = {
      server: '',
      username: 'root',
      password: '',
      database: '',
      pool_size: 8,
      auto_reconnect: true,
      ssl: {
        enable: false,
      },
      query: '',
      password_hash_algorithm: 'sha256',
      salt_position: 'prefix',
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
      salt_position: 'prefix',
      redis_type: 'single',
      database: 0,
      auto_reconnect: true,
      password: '',
      password_hash_algorithm: 'sha256',
      pool_size: 8,
      query: '',
      ssl: {
        enable: false,
      },
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
      password_hash_algorithm: 'sha256',
      salt_position: 'prefix',
      pool_size: 8,
      ssl: {
        enable: false,
      },
      topology: {
        connect_timeout_ms: 20000,
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
  const { processHttpConfig, processMongoDBConfig, processRedisConfig, processJwtConfig } =
    useProcessAuthData()
  const factory = (mechanism, backend) => {
    switch (mechanism) {
      case 'password-based':
        if (backend === 'http') {
          return getHttpConfig()
        } else if (backend === 'built-in-database') {
          return getBuiltInConfig('password-based')
        } else if (backend === 'mysql' || backend === 'postgresql') {
          return getDatabaseConfig(backend)
        } else if (backend === 'redis') {
          return getRedisConfig()
        } else if (backend === 'mongodb') {
          return getMongodbConfig()
        }
        break
      case 'scram':
        if (backend === 'built-in-database') {
          return getBuiltInConfig('scram')
        }
        break
      case 'jwt':
        return getJwtConfig()
    }
  }
  const create = (config, backend, mechanism) => {
    let data = {}
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
    return data
  }
  return {
    factory,
    create,
  }
}
