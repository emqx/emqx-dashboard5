<template>
  <div class="auth authz-create app-wrapper">
    <detail-header :item="{ name: $t('Auth.createAuthz'), path: '/authorization' }" />
    <el-card class="app-card">
      <guide-bar
        :guide-list="getGuideList()"
        :active-guide-index-list="activeGuidesIndex"
      ></guide-bar>
      <div v-if="step === 0" class="create-form">
        <div class="create-form-title">
          {{ $t('Auth.selectDataSource') }}
        </div>
        <el-radio-group v-model="type" class="select-type" size="large">
          <el-badge
            v-for="item in typeList"
            :key="item.value"
            :value="$t('Modules.added')"
            class="item"
            :hidden="!addedAuthz.includes(item.value)"
          >
            <el-radio
              :key="item.value"
              :label="item.value"
              class="backend"
              border
              :disabled="addedAuthz.includes(item.value)"
            >
              <img height="32" width="32" :src="item.img" :alt="item.label" />
              <span>{{ item.label }}</span>
            </el-radio>
          </el-badge>
        </el-radio-group>
        <div class="step-btn">
          <el-button @click="$router.push('/authorization')">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleNext">
            {{ $t('Base.nextStep') }}
          </el-button>
        </div>
      </div>
      <!-- Config -->
      <div v-if="step === 1">
        <file-config v-if="type === 'file'" ref="formCom" v-model="configData" />
        <http-config
          v-else-if="type === 'http'"
          ref="formCom"
          auth-type="authz"
          v-model="configData"
        />
        <p v-else-if="type === 'built_in_database'" class="item-description">
          {{ $t('Auth.builtInDatabaseDesc') }}
        </p>
        <database-config
          v-else-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
          ref="formCom"
          v-model="configData"
          :database="type"
          auth-type="authz"
        />
        <div class="step-btn">
          <el-button @click="handleBack">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button type="primary" @click="handleCreate" :loading="saveLoading">
            {{ $t('Base.create') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import FileConfig from './components/FileConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import useGuide from '@/hooks/useGuide'
import { createAuthz } from '@/api/auth'
import useAuthzCreate from '@/hooks/Auth/useAuthzCreate'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { jumpToErrorFormItem } from '@/common/tools'

export default defineComponent({
  name: 'AuthzCreate',
  components: {
    DetailHeader,
    GuideBar,
    FileConfig,
    DatabaseConfig,
    HttpConfig,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    const getGuideList = function () {
      return [t('Auth.dataSource'), t('Auth.config')]
    }
    const type = ref('file')
    const configData = ref({})
    const saveLoading = ref(false)

    const formCom = ref()

    const { factory, create } = useAuthzCreate()

    const typeList = ref([
      { label: 'File', value: 'file', img: require('@/assets/img/file.png') },
      {
        label: 'Built-in Database',
        value: 'built_in_database',
        img: require('@/assets/img/built_in_database.png'),
      },
      {
        label: 'MySQL',
        value: 'mysql',
        img: require('@/assets/img/mysql.png'),
      },
      {
        label: 'MongoDB',
        value: 'mongodb',
        img: require('@/assets/img/mongodb.png'),
      },
      {
        label: 'PostgreSQL',
        value: 'postgresql',
        img: require('@/assets/img/postgresql.png'),
      },
      {
        label: 'HTTP Server',
        value: 'http',
        img: require('@/assets/img/http.png'),
      },
      {
        label: 'Redis',
        value: 'redis',
        img: require('@/assets/img/redis.png'),
      },
    ])

    const { step, activeGuidesIndex, handleNext, handleBack } = useGuide(() => {
      if (step.value === 0) {
        const data = factory(type.value)
        configData.value = data
      }
    })

    const addedAuthz = computed(() => {
      return JSON.parse(sessionStorage.getItem('addedAuthz')) || []
    })

    const handleCreate = async function () {
      let isVerified = true
      if (type.value !== 'built_in_database') {
        await formCom.value.validate().catch(() => {
          isVerified = false
          jumpToErrorFormItem()
        })
      }
      if (!isVerified) {
        return
      }
      saveLoading.value = true
      const data = create(configData.value, type.value)
      const res = await createAuthz(data).catch(() => {
        saveLoading.value = false
      })
      if (res) {
        ElMessage.success(t('Base.createSuccess'))
        router.push({ name: 'authorization' })
      }
    }
    return {
      saveLoading,
      configData,
      step,
      type,
      typeList,
      activeGuidesIndex,
      addedAuthz,
      formCom,
      handleNext,
      handleBack,
      handleCreate,
      getGuideList,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
