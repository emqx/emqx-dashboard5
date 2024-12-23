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
      <div v-else class="section-header embed-gateway space-between">
        <h2>{{ titleMap[currBackend] }}</h2>
        <div>
          <el-tooltip
            :content="configData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              :disabled="!$hasPermission('put')"
              v-model="configData.enable"
              @change="updateEnable"
            />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              type="danger"
              :disabled="!$hasPermission('delete')"
              :icon="Delete"
              @click="handleDelete"
              plain
            >
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
            <template v-if="configData.mechanism !== 'jwt' && configData.mechanism !== 'cinfo'">
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
                :type="configData.mechanism"
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
              <kerberos-config
                v-else-if="currBackend === 'kerberos'"
                v-model="configData"
                ref="formCom"
              />
            </template>
            <c-info-config
              v-else-if="configData.mechanism === 'cinfo'"
              v-model="configData"
              ref="formCom"
            />
            <jwt-config ref="formCom" v-else v-model="configData" is-edit />
            <!-- <el-button @click="handleTest">
              {{ $t('Base.test') }}
            </el-button> -->
          </el-card>
          <el-card class="ft-card">
            <el-button @click="$router.push('/authentication')" v-if="!gateway">
              {{ $t('Base.cancel') }}
            </el-button>
            <el-button
              type="primary"
              :loading="isSubmitting"
              :disabled="!$hasPermission('put')"
              @click="handleUpdate"
            >
              {{ $t('Base.update') }}
            </el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          v-if="currBackend === 'built_in_database'"
          :label="$t('Auth.userConfig')"
          :lazy="true"
          name="users"
        >
          <authn-manager :field="configData.user_id_type" :gateway="gateway" />
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { isFunction, isUndefined, omit } from 'lodash'
import { queryAuthnItemMetrics, updateAuthn, deleteAuthn, loadAuthn } from '@/api/auth'
import { LDAPAuthMethod } from '@/types/enum'
import { checkNOmitFromObj, jumpToErrorFormItem } from '@/common/tools.ts'
import useI18nTl from '@/hooks/useI18nTl'
import useAuth from '@/hooks/Auth/useAuth'
import useAuthnCreate from '@/hooks/Auth/useAuthnCreate'
import useToggleAuthStatus from '@/hooks/Auth/useToggleAuthStatus'
import { getPasswordHashAlgorithmObj } from '@/hooks/Auth/usePasswordHashAlgorithmData.ts'
import useBuiltInDataUpdateTip from '@/hooks/Auth/useBuiltInDataUpdateTip.ts'
import DetailHeader from '@/components/DetailHeader.vue'
import AuthItemOverview from './components/AuthItemOverview.vue'
import AuthItemStatus from './components/AuthItemStatus.vue'
import DatabaseConfig from './components/DatabaseConfig.vue'
import HttpConfig from './components/HttpConfig.vue'
import BuiltInConfig from './components/BuiltInConfig.vue'
import JwtConfig from './components/JwtConfig.vue'
import AuthnManager from './components/AuthnManager.vue'
import LdapConfig from './components/LdapConfig.vue'
import KerberosConfig from './components/KerberosConfig.vue'
import CInfoConfig from './components/CInfoConfig.vue'
import useProcessAuthData from '@/hooks/Auth/useProcessAuthData'
import { useAuthnMechanismType } from '@/hooks/Auth/useAuthnType'

export default defineComponent({
  name: 'AuthnDetails',
  components: {
    DatabaseConfig,
    HttpConfig,
    BuiltInConfig,
    AuthnManager,
    JwtConfig,
    AuthItemOverview,
    AuthItemStatus,
    DetailHeader,
    LdapConfig,
    KerberosConfig,
    CInfoConfig,
  },
  props: {
    gatewayInfo: {
      type: [Object, Boolean],
      required: false,
      default: false,
    },
    updateFunc: {
      type: Function,
      required: false,
      default: () => ({}),
    },
    deleteFunc: {
      type: Function,
      required: false,
      default: () => ({}),
    },
    gateway: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const { t, tl } = useI18nTl('Auth')
    const refreshLoading = ref(false)
    const isSubmitting = ref(false)
    const authnDetailLock = ref(false)
    const currTab = ref(props.gateway ? 'settings' : 'overview')
    const id = computed(function () {
      return route.params.id
    })
    const queryTab = computed(() => {
      return route.query.tab
    })
    if (queryTab.value) {
      currTab.value = queryTab.value
    }
    const configData = ref({
      ssl: { enable: false },
    })
    const authMetrics = ref({})

    const currBackend = ref('')

    const formCom = ref()

    const currImg = computed(() => {
      if (currBackend.value) {
        return require(`@/assets/img/${currBackend.value}.png`)
      }
      return ''
    })

    const { toggleAuthStatus } = useToggleAuthStatus()

    const { getLabelByValue } = useAuthnMechanismType()

    const setPassWordBasedFieldsDefaultValue = () => {
      if (
        configData.value.mechanism === 'password_based' &&
        configData.value.password_hash_algorithm
      ) {
        configData.value.password_hash_algorithm = {
          ...getPasswordHashAlgorithmObj().password_hash_algorithm,
          ...configData.value.password_hash_algorithm,
        }
      }
    }

    const { factory } = useAuthnCreate()
    const fillDefaultValue = (data) => {
      if (currBackend.value === 'ldap') {
        const { method: defaultMethod } = factory('password_based', 'ldap')
        data.method = { ...defaultMethod, ...data.method }
      }
      if (currBackend.value === 'cinfo') {
        const { processCInfoUpdateConfig } = useProcessAuthData()
        data = processCInfoUpdateConfig(data)
      }
      return data
    }

    const handlingDataCompatible = (data) => {
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

    const loadData = async function () {
      try {
        authnDetailLock.value = true
        const res = props.gatewayInfo || (await loadAuthn(id.value))
        if (!res) {
          return
        }
        currBackend.value = res.backend || res.mechanism
        configData.value = fillDefaultValue(handlingDataCompatible(res))
        setRawSetting(configData.value)
        setPassWordBasedFieldsDefaultValue()
      } catch (error) {
        //
      } finally {
        authnDetailLock.value = false
      }
    }
    const handleRefresh = async () => {
      refreshLoading.value = true
      try {
        await getAuthnMetrics()
      } catch (error) {
        // ignore error
      } finally {
        refreshLoading.value = false
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

    const updateAuthnBelongGateway = async (data, enable) => {
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
    const updateEnable = function () {
      configData.value.enable = !configData.value.enable
      handleUpdate({ enable: configData.value.enable })
    }
    /**
     * @param authn has value when the action is update status
     */
    const handleUpdate = async function ({ enable }) {
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
        const data = create(configData.value, configData.value.backend, configData.value.mechanism)
        if (currBackend.value === 'built_in_database') {
          await compareData(data)
        }

        if (props.gateway) {
          updateAuthnBelongGateway(data, enable)
        } else {
          if (enable !== undefined) {
            await toggleAuthStatus(checkNOmitFromObj({ ...data, id }), 'authn')
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
    const handleDelete = async function () {
      try {
        await MB.confirm(t('Base.confirmDelete'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          confirmButtonClass: 'confirm-danger',
          type: 'warning',
        })
        if (props.gateway) {
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

    return {
      Delete,
      currBackend,
      refreshLoading,
      currTab,
      currImg,
      titleMap,
      getLabelByValue,
      configData,
      authMetrics,
      authnDetailLock,
      formCom,
      isSubmitting,
      handleUpdate,
      handleDelete,
      getAuthnMetrics,
      handleRefresh,
      updateEnable,
    }
  },
})
</script>

<style lang="scss">
@import './style/auth.scss';
</style>
