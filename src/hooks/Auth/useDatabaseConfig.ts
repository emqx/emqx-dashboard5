/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DEFAULT_SALT_POSITION } from '@/common/constants'
import { SaltPosition } from '@/types/enum'
import { watch, reactive, ref, computed, SetupContext } from 'vue'
import { useRoute } from 'vue-router'

export default function useDatabaseConfig(
  {
    database,
    modelValue,
    authType,
  }: {
    database: string
    modelValue: any
    authType: string
  },
  { emit }: SetupContext<'update:modelValue'[]>,
) {
  const route = useRoute()
  const defaultSQL = 'SELECT password_hash FROM mqtt_user where username = ${username} LIMIT 1'
  /**
   * when hash type is not bcrypt or pbkdf2 and salt is not disable, use this to the default SQL
   */
  const withSaltDefaultSQL =
    'SELECT password_hash, salt FROM mqtt_user where username = ${username} LIMIT 1'

  const authnRedisDefaultCMD = 'HMGET mqtt_user:${username} password_hash'
  const authnRedisWithSaltDefaultCMD = 'HMGET mqtt_user:${username} password_hash salt'
  const defaultContent = ref('')
  const databaseConfig = reactive(modelValue)
  watch(databaseConfig, (value) => {
    emit('update:modelValue', value)
  })
  const id = computed(function () {
    const { id, type } = route.params
    return id || type
  })
  const setMySql = () => {
    let defaultDatabase = ''
    if (authType === 'authn') {
      defaultContent.value =
        DEFAULT_SALT_POSITION === SaltPosition.Disable ? defaultSQL : withSaltDefaultSQL
      defaultDatabase = 'mqtt_user'
    } else {
      defaultContent.value = `SELECT action, permission, topic FROM mqtt_acl where username = \${username}`
      defaultDatabase = 'mqtt_acl'
    }
    if (id.value || route.params.name) {
      return
    }
    databaseConfig.database = defaultDatabase
    databaseConfig.server = '127.0.0.1:3306'
    databaseConfig.query = defaultContent.value
  }
  const setPgSql = () => {
    let defaultDatabase = ''
    if (authType === 'authn') {
      defaultContent.value =
        DEFAULT_SALT_POSITION === SaltPosition.Disable ? defaultSQL : withSaltDefaultSQL
      defaultDatabase = 'mqtt_user'
    } else {
      defaultContent.value = `SELECT action, permission, topic FROM mqtt_acl where username = \${username}`
      defaultDatabase = 'mqtt_acl'
    }
    if (id.value || route.params.name) {
      return
    }
    databaseConfig.database = defaultDatabase
    databaseConfig.server = '127.0.0.1:5432'
    databaseConfig.query = defaultContent.value
  }
  const setMongoDB = () => {
    defaultContent.value = JSON.stringify(
      {
        username: '${username}',
      },
      null,
      2,
    )
    if (id.value) {
      const { filter } = databaseConfig
      databaseConfig.filter = JSON.stringify(filter)
      return
    }
    databaseConfig.filter = defaultContent.value
  }
  const setRedis = () => {
    if (authType === 'authn') {
      defaultContent.value =
        DEFAULT_SALT_POSITION === SaltPosition.Disable
          ? authnRedisDefaultCMD
          : authnRedisWithSaltDefaultCMD
    } else {
      defaultContent.value = `HGETALL mqtt_acl:\${username}`
    }
    if (id.value || route.params.name) {
      return
    }
    databaseConfig.cmd = defaultContent.value
  }
  switch (database) {
    case 'mysql':
      setMySql()
      break
    case 'postgresql':
      setPgSql()
      break
    case 'mongodb':
      setMongoDB()
      break
    case 'redis':
      setRedis()
      break
  }
  return {
    defaultSQL,
    withSaltDefaultSQL,

    authnRedisDefaultCMD,
    authnRedisWithSaltDefaultCMD,

    defaultContent,
    databaseConfig,
  }
}
