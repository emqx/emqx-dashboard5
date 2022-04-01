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
  isDatabaseRequired: ComputedRef<boolean>
  validate: () => Promise<any>
}

export default (props: PropsParams, databaseConfig: any): ReturnData => {
  const { createRequiredRule } = useFormRules()
  const needDatabaseTypes = ['mongodb', 'mysql', 'postgresql']

  const { tl } = useI18nTl('Auth')
  const formCom = ref()
  const rules = computed(() => {
    const ret: FormRules = {}
    if (isServers.value) {
      ret.servers = createRequiredRule(tl('servers'))
    } else {
      ret.server = createRequiredRule(tl('server'))
    }
    if (isDatabaseRequired.value) {
      ret.database = createRequiredRule(tl('database'))
    }
    return ret
  })

  const isDatabaseRequired = computed(() => needDatabaseTypes.includes(props.database))

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

  return {
    isMongoDB,
    isRedis,
    isMySQL,
    isPgSQL,
    isServers,
    formCom,
    rules,
    isDatabaseRequired,
    validate,
  }
}
