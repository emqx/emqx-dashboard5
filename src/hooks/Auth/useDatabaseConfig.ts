/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DEFAULT_SALT_POSITION } from '@/common/constants'
import { SaltPosition } from '@/types/enum'
import { watch, ref, computed, SetupContext } from 'vue'
import { useRoute } from 'vue-router'
import { isEqual } from 'lodash'

export default function useDatabaseConfig(
  props: {
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
  const databaseConfig = ref(props.modelValue)

  const id = computed(function () {
    const { id, type } = route.params
    return id || type
  })

  watch(databaseConfig.value, (value) => {
    emit('update:modelValue', value)
  })

  watch(
    () => props.modelValue,
    (val) => {
      if (!isEqual(val, databaseConfig.value)) {
        databaseConfig.value = val
      }
    },
  )

  const setMySql = () => {
    let defaultDatabase = ''
    if (props.authType === 'authn') {
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
    databaseConfig.value.database = defaultDatabase
    databaseConfig.value.server = '127.0.0.1:3306'
    databaseConfig.value.query = defaultContent.value
  }
  const setPgSql = () => {
    let defaultDatabase = ''
    if (props.authType === 'authn') {
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
    databaseConfig.value.database = defaultDatabase
    databaseConfig.value.server = '127.0.0.1:5432'
    databaseConfig.value.query = defaultContent.value
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
      const { filter } = databaseConfig.value
      databaseConfig.value.filter = JSON.stringify(filter)
      return
    }
    databaseConfig.value.filter = defaultContent.value
  }
  const setRedis = () => {
    if (props.authType === 'authn') {
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
    databaseConfig.value.cmd = defaultContent.value
  }
  switch (props.database) {
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
