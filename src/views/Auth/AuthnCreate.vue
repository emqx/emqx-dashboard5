<template>
  <div class="auth authn-create app-wrapper">
    <detail-header :item="{ name: $t('Auth.createAuth'), path: '/authentication' }" />
    <el-card>
      <guide-bar :guide-list="getGuideList()" :active-guide-index-list="activeGuidesIndex" />
      <!-- Mechanism -->
      <div v-if="step === 0" class="create-form">
        <div class="create-form-title">
          {{ $t('Auth.selectMechanism') }}
        </div>
        <el-radio-group v-model="mechanism" size="large">
          <el-radio
            class="mechanism"
            label="password_based"
            v-if="!isDisabledMechanism('password_based')"
            border
          >
            Password-Based
          </el-radio>
          <template v-if="!isDisabledMechanism('jwt')">
            <el-badge
              :value="$t('Modules.added')"
              :hidden="!addedAuthn.includes('jwt')"
              class="item"
            >
              <el-radio class="mechanism" label="jwt" border :disabled="addedAuthn.includes('jwt')">
                JWT
              </el-radio>
            </el-badge>
          </template>
          <el-radio class="mechanism" label="scram" v-if="!isDisabledMechanism('scram')" border>
            {{ $t('Auth.scram') }}
          </el-radio>
        </el-radio-group>
        <p class="item-description">{{ mechanismDesc }}</p>
        <div class="step-btn">
          <el-button @click="cancelCreate()">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
        </div>
      </div>
      <!-- Backend -->
      <div v-if="step === 1" class="create-form">
        <div class="create-form-title">
          {{ $t('Auth.selectDataSource') }}
        </div>
        <template v-if="mechanism !== 'jwt'">
          <p class="item-description">
            {{ $t('Auth.dataSourceDesc') }}
          </p>
          <div class="create-form-title">
            {{ $t('Auth.database') }}
          </div>
          <el-radio-group
            v-if="hasDatabaseToChoose"
            v-model="backend"
            class="select-database"
            size="large"
          >
            <template v-for="item in databases" :key="item.value">
              <el-badge
                v-if="!isDisabledDatabase(item.value)"
                :value="$t('Modules.added')"
                class="item"
                :hidden="!addedAuthn.includes(`${mechanism}_${item.value}`) || gateway"
              >
                <el-radio
                  :label="item.value"
                  class="backend"
                  border
                  :disabled="addedAuthn.includes(`${mechanism}_${item.value}`) && !gateway"
                >
                  <img height="32" width="32" :src="item.img" :alt="item.key" />
                  <span>{{ item.label }}</span>
                </el-radio>
              </el-badge>
            </template>
          </el-radio-group>
          <p class="no-database-placeholder" v-else>
            {{ tl('noDatabasePlaceholder') }}
          </p>
          <template v-if="others.length !== 0">
            <div class="create-form-title">
              {{ $t('Base.other') }}
            </div>
            <el-radio-group v-model="backend" size="large">
              <el-badge
                v-for="item in others"
                :key="item.value"
                :value="$t('Modules.added')"
                :hidden="!addedAuthn.includes(`${mechanism}_${item.value}`) || gateway"
                class="item"
              >
                <el-radio
                  :key="item.value"
                  :label="item.value"
                  class="backend"
                  border
                  :disabled="addedAuthn.includes(`${mechanism}_${item.value}`) && !gateway"
                >
                  <img height="32" width="32" :src="item.img" :alt="item.key" />
                  <span>{{ item.label }}</span>
                </el-radio>
              </el-badge>
            </el-radio-group>
          </template>
        </template>
        <p v-else class="item-description">
          {{ $t('Auth.jwtDataSourceDesc') }}
        </p>
        <div class="step-btn">
          <el-button @click="handleBack">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
        </div>
      </div>
      <!-- Config -->
      <div v-else-if="step === 2">
        <template v-if="mechanism !== 'jwt'">
          <database-config
            v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(backend)"
            v-model="configData"
            ref="formCom"
            :database="backend"
            auth-type="authn"
          />
          <built-in-config
            v-else-if="backend === 'built_in_database'"
            v-model="configData"
            ref="formCom"
            :type="mechanism"
          />
          <http-config
            auth-type="authn"
            v-else-if="backend === 'http'"
            v-model="configData"
            ref="formCom"
          />
        </template>
        <jwt-config v-else v-model="configData" ref="formCom" />
        <!-- Result -->
        <div v-if="testRes" :class="['create-form', 'result-block', isWork ? 'success' : 'error']">
          <div class="result-title">
            {{ isWork ? $t('Auth.testSuccess') : $t('Auth.testFaild') }}
          </div>
        </div>
        <div class="step-btn">
          <!-- <el-button @click="handleTest">
            {{ $t('Base.test') }}
          </el-button> -->
          <el-button @click="handleBack">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button type="primary" :loading="saveLoading" @click="handleCreate">
            {{ $t('Base.create') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AuthnCreate',
}
</script>

<script lang="ts" setup>
import { computed, ref, defineProps, PropType } from 'vue'
import GuideBar from '@/components/GuideBar.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import useGuide from '@/hooks/useGuide'
import { createAuthn } from '@/api/auth'
import useAuthnCreate from '@/hooks/Auth/useAuthnCreate'
import { useRouter } from 'vue-router'
import { ElMessage as M } from 'element-plus'
import { cloneDeep } from 'lodash'
import { jumpToErrorFormItem, sortStringArr } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { AuthnMechanismType } from '@/types/enum'

interface PresetData {
  mechanism: AuthnMechanismType
  subtype: string
  data: Record<string, any>
}

const props = defineProps({
  gateway: {
    type: Boolean,
    required: false,
    default: false,
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
const mechanism = ref('password_based')
const backend = ref('')
const databases = ref<Record<string, any>[]>([])
const others = ref<Record<string, any>[]>([])
const isWork = ref(false)
const testRes = ref(null)
const configData = ref({})
const { factory, create } = useAuthnCreate()
const formCom = ref()
const supportBackendMap: any = {
  password_based: {
    built_in_database: 'Built-in Database',
    mysql: 'MySQL',
    mongodb: 'MongoDB',
    postgresql: 'PostgreSQL',
    http: 'HTTP Server',
    redis: 'Redis',
  },
  jwt: {},
  scram: {
    built_in_database: 'Built-in Database',
  },
}
const saveLoading = ref(false)
const addedAuthn = computed(() => {
  return JSON.parse(sessionStorage.getItem('addedAuthn') as string) || []
})
const mechanismDesc = computed(
  () =>
    ({
      password_based: tl('passwordBasedDesc'),
      jwt: tl('jwtDesc'),
      scram: tl('scramDesc'),
    }[mechanism.value] || ''),
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

const getGuideList = function () {
  return [t('Auth.mechanism'), t('Auth.dataSource'), t('Auth.config')]
}
const getSupportBackend = function () {
  const supportData = supportBackendMap[mechanism.value]
  Object.keys(supportData).forEach((key) => {
    const res = {
      label: supportData[key],
      value: key,
      img: require(`@/assets/img/${key}.png`),
    }
    const otherKeys = ['http']
    if (otherKeys.includes(key)) {
      others.value.push(res)
    } else {
      databases.value.push(res)
    }
  })
  if (databases.value.length !== 0) {
    backend.value = databases.value[0].value
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

const beforeNext = function () {
  if (step.value === 0) {
    databases.value = []
    others.value = []
    getSupportBackend()
  } else if (step.value === 1) {
    const data = factory(mechanism.value, backend.value)
    configData.value = checkPresetDataAndSet(data)
  }
}
const { step, activeGuidesIndex, handleNext, handleBack } = useGuide(beforeNext)

const handleCreate = async function () {
  let isVerified = (await formCom.value.validate().catch(() => {
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
      await createAuthn(data)
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
    router.push('/authentication')
  }
}
</script>

<style lang="scss">
@import './style/auth.scss';
.no-database-placeholder {
  color: var(--el-text-color-secondary);
}
</style>
