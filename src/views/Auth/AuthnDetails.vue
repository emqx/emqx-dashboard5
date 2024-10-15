<template>
  <div class="auth auth-details">
    <div class="detail-top">
      <detail-header
        v-if="!gateway"
        :item="{ name: titleMap[currBackend], path: '/authentication' }"
      >
        <template #content>
          <div class="vertical-align-center">
            <img :src="currImg" height="40" />
            <p class="block-title">{{ titleMap[currBackend] }}</p>
            <AuthItemStatus is-tag :metrics="authMetrics" />
            <el-tag type="info" class="section-status">
              {{ getLabelByValue(configData.mechanism) }}
            </el-tag>
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
      <div v-else class="section-header embed-gateway">
        <h2>{{ titleMap[currBackend] }}</h2>
        <div>
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
        </div>
      </div>
    </div>
    <el-tabs class="detail-tabs" v-model="currTab" v-loading.lock="authnDetailLock">
      <div :class="{ 'app-wrapper': !gateway }">
        <el-tab-pane v-if="!gateway" name="overview" :label="$t('Base.overview')" :lazy="true">
          <AuthItemOverview :metrics="authMetrics" type="authn" lazy />
        </el-tab-pane>
        <el-tab-pane :label="$t('Base.setting')" name="settings" :lazy="true">
          <el-card class="app-card" :shadow="gateway ? 'never' : 'always'">
            <template v-if="configData.mechanism !== 'jwt'">
              <database-config
                v-if="['mysql', 'postgresql', 'mongodb', 'redis'].includes(currBackend)"
                ref="formCom"
                :database="currBackend"
                v-model="configData"
                auth-type="authn"
                is-edit
              />
              <http-config
                auth-type="authn"
                v-else-if="currBackend === 'http'"
                ref="formCom"
                v-model="configData"
                is-edit
              />
              <built-in-config
                v-else-if="currBackend === 'built_in_database'"
                ref="formCom"
                auth-type="authn"
                :type="configData.mechanism"
                v-model="configData"
              />
              <ldap-config
                auth-type="authn"
                v-else-if="currBackend === 'ldap'"
                v-model="configData"
                is-edit
                ref="formCom"
              />
            </template>
            <jwt-config ref="formCom" v-else v-model="configData" is-edit />
            <el-button @click="$router.push('/authentication')" v-if="!gateway">
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
        <el-tab-pane
          v-if="currBackend === 'built_in_database'"
          :label="$t('Auth.userConfig')"
          :lazy="true"
          name="users"
        >
          <authn-manager
            :field="(configData as AuthenticationBuiltInDbConfig).user_id_type"
            :gateway="gateway"
          />
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { deleteAuthn, loadAuthn, queryAuthnItemMetrics, updateAuthn } from '@/api/auth'
import { checkNOmitFromObj, getImg, jumpToErrorFormItem } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useAuth from '@/hooks/Auth/useAuth'
import useAuthnCreate from '@/hooks/Auth/useAuthnCreate'
import useBuiltInDataUpdateTip from '@/hooks/Auth/useBuiltInDataUpdateTip'
import { getPasswordHashAlgorithmObj } from '@/hooks/Auth/usePasswordHashAlgorithmData'
import useToggleAuthStatus from '@/hooks/Auth/useToggleAuthStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { DatabaseAndServer, Metrics } from '@/types/auth'
import { LDAPAuthMethod } from '@/types/enum'
import { AuthenticationBuiltInDbConfig, AuthenticationConfig } from '@/types/typeAlias'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import { isFunction, isUndefined, omit } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthItemOverview from './components/AuthItemOverview.vue'
import AuthItemStatus from './components/AuthItemStatus.vue'
import AuthnManager from './components/AuthnManager.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import LdapConfig from './components/LdapConfig.vue'
import { useAuthnMechanismType } from '@/hooks/Auth/useAuthnType'

const props = defineProps<{
  gatewayInfo?: Record<string, any> | boolean
  updateFunc?: (data: any) => Promise<void>
  deleteFunc?: () => Promise<void>
  gateway?: string
}>()

const route = useRoute()
const router = useRouter()
const { t, tl } = useI18nTl('Auth')
const isSubmitting = ref(false)
const authnDetailLock = ref(false)
const currTab = ref(props.gateway ? 'settings' : 'overview')
const id = computed(() => route.params.id.toString())
const queryTab = computed(() => route.query.tab?.toString())

if (queryTab.value) {
  currTab.value = queryTab.value
}

const configData = ref<AuthenticationConfig>({
  ssl: { enable: false },
} as AuthenticationConfig)
const authMetrics = ref<Metrics>({} as Metrics)

const currBackend = ref<DatabaseAndServer | 'built_in_database'>('' as DatabaseAndServer)

const formCom = ref()

const currImg = computed(() => {
  if (currBackend.value) {
    return getImg(`img/${currBackend.value}.png`)
  }
  return ''
})

const { getLabelByValue } = useAuthnMechanismType()

const { toggleAuthStatus } = useToggleAuthStatus()

const setPassWordBasedFieldsDefaultValue = () => {
  if (
    configData.value.mechanism === 'password_based' &&
    'password_hash_algorithm' in configData.value &&
    configData.value.password_hash_algorithm
  ) {
    configData.value.password_hash_algorithm = {
      ...getPasswordHashAlgorithmObj().password_hash_algorithm,
      ...configData.value.password_hash_algorithm,
    } as any
  }
}

const { factory } = useAuthnCreate()
const fillDefaultValue = (data: any) => {
  if (currBackend.value === 'ldap') {
    const { method: defaultMethod } = factory('password_based', 'ldap')
    data.method = { ...defaultMethod, ...data.method }
  }
  return data
}

const handlingDataCompatible = (data: any) => {
  if (currBackend.value === 'ldap') {
    const { password_attribute, is_superuser_attribute, bind_password } = data
    if (!isUndefined(password_attribute) && !isUndefined(is_superuser_attribute)) {
      data.method = {
        password_attribute,
        is_superuser_attribute,
        type: LDAPAuthMethod.Hash,
      }
      return omit(data, ['password_attribute', 'is_superuser_attribute'])
    }
    if (!isUndefined(bind_password)) {
      data.method = { bind_password, type: LDAPAuthMethod.Bind }
      return omit(data, 'bind_password')
    }
    if (isUndefined(data.method)) {
      data.method = { type: LDAPAuthMethod.Hash }
      return data
    }
  }
  return data
}

const loadData = async () => {
  try {
    authnDetailLock.value = true
    const res = props.gatewayInfo || (await loadAuthn(id.value))
    if (!res) {
      return
    }
    currBackend.value = res.backend || res.mechanism
    configData.value = fillDefaultValue(handlingDataCompatible(res))
    setRawSetting(configData.value as any)
    setPassWordBasedFieldsDefaultValue()
  } catch (error) {
    //
  } finally {
    authnDetailLock.value = false
  }
}

const getAuthnMetrics = async () => {
  try {
    const data = await queryAuthnItemMetrics(id.value)
    authMetrics.value = data
  } catch (error) {
    //
  }
}

const { titleMap } = useAuth()

const updateAuthnBelongGateway = async (data: any, enable: boolean) => {
  if (enable !== undefined) {
    if (enable) {
      await MB.confirm(tl('disableAuthnTip'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
    }
    data.enable = !enable
  }
  if (props.updateFunc && isFunction(props.updateFunc)) {
    await props.updateFunc(data)
  }
}

const { setRawSetting, compareData } = useBuiltInDataUpdateTip()
const updateEnable = () => {
  configData.value.enable = !configData.value.enable
  handleUpdate({ enable: configData.value.enable })
}

const handleUpdate = async (authnData?: { enable: boolean } & unknown) => {
  const { enable } = authnData || {}
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
    const { create } = useAuthnCreate()
    const { id } = configData.value
    const backend = 'backend' in configData.value ? configData.value.backend : undefined
    const data = create(configData.value, backend, configData.value.mechanism)
    if (currBackend.value === 'built_in_database') {
      await compareData(data)
    }

    if (props.gateway) {
      updateAuthnBelongGateway(data, Boolean(enable))
    } else {
      if (enable !== undefined) {
        await toggleAuthStatus(checkNOmitFromObj({ ...data, id }) as any, 'authn')
        getAuthnMetrics()
      } else {
        await updateAuthn(id, checkNOmitFromObj(data))
        M.success(t('Base.updateSuccess'))
      }
      enable === undefined ? router.push({ name: 'authentication' }) : loadData()
    }
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  try {
    await MB.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    if (props.gateway && props.deleteFunc) {
      await props.deleteFunc()
    } else {
      await deleteAuthn(configData.value.id)
      M.success(t('Base.deleteSuccess'))
      router.push({ name: 'authentication' })
    }
  } catch (error) {
    //
  }
}

const initData = async () => {
  await loadData()
  if (!props.gatewayInfo) {
    getAuthnMetrics()
  }
}

watch(() => props.gatewayInfo, initData)

initData()
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
