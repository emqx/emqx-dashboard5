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
  const defaultContent = ref('')
  const databaseConfig = reactive(modelValue)
  watch(databaseConfig, (value) => {
    emit('update:modelValue', value)
  })
  const id = computed(function () {
    const { id, type } = route.params
    return id || type
  })
  const helpContent = ref('')
  const setMySql = () => {
    let defaultDatabase = ''
    if (authType === 'authn') {
      defaultContent.value =
        DEFAULT_SALT_POSITION === SaltPosition.Disable ? defaultSQL : withSaltDefaultSQL
      helpContent.value = `
        CREATE TABLE IF NOT EXISTS \`mqtt_user\` (
          \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
          \`username\` varchar(100) DEFAULT NULL,
          \`password_hash\` varchar(100) DEFAULT NULL,
          \`salt\` varchar(35) DEFAULT NULL,
          \`is_superuser\` tinyint(1) DEFAULT 0,
          \`created\` datetime DEFAULT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`mqtt_username\` (\`username\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
      defaultDatabase = 'mqtt_user'
    } else {
      defaultContent.value = `SELECT action, permission, topic FROM mqtt_acl where username = \${username}`
      helpContent.value = `
       CREATE TABLE \`mqtt_acl\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
        \`ipaddress\` VARCHAR(60) NOT NULL DEFAULT '',
        \`username\` VARCHAR(255) NOT NULL DEFAULT '',
        \`clientid\` VARCHAR(255) NOT NULL DEFAULT '',
        \`action\` ENUM('publish', 'subscribe', 'all') NOT NULL,
        \`permission\` ENUM('allow', 'deny') NOT NULL,
        \`topic\` VARCHAR(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `
      defaultDatabase = 'mqtt_user'
    }
    if (id.value) {
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
      helpContent.value = `
        CREATE TABLE mqtt_user (
          id SERIAL primary key,
          is_superuser boolean,
          username character varying(100),
          password_hash character varying(100),
          salt character varying(40)
        )
      `
      defaultDatabase = 'mqtt_user'
    } else {
      defaultContent.value = `SELECT action, permission, topic FROM mqtt_acl where username = \${username}`
      helpContent.value = `
        CREATE TYPE ACTION AS ENUM('publish','subscribe','all');
        CREATE TYPE PERMISSION AS ENUM('allow','deny');

        CREATE TABLE mqtt_acl (
          id SERIAL PRIMARY KEY,
          ipaddress CHARACTER VARYING(60) NOT NULL DEFAULT '',
          username CHARACTER VARYING(255) NOT NULL DEFAULT '',
          clientid CHARACTER VARYING(255) NOT NULL DEFAULT '',
          action ACTION,
          permission PERMISSION,
          topic CHARACTER VARYING(255) NOT NULL
        );
      `
      defaultDatabase = 'mqtt_acl'
    }
    if (id.value) {
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
    if (authType === 'authn') {
      helpContent.value = `
        {
          username: "emqx_user",
          password_hash: "******",
          salt: "foo+bar",
          is_superuser: false,
          created: "2021-01-01 12:00:01"
        }

        db.mqtt_user.findOne({"username": "emqx_user"})
      `
    } else {
      helpContent.value = `
        {
          username: "emqx_u",
          clientid: "emqx_c",
          ipaddress: "127.0.0.1",
          permission: "allow",
          action: "all",
          topics: ["#"]
        }

        db.mqtt_acl.findOne({"username": "emqx_user"})
      `
    }
    if (id.value) {
      const { selector } = databaseConfig
      databaseConfig.selector = JSON.stringify(selector)
      return
    }
    databaseConfig.selector = defaultContent.value
  }
  const setRedis = () => {
    if (authType === 'authn') {
      defaultContent.value = `HMGET mqtt_user:\${username} password_hash`
      helpContent.value = `
        # sample data
        HMSET mqtt_user:emqx_u password_hash *** salt foo+bar is_superuser 1

        # sample cmd
        # HMGET mqtt_user:\${username}

        ## only password
        HMGET mqtt_user:emqx_u password_hash

        ## password + salt
        HMGET mqtt_user:emqx_u password_hash salt

        ## password + salt, enable superuser
        HMGET mqtt_user:emqx_u password_hash salt is_superuser

        ## only password, enable superuser
        HMGET mqtt_user:emqx_u password_hash is_superuser
      `
    } else {
      defaultContent.value = `HGETALL mqtt_acl:\${username}`
      helpContent.value = `
        # sample data
        HSET mqtt_acl:emqx_u 't/#' subscribe

        # sample cmd
        HGETALL mqtt_acl:\${username}
      `
    }
    if (id.value) {
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
    defaultContent,
    helpContent,
    databaseConfig,
  }
}
