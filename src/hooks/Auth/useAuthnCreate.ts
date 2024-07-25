import useSSL from '@/hooks/useSSL'
import _ from 'lodash'
import { getPasswordHashAlgorithmObj } from './usePasswordHashAlgorithmData'
import useProcessAuthData from './useProcessAuthData'
import { LDAPAuthMethod } from '@/types/enum'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useAuthnCreate() {
  const { createSSLForm, handleSSLDataBeforeSubmit } = useSSL()
  const {
    createResourceOpt,
    processHttpConfig,
    processMongoDBConfig,
    processLDAPConfig,
    processRedisConfig,
    processJwtConfig,
    processPasswordHashAlgorithmData,
  } = useProcessAuthData()

  const getBuiltInConfig = (type: string) => {
    if (type === 'password_based') {
      return {
        user_id_type: 'username',
        ...getPasswordHashAlgorithmObj(),
      }
    } else if (type === 'scram') {
      return {
        algorithm: 'sha256',
        iteration_count: 4096,
      }
    }
  }
  const getHttpConfig = (type: 'password_based' | 'scram') => {
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
      connect_timeout: '15s',
      request_timeout: '5s',
      enable_pipelining: 100,
      ssl: createSSLForm(),
      ...(type === 'scram'
        ? {
            algorithm: 'sha256',
            iteration_count: 4096,
          }
        : {}),
    }
  }
  const getDatabaseConfig = (backend: string) => {
    const data: any = {
      server: '',
      username: 'root',
      password: '',
      database: '',
      pool_size: 8,
      ssl: createSSLForm(),
      query: '',
      ...getPasswordHashAlgorithmObj(),
      ...createResourceOpt(),
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
      password: '',
      ...getPasswordHashAlgorithmObj(),
      pool_size: 8,
      cmd: '',
      ssl: createSSLForm(),
      ...createResourceOpt(),
    }
  }
  const getMongodbConfig = () => {
    return {
      mongo_type: 'single',
      srv_record: false,
      server: '127.0.0.1:27017',
      servers: '127.0.0.1:27017,127.0.0.2:27017',
      database: 'mqtt',
      collection: 'users',
      filter: '',
      password_hash_field: 'password_hash',
      salt_field: 'salt',
      r_mode: 'master',
      w_mode: 'unsafe',
      use_legacy_protocol: 'auto',
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
      from: 'password',
      use_jwks: false,
      algorithm: 'hmac-based',
      secret: 'emqxsecret',
      secret_base64_encoded: false,
      disconnect_after_expire: true,
      endpoint: 'http://127.0.0.1:8080',
      refresh_interval: 300,
      verify_claims: {},
      ssl: createSSLForm(),
      headers: {
        Accept: 'application/json',
      },
    }
  }

  const getLdapConfig = () => {
    return {
      query_timeout: '5s',
      enable: true,
      server: 'localhost:389',
      pool_size: 8,
      username: '',
      password: '',
      base_dn: '',
      filter: '(& (objectClass=mqttUser) (uid=${username}))',
      ssl: createSSLForm(),
      method: {
        type: LDAPAuthMethod.Hash,
        bind_password: '${password}',
        password_attribute: 'userPassword',
        is_superuser_attribute: 'isSuperuser',
      },
    }
  }

  const factory = (mechanism: string, backend: string) => {
    switch (mechanism) {
      case 'password_based':
        if (backend === 'http') {
          return getHttpConfig('password_based')
        } else if (backend === 'built_in_database') {
          return getBuiltInConfig('password_based')
        } else if (backend === 'mysql' || backend === 'postgresql') {
          return getDatabaseConfig(backend)
        } else if (backend === 'redis') {
          return getRedisConfig()
        } else if (backend === 'mongodb') {
          return getMongodbConfig()
        } else if (backend === 'ldap') {
          return getLdapConfig()
        }
        break
      case 'scram':
        if (backend === 'built_in_database') {
          return getBuiltInConfig('scram')
        } else if (backend === 'http') {
          return getHttpConfig('scram')
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
        case 'ldap':
          data = processLDAPConfig(config)
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
