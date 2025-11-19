<template>
  <div class="auth authn-create app-wrapper">
    <detail-header
      :item="{ name: $t('Auth.createAuth'), routeName: 'authentication-extended' }"
      v-if="!gateway"
    />
    <el-card
      class="app-card"
      :class="{ 'no-border': !!gateway }"
      :shadow="!gateway ? 'always' : 'never'"
    >
      <guide-bar
        :guide-list="getGuideList()"
        :active-guide-index-list="activeGuidesIndex"
        :desc-list="guideDescList"
      />
      <!-- Mechanism -->
      <div v-if="step === 0" class="create-form">
        <el-radio-group v-model="mechanism" size="large">
          <template v-for="{ value, label } in authnMechanismTypeList" :key="value">
            <el-badge
              v-if="!isDisabledMechanism(value)"
              :value="$t('Base.added')"
              :hidden="isAddedBadgeHidden(value)"
              class="item"
            >
              <el-radio
                class="mechanism"
                :value="value"
                :disabled="addedAuthn.includes(value)"
                border
              >
                {{ label }}
              </el-radio>
            </el-badge>
          </template>
        </el-radio-group>
        <p class="item-description">{{ mechanismDesc }}</p>
        <div class="step-btn">
          <CancelButton @click="cancelCreate()" />
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
        </div>
      </div>
      <!-- Backend -->
      <div v-if="step === 1" class="create-form">
        <template v-if="mechanism !== 'jwt' && mechanism !== 'cinfo'">
          <p class="item-description">
            {{
              mechanism === 'gssapi'
                ? $t('Auth.dataSourceEnhancedGSSAPIAuthDesc')
                : $t('Auth.dataSourceDesc')
            }}
          </p>
          <el-row v-if="hasDatabaseToChoose">
            <el-col :span="18">
              <el-radio-group
                :model-value="backend"
                class="select-database"
                size="large"
                @update:model-value="
                  handleBackendChange($event as DatabaseAndServer | 'built_in_database')
                "
              >
                <el-row :gutter="20">
                  <el-col :span="6" v-for="item in databases" :key="item.value">
                    <el-badge
                      v-if="!isDisabledDatabase(item.value)"
                      :value="$t('Base.added')"
                      class="item"
                      :hidden="!!(!addedAuthn.includes(`${mechanism}_${item.value}`) || gateway)"
                    >
                      <el-radio
                        :value="item.value"
                        class="backend"
                        border
                        :disabled="addedAuthn.includes(`${mechanism}_${item.value}`) && !gateway"
                      >
                        <img height="32" width="32" :src="item.img" :alt="item.key" />
                        <span>{{ item.label }}</span>
                      </el-radio>
                    </el-badge>
                  </el-col>
                  <el-col v-if="others.length !== 0" :span="6">
                    <el-badge
                      v-for="item in others"
                      :key="item.value"
                      :value="$t('Base.added')"
                      :hidden="!!(!addedAuthn.includes(`${mechanism}_${item.value}`) || gateway)"
                      class="item"
                    >
                      <el-radio
                        :key="item.value"
                        :value="item.value"
                        class="backend"
                        border
                        :disabled="addedAuthn.includes(`${mechanism}_${item.value}`) && !gateway"
                      >
                        <img height="32" width="32" :src="item.img" :alt="item.key" />
                        <span>{{ item.label }}</span>
                      </el-radio>
                    </el-badge>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-col>
          </el-row>
          <p class="no-database-placeholder" v-else>
            {{ tl('noDatabasePlaceholder') }}
          </p>
        </template>
        <div v-if="showConfig">
          <template v-if="mechanism !== 'jwt' && mechanism !== 'cinfo'">
            <database-config
              v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(backend)"
              v-model="configData"
              ref="formCom"
              auth-type="authn"
              v-bind="{ database: backend as DatabaseAndServerDOM }"
            />
            <built-in-config
              v-else-if="backend === 'built_in_database'"
              v-model="configData"
              ref="formCom"
              auth-type="authn"
              :type="mechanism"
            />
            <ldap-config
              auth-type="authn"
              v-else-if="backend === 'ldap'"
              v-model="configData"
              ref="formCom"
            >
            </ldap-config>
            <http-config
              auth-type="authn"
              v-else-if="backend === 'http'"
              v-model="configData"
              ref="formCom"
              :type="mechanism"
            />
            <kerberos-config
              v-else-if="backend === 'kerberos'"
              v-model="configData"
              ref="formCom"
            />
          </template>
          <jwt-config v-else-if="mechanism === 'jwt'" v-model="configData" ref="formCom" />
          <c-info-config v-else-if="mechanism === 'cinfo'" v-model="configData" ref="formCom" />
          <!-- Result -->
          <div
            v-if="testRes"
            :class="['create-form', 'result-block', isWork ? 'success' : 'error']"
          >
            <div class="result-title">
              {{ isWork ? $t('Auth.testSuccess') : $t('Auth.testFailed') }}
            </div>
          </div>
        </div>
        <div class="step-btn">
          <!-- <el-button @click="handleTest">
            {{ $t('Base.test') }}
          </el-button> -->
          <el-button @click="handleBack">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button
            type="primary"
            :disabled="!$hasPermission('post')"
            :loading="saveLoading"
            @click="handleCreate"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>
      </div>
      <!-- Config -->
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AuthnCreate',
}
</script>

<script lang="ts" setup>
import DatabaseConfig from './components/DatabaseConfig.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import LdapConfig from './components/LdapConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import CInfoConfig from './components/CInfoConfig.vue'
import KerberosConfig from './components/KerberosConfig.vue'
import { createAuthn } from '@/api/auth'
import { ElMessage as M } from 'element-plus'
import type { DatabaseAndServer, BackendMap, MechanismType, BackendType } from '@/types/auth'
import { AuthnMechanismType } from '@/types/enum'

interface PresetData {
  mechanism: AuthnMechanismType
  subtype: string
  data: Record<string, any>
}
type DatabaseAndServerDOM = DatabaseAndServer

const props = defineProps({
  gateway: {
    type: String,
    required: false,
    default: null,
  },
  cancelFunc: {
    type: Function,
    required: false,
    default: () => {
      return true
    },
  },
  createFunc: {
    type: Function,
    required: false,
    default: () => {
      return true
    },
  },
  disabledMechanisms: {
    type: Array as PropType<Array<string>>,
  },
  disabledDatabases: {
    type: Array as PropType<Array<string>>,
  },
  presetAuthnData: {
    type: Object as PropType<Array<PresetData>>,
  },
})
const { tl, t } = useI18nTl('Auth')
const router = useRouter()
const mechanism = ref<MechanismType>('password_based')
const backend = ref<DatabaseAndServer | '' | 'built_in_database'>('')
const databases = ref<Record<string, any>[]>([])
const others = ref<Record<string, any>[]>([])
const isWork = ref(false)
const testRes = ref(null)
const configData = ref({})
const { factory, create } = useAuthnCreate()
const formCom = ref()
const { authnMechanismTypeList } = useAuthnMechanismType()

const supportBackendMap: BackendMap = {
  password_based: {
    // built_in_database: tl('builtInDatabase'),
    mysql: 'MySQL',
    mongodb: 'MongoDB',
    postgresql: 'PostgreSQL',
    http: tl('HTTPServer'),
    redis: 'Redis',
    ldap: 'LDAP',
  },
  jwt: {},
  scram: {
    built_in_database: tl('builtInDatabase'),
    http: tl('HTTPServer'),
  },
  gssapi: {
    kerberos: 'Kerberos',
  },
  cinfo: {},
}

provide('gateway', props.gateway)
const saveLoading = ref(false)
const addedAuthn = computed(() => {
  if (props.gateway) {
    return []
  }
  return JSON.parse(sessionStorage.getItem('addedAuthn') as string) || []
})
const mechanismDesc = computed(
  () =>
    ({
      password_based: tl('passwordBasedDesc'),
      jwt: tl('jwtDesc'),
      scram: tl('enhancedAuthDesc'),
      gssapi: tl('enhancedAuthDesc'),
      cinfo: tl('cinfoAuthDesc'),
    })[mechanism.value] || '',
)
const hasDatabaseToChoose = computed(() => {
  const { disabledDatabases } = props
  if (!disabledDatabases || disabledDatabases.length === 0) {
    return true
  }
  return !(
    sortStringArr(databases.value.map(({ value }) => value)).join(',') ===
    sortStringArr(disabledDatabases).join(',')
  )
})

const needSelectInSecondStep = computed(() => databases.value.length + others.value.length > 0)

const getGuideList = function () {
  return [t('Auth.mechanism'), t('Auth.config')]
}

const findFirstDatabaseDidNotAdd = () => {
  let firstDatabase = databases.value.find((item: any) => {
    return !addedAuthn.value.includes(`${mechanism.value}_${item.value}`)
  })
  if (!firstDatabase && others.value && others.value.length > 0) {
    firstDatabase = others.value.find((item: any) => {
      return !addedAuthn.value.includes(`${mechanism.value}_${item.value}`)
    })
  }
  return firstDatabase ? firstDatabase.value : undefined
}

const getSupportBackend = function () {
  const supportData = supportBackendMap[mechanism.value as MechanismType]
  Object.keys(supportData).forEach((key) => {
    const res = {
      label: supportData[key as BackendType],
      value: key,
      img: getImg(`img/${key}.png`),
    }
    const otherKeys = ['http']
    if (otherKeys.includes(key)) {
      others.value.push(res)
    } else {
      databases.value.push(res)
    }
  })
  if (databases.value.length !== 0) {
    backend.value = findFirstDatabaseDidNotAdd()
  }
}

const setDefaultBackendForGateway = () => {
  if (hasDatabaseToChoose.value) {
    const defaultDatabase = databases.value.find((item) => !isDisabledDatabase(item.value))
    if (defaultDatabase) {
      backend.value = defaultDatabase.value
    }
  } else if (others.value.length > 0) {
    backend.value = others.value[0].value
  }
}

const isDisabledMechanism = (mechanism: string) =>
  props.disabledMechanisms && props.disabledMechanisms.includes(mechanism)

const isDisabledDatabase = (database: string) =>
  props.disabledDatabases && props.disabledDatabases.includes(database)

const checkPresetDataAndSet = (authData: Record<string, any>) => {
  const { presetAuthnData } = props
  if (!presetAuthnData || presetAuthnData.length === 0) {
    return authData
  }
  const target = presetAuthnData.find((item) => {
    return item.mechanism === mechanism.value && item.subtype === backend.value
  })
  return {
    ...authData,
    ...cloneDeep(target?.data || {}),
  }
}
const { getLabelByValue: getMechanismLabel } = useAuthnMechanismType()
const { titleMap } = useAuth()
const beforeNext = function () {
  if (step.value === 0) {
    databases.value = []
    others.value = []
    getSupportBackend()
    if (props.gateway) {
      setDefaultBackendForGateway()
    }
    guideDescList.value.push(getMechanismLabel(mechanism.value as AuthnMechanismType))
  }
}
const { step, activeGuidesIndex, guideDescList, handleNext, handleBack } = useGuide(beforeNext)

const showConfig = ref(true)
const handleBackendChange = async (newBackend: DatabaseAndServer | 'built_in_database') => {
  showConfig.value = false
  const data = factory(mechanism.value, newBackend)
  configData.value = checkPresetDataAndSet(data)
  if (mechanism.value !== 'jwt') {
    guideDescList.value.push(titleMap[newBackend])
  }
  backend.value = newBackend
  await nextTick()
  showConfig.value = true
}

const handleCreate = async function () {
  const isVerified = (await formCom.value.validate().catch(() => {
    jumpToErrorFormItem()
  }))
    ? true
    : false

  if (!isVerified) {
    return
  }

  saveLoading.value = true
  const formData = cloneDeep(configData.value)
  const data = create(formData, backend.value, mechanism.value)
  try {
    if (props.gateway) {
      await props.createFunc({
        config: configData.value,
        backend: backend.value,
        mechanism: mechanism.value,
        data,
      })
    } else {
      await createAuthn(checkNOmitFromObj(data))
      M.success(t('Base.createSuccess'))
      router.push({ name: 'authentication' })
    }
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}

const cancelCreate = async function () {
  if (props.gateway) {
    props.cancelFunc()
  } else {
    router.push({ name: 'authentication-extended' })
  }
}

const isAddedBadgeHidden = (value: AuthnMechanismType) => {
  if (value === AuthnMechanismType.JWT) {
    return !addedAuthn.value.includes(AuthnMechanismType.JWT)
  }
  if (value === AuthnMechanismType.CINFO) {
    return !addedAuthn.value.includes(AuthnMechanismType.CINFO)
  }
  return true
}
</script>

<style lang="scss">
@use './style/auth.scss';
.app-card.no-border {
  border: none;
}
.no-database-placeholder {
  color: var(--el-text-color-secondary);
}
</style>
