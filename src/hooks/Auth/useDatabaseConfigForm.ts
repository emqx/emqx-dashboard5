import { computed, ref, ComputedRef, Ref } from 'vue'
import useFormRules from '@/hooks/useFormRules'
import { FormRules } from 'element-plus'
import useI18nTl from '../useI18nTl'

type PropsParams = {
  database: string
  modelValue: any
  authType: string
}

type ReturnData = {
  isMongoDB: ComputedRef<boolean>
  isRedis: ComputedRef<boolean>
  isMySQL: ComputedRef<boolean>
  isPgSQL: ComputedRef<boolean>
  isServers: ComputedRef<boolean>
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => Promise<any>
  clearValidate: () => any
}

export default (props: PropsParams, databaseConfig: any): ReturnData => {
  const { createRequiredRule } = useFormRules()

  const { tl } = useI18nTl('Auth')
  const formCom = ref()

  const createRedisCommonFormRules = () => ({
    redis_type: createRequiredRule(tl('redisType'), 'select'),
    cmd: createRequiredRule(tl('cmd')),
  })

  const createMongoCommonFormRules = () => ({
    mongo_type: createRequiredRule(tl('mongoType'), 'select'),
    collection: createRequiredRule('Collection'),
  })

  const rules = computed(() => {
    let ret: FormRules = {
      database: createRequiredRule(tl('database')),
    }

    if (isRedis.value) {
      ret = { ...ret, ...createRedisCommonFormRules() }
    } else if (isMongoDB.value) {
      ret = {
        ...ret,
        ...createMongoCommonFormRules(),
        replica_set_name: createRequiredRule('Replica Set Name'),
      }
    }

    if (isServers.value) {
      ret.servers = createRequiredRule(tl('servers'))
    } else {
      ret.server = createRequiredRule(tl('server'))
    }
    return ret
  })

  const isMongoDB = computed(() => props.database === 'mongodb')
  const isRedis = computed(() => props.database === 'redis')
  const isMySQL = computed(() => props.database === 'mysql')
  const isPgSQL = computed(() => props.database === 'postgresql')
  const isServers = computed(() => {
    return (
      (isMongoDB.value && databaseConfig.mongo_type !== 'single') ||
      (isRedis.value && databaseConfig.redis_type !== 'single')
    )
  })

  const validate = () => {
    return formCom.value.validate()
  }

  const clearValidate = () => {
    return formCom.value.clearValidate()
  }

  return {
    isMongoDB,
    isRedis,
    isMySQL,
    isPgSQL,
    isServers,
    formCom,
    rules,
    validate,
    clearValidate,
  }
}
