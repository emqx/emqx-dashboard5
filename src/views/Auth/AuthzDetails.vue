<template>
  <div class="auth auth-details details">
    <div class="detail-top">
      <detail-header :item="{ name: titleMap[type], path: '/authorization' }">
        <template #content>
          <div class="vertical-align-center">
            <img :src="currImg" height="40" />
            <p class="block-title">{{ titleMap[type] }}</p>
            <AuthItemStatus is-tag :metrics="authMetrics" />
          </div>
        </template>
        <template #extra>
          <el-tooltip
            :content="configData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch class="enable-btn" v-model="configData.enable" @change="updateEnable" />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button class="icon-button" type="danger" :icon="Delete" @click="handleDelete" plain>
            </el-button>
          </el-tooltip>
        </template>
      </detail-header>
    </div>
    <el-tabs class="detail-tabs" v-loading.lock="authzDetailLock" v-model="currTab">
      <div class="app-wrapper">
        <el-tab-pane :label="$t('Base.overview')" name="overview" :lazy="true">
          <AuthItemOverview :metrics="authMetrics" type="authz" />
        </el-tab-pane>
        <el-tab-pane
          v-if="type === 'built_in_database'"
          :label="$t('Auth.permissions')"
          name="users"
          :lazy="true"
        >
          <authz-manager />
        </el-tab-pane>
        <el-tab-pane :label="$t('Base.setting')" name="settings" :lazy="true">
          <el-card v-if="!authzDetailLock" class="app-card">
            <database-config
              v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(type)"
              ref="formCom"
              :database="type"
              v-model="configData"
              auth-type="authz"
              is-edit
            />
            <file-config v-else-if="type === 'file'" ref="formCom" v-model="configData" />
            <http-config
              v-else-if="type === 'http'"
              ref="formCom"
              auth-type="authz"
              v-model="configData"
              is-edit
            />
            <ldap-config
              auth-type="authz"
              v-else-if="type === 'ldap'"
              v-model="configData"
              ref="formCom"
              is-edit
            >
            </ldap-config>
            <built-in-config
              v-else-if="type === 'built_in_database'"
              auth-type="authz"
              v-model="configData"
              ref="formCom"
            />
            <el-button @click="$router.push('/authorization')">
              {{ $t('Base.cancel') }}
            </el-button>
            <el-button type="primary" :loading="isSubmitting" @click="handleUpdate()">
              {{ $t('Base.update') }}
            </el-button>
            <!-- <el-button @click="handleTest">
              {{ $t('Base.test') }}
            </el-button> -->
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { deleteAuthz, loadAuthz, queryAuthzItemMetrics, updateAuthz } from '@/api/auth'
import { checkNOmitFromObj, getImg, jumpToErrorFormItem } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useAuth from '@/hooks/Auth/useAuth'
import useAuthzCreate from '@/hooks/Auth/useAuthzCreate'
import useToggleAuthStatus from '@/hooks/Auth/useToggleAuthStatus'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { Metrics } from '@/types/auth'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AuthItemOverview from './components/AuthItemOverview.vue'
import AuthItemStatus from './components/AuthItemStatus.vue'
import AuthzManager from './components/AuthzManager.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import FileConfig from './components/FileConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import LdapConfig from './components/LdapConfig.vue'

type AuthzData = any

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const authzDetailLock = ref(false)
const { titleMap } = useAuth()
const configData = ref<AuthzData>({
  ssl: { enable: false },
  topology: {},
})
const authMetrics = ref<Metrics>({} as Metrics)
const formCom = ref()
const currTab = ref('overview')
const queryTab = computed(() => route.query.tab?.toString())
if (queryTab.value) {
  currTab.value = queryTab.value
}

const type = computed(() => route.params.type.toString())
const currImg = computed(() => {
  if (type.value) {
    return getImg(`img/${type.value}.png`)
  }
  return ''
})
const { toggleAuthStatus } = useToggleAuthStatus()

const loadData = async () => {
  authzDetailLock.value = true
  try {
    configData.value = await loadAuthz(type.value)
  } catch (error) {
    //
  } finally {
    authzDetailLock.value = false
  }
}

const getAuthzMetrics = async () => {
  try {
    const data = await queryAuthzItemMetrics(type.value)
    authMetrics.value = data
  } catch (error) {
    //
  }
}

const updateEnable = () => {
  configData.value.enable = !configData.value.enable
  handleUpdate({ enable: configData.value.enable })
}
/**
 * @param authz has value when the action is update status
 */
const handleUpdate = async (authzData?: { enable?: boolean }) => {
  const enable = authzData
  let isVerified = true
  try {
    if (formCom.value) {
      await formCom.value.validate().catch(() => {
        isVerified = false
        jumpToErrorFormItem()
      })
    }
    if (!isVerified) {
      return
    }
    isSubmitting.value = true
    const { create } = useAuthzCreate()
    const data: any = checkNOmitFromObj(create(configData.value, type.value))
    if (enable !== undefined) {
      await toggleAuthStatus(data, 'authz')
      getAuthzMetrics()
    } else {
      await updateAuthz(type.value, data)
      ElMessage.success(t('Base.updateSuccess'))
    }
    enable === undefined ? router.push({ name: 'authorization' }) : loadData()
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteAuthz(type.value))
    ElMessage.success(t('Base.deleteSuccess'))
    router.push({ name: 'authorization' })
  } catch (error) {
    //
  }
}

const initData = async () => {
  await loadData()
  getAuthzMetrics()
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss">
@use './style/auth.scss';
</style>
