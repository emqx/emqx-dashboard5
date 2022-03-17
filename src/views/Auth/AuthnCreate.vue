<template>
  <div class="auth authn-create app-wrapper">
    <back-button back-url="/authentication" v-if="!gateway">
      {{ $t('Auth.backAuthnList') }}
    </back-button>
    <div class="page-header-title">
      {{ $t('Auth.createAuth') }}
    </div>
    <guide-bar
      :guide-list="getGuideList()"
      :active-guide-index-list="activeGuidesIndex"
    ></guide-bar>
    <!-- Mechanism -->
    <div v-if="step === 0" class="create-form">
      <div class="create-form-title">
        {{ $t('Auth.selectMechanism') }}
      </div>
      <el-radio-group v-model="mechanism">
        <el-radio class="mechanism" label="password_based" border> Password-Based </el-radio>
        <el-badge :value="$t('Modules.added')" :hidden="!addedAuthn.includes('jwt')" class="item">
          <el-radio class="mechanism" label="jwt" border :disabled="addedAuthn.includes('jwt')">
            JWT
          </el-radio>
        </el-badge>
        <el-radio class="mechanism" label="scram" border>
          {{ $t('Auth.scram') }}
        </el-radio>
      </el-radio-group>
      <p v-if="mechanism === 'password_based'" class="item-description">
        {{ $t('Auth.passwordBasedDesc') }}
      </p>
      <p v-else-if="mechanism === 'jwt'" class="item-description">
        {{ $t('Auth.jwtDesc') }}
      </p>
      <p v-else-if="mechanism === 'scram'" class="item-description">
        {{ $t('Auth.scramDesc') }}
      </p>
      <div class="step-btn">
        <el-button type="primary" @click="handleNext" size="small">
          {{ $t('Base.nextStep') }}
        </el-button>
        <el-button @click="cancelCreate()" size="small">
          {{ $t('Base.cancel') }}
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
        <el-radio-group v-model="backend" class="select-database">
          <el-badge
            v-for="item in databases"
            :key="item.value"
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
        </el-radio-group>
        <template v-if="others.length !== 0">
          <div class="create-form-title">
            {{ $t('Base.other') }}
          </div>
          <el-radio-group v-model="backend">
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
        <el-button type="primary" @click="handleNext" size="small">
          {{ $t('Base.nextStep') }}
        </el-button>
        <el-button @click="handleBack" size="small">
          {{ $t('Base.backStep') }}
        </el-button>
      </div>
    </div>
    <!-- Config -->
    <div v-else-if="step === 2">
      <template v-if="mechanism !== 'jwt'">
        <database-config
          v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(backend)"
          v-model="configData"
          :database="backend"
          auth-type="authn"
        ></database-config>
        <built-in-config
          v-else-if="backend === 'built_in_database'"
          v-model="configData"
          :type="mechanism"
        ></built-in-config>
        <http-config
          auth-type="authn"
          v-else-if="backend === 'http'"
          v-model="configData"
        ></http-config>
      </template>
      <jwt-config v-else v-model="configData"></jwt-config>
      <!-- Result -->
      <div v-if="testRes" :class="['create-form', 'result-block', isWork ? 'success' : 'error']">
        <div class="result-title">
          {{ isWork ? $t('Auth.testSuccess') : $t('Auth.testFaild') }}
        </div>
      </div>
      <div class="step-btn">
        <el-button type="primary" :loading="saveLoading" @click="handleCreate" size="small">
          {{ $t('Base.create') }}
        </el-button>
        <!-- <el-button @click="handleTest">
            {{ $t('Base.test') }}
          </el-button> -->
        <el-button @click="handleBack" size="small">
          {{ $t('Base.backStep') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import BackButton from './components/BackButton.vue'
import GuideBar from '@/components/GuideBar.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import useGuide from '@/hooks/useGuide'
import { createAuthn } from '@/api/auth'
import useAuthnCreate from '@/hooks/Auth/useAuthnCreate'
import { useRouter } from 'vue-router'
import { ElMessage as M } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AuthnCreate',
  components: {
    BackButton,
    GuideBar,
    DatabaseConfig,
    BuiltInConfig,
    HttpConfig,
    JwtConfig,
  },
  props: {
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
  },
  setup(props) {
    const { t } = useI18n()
    const router = useRouter()
    const mechanism = ref('password_based')
    const backend = ref('')
    const databases = ref([])
    const others = ref([])
    const isWork = ref(false)
    const testRes = ref(null)
    const configData = ref({})
    const { factory, create } = useAuthnCreate()
    const supportBackendMap = {
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
      return JSON.parse(sessionStorage.getItem('addedAuthn')) || []
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
    const beforeNext = function () {
      if (step.value === 0) {
        databases.value = []
        others.value = []
        getSupportBackend()
      } else if (step.value === 1) {
        const data = factory(mechanism.value, backend.value)
        configData.value = data
      }
    }
    const { step, activeGuidesIndex, handleNext, handleBack } = useGuide(beforeNext)

    const handleCreate = async function () {
      saveLoading.value = true
      const data = create(configData.value, backend.value, mechanism.value)

      if (props.gateway) {
        await props
          .createFunc({
            config: configData.value,
            backend: backend.value,
            mechanism: mechanism.value,
            data,
          })
          .catch(() => {
            saveLoading.value = true
          })
      } else {
        let res = await createAuthn(data).catch(() => {
          saveLoading.value = false
        })
        if (res) {
          M.success(t('Base.createSuccess'))
          router.push({ name: 'authentication' })
        }
      }
    }

    const cancelCreate = async function () {
      if (props.gateway) {
        props.cancelFunc()
      } else {
        router.push('/authentication')
      }
    }
    return {
      saveLoading,
      activeGuidesIndex,
      mechanism,
      step,
      backend,
      databases,
      others,
      isWork,
      testRes,
      configData,
      addedAuthn,
      getGuideList,
      handleNext,
      handleBack,
      handleCreate,
      cancelCreate,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
