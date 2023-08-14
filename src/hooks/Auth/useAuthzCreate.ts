import _ from 'lodash'
import useProcessAuthData from './useProcessAuthData'
import useSSL from '@/hooks/useSSL'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useAuthzCreate() {
  const { createSSLForm, handleSSLDataBeforeSubmit } = useSSL()
  const { createResourceOpt, processHttpConfig, processMongoDBConfig, processRedisConfig } =
    useProcessAuthData()

  const getFileConfig = () => {
    return {
      rules: `%%--------------------------------------------------------------------
%% -type(ipaddr() :: {ipaddr, string()}).
%%
%% -type(ipaddrs() :: {ipaddrs, string()}).
%%
%% -type(username() :: {user | username, string()} | {user | username, {re, regex()}}).
%%
%% -type(clientid() :: {client | clientid, string()} | {client | clientid, {re, regex()}}).
%%
%% -type(who() :: ipaddr() | ipaddrs() |username() | clientid() |
%%                {'and', [ipaddr() | ipaddrs()| username() | clientid()]} |
%%                {'or',  [ipaddr() | ipaddrs()| username() | clientid()]} |
%%                all).
%%
%% -type(action() :: subscribe | publish | all).
%%
%% -type(topic_filters() :: string()).
%%
%% -type(topics() :: [topic_filters() | {eq, topic_filters()}]).
%%
%% -type(permission() :: allow | deny).
%%
%% -type(rule() :: {permission(), who(), access(), topics()} | {permission(), all}).
%%--------------------------------------------------------------------

{allow, {username, "^dashboard?"}, subscribe, ["$SYS/#"]}.

{allow, {ipaddr, "127.0.0.1"}, all, ["$SYS/#", "#"]}.

{deny, all, subscribe, ["$SYS/#", {eq, "#"}]}.

{allow, all}.
`,
    }
  }
  const getDatabaseConfig = () => {
    return {
      server: '',
      username: 'root',
      password: '',
      database: '',
      pool_size: 8,
      ssl: createSSLForm(),
      query: '',
      ...createResourceOpt(),
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
        },
        null,
        2,
      ),
      pool_size: 8,
      connect_timeout: '15s',
      request_timeout: '30s',
      enable_pipelining: 100,
      ssl: createSSLForm(),
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
      r_mode: 'master',
      w_mode: 'unsafe',
      pool_size: 8,
      ssl: createSSLForm(),
      topology: {
        connect_timeout_ms: '20s',
      },
    }
  }
  const getRedisConfig = () => {
    return {
      server: '127.0.0.1:6379',
      servers: '127.0.0.1:6379,127.0.0.2:6379,127.0.0.3:6379',
      sentinel: 'mysentinel',
      redis_type: 'single',
      database: 0,
      password: '',
      pool_size: 8,
      cmd: '',
      ssl: createSSLForm(),
      ...createResourceOpt(),
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
      publish_attribute: 'mqttPublishTopic',
      subscribe_attribute: 'mqttSubscriptionTopic',
      all_attribute: 'mqttPubSubTopic',
    }
  }
  const factory = (type: string) => {
    switch (type) {
      case 'file':
        return getFileConfig()
      case 'mysql':
        return getDatabaseConfig()
      case 'postgresql':
        return getDatabaseConfig()
      case 'http':
        return getHttpConfig()
      case 'mongodb':
        return getMongodbConfig()
      case 'redis':
        return getRedisConfig()
      case 'built_in_database':
        return {}
      case 'ldap':
        return getLdapConfig()
    }
  }
  const create = (config: any, type: string) => {
    let data: any = {}
    switch (type) {
      case 'http':
        data = processHttpConfig(config)
        break
      case 'mongodb':
        data = processMongoDBConfig(config)
        break
      case 'redis':
        data = processRedisConfig(config)
        break
      default:
        data = _.cloneDeep(config)
        break
    }
    data.type = type
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
