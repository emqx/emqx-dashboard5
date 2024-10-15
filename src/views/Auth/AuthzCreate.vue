<template>
  <div class="auth authz-create app-wrapper">
    <detail-header :item="{ name: $t('Auth.createAuthz'), path: '/authorization' }" />
    <el-card class="app-card">
      <guide-bar
        :guide-list="getGuideList()"
        :active-guide-index-list="activeGuidesIndex"
        :desc-list="guideDescList"
      ></guide-bar>
      <div v-if="step === 0" class="create-form">
        <p class="item-description">
          {{ tl('dataSourceAuthzDesc') }}
        </p>
        <el-radio-group v-model="type" size="large">
          <el-badge
            v-for="item in typeList"
            :key="item.value"
            :value="$t('Base.added')"
            class="item"
            :hidden="!addedAuthz.includes(item.value)"
          >
            <el-radio
              :key="item.value"
              :value="item.value"
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
          <el-button type="primary" @click="handleNext" :disabled="!type">
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
        <ldap-config
          auth-type="authz"
          v-else-if="type === 'ldap'"
          v-model="configData"
          ref="formCom"
        >
        </ldap-config>
        <built-in-config
          v-else-if="type === 'built_in_database'"
          v-model="configData"
          auth-type="authz"
          ref="formCom"
        />
        <database-config
          v-else-if="type && ['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
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

<script lang="ts" setup>
import { createAuthz } from '@/api/auth'
import builtInDatabaseIcon from '@/assets/img/built_in_database.png'
import fileIcon from '@/assets/img/file.png'
import httpIcon from '@/assets/img/http.png'
import mongodbIcon from '@/assets/img/mongodb.png'
import mysqlIcon from '@/assets/img/mysql.png'
import postgresqlIcon from '@/assets/img/postgresql.png'
import redisIcon from '@/assets/img/redis.png'
import { checkNOmitFromObj, jumpToErrorFormItem } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import useAuth from '@/hooks/Auth/useAuth'
import useAuthzCreate from '@/hooks/Auth/useAuthzCreate'
import useGuide from '@/hooks/useGuide'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BuiltInConfig from './components/BuiltInConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import FileConfig from './components/FileConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import LdapConfig from './components/LdapConfig.vue'

type AuthzData = any

const { t, tl } = useI18nTl('Auth')
const router = useRouter()

const getGuideList = function () {
  return [t('Auth.dataSource'), t('Auth.config')]
}
const type = ref<string | undefined>('file')
const configData = ref<AuthzData>({})
const saveLoading = ref(false)

const formCom = ref()

const { factory, create } = useAuthzCreate()

const typeList = ref([
  { label: tl('file'), value: 'file', img: fileIcon },
  { label: tl('builtInDatabase'), value: 'built_in_database', img: builtInDatabaseIcon },
  { label: 'MySQL', value: 'mysql', img: mysqlIcon },
  { label: 'MongoDB', value: 'mongodb', img: mongodbIcon },
  { label: 'PostgreSQL', value: 'postgresql', img: postgresqlIcon },
  { label: 'Redis', value: 'redis', img: redisIcon },
  // {
  //   label: 'LDAP',
  //   value: 'ldap',
  //   img: require('@/assets/img/ldap.png'),
  // },
  { label: tl('HTTPServer'), value: 'http', img: httpIcon },
])
const { titleMap } = useAuth()
const { step, activeGuidesIndex, handleNext, handleBack, guideDescList } = useGuide(() => {
  if (step.value === 0) {
    if (!type.value) {
      return
    }
    const data = factory(type.value)
    configData.value = data
    guideDescList.value.push(titleMap[type.value])
  }
})

const addedAuthz = computed<Array<string>>(() => {
  const stored = sessionStorage.getItem('addedAuthz')
  try {
    if (stored) {
      return JSON.parse(stored)
    }
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
})

const findFirstTypeDidNotAdd = () => {
  const ret = typeList.value.find(({ value }) => !addedAuthz.value.includes(value))
  return ret ? ret.value : undefined
}

const handleCreate = async function () {
  if (!type.value) {
    return
  }
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
  const data = checkNOmitFromObj(create(configData.value, type.value))
  const res = await createAuthz(data).catch(() => {
    saveLoading.value = false
  })
  if (res) {
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'authorization' })
  }
}

onMounted(() => {
  type.value = findFirstTypeDidNotAdd()
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
