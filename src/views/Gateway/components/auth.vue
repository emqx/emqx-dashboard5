<template>
  <div>
    <div v-loading="loadingAuth">
      <div class="auth-create" v-if="!hasAuth">
        <el-button type="primary" :icon="Plus" @click="openAuthCreate()">
          {{ tl('addAuth') }}
        </el-button>
        <div class="tips">
          {{ tl('noAuthTips') }}
        </div>
      </div>
      <el-card v-else>
        <authn-details
          :gateway-info="hasAuth"
          :update-func="authUpdate"
          :delete-func="authDelete"
          :gateway="gname"
        />
      </el-card>
    </div>
    <el-dialog class="gateway-auth-dialog" v-model="createDialog" width="75%" destroy-on-close>
      <authn-create
        :gateway="gname"
        :cancel-func="cancelCreate"
        :create-func="authCreate"
        :disabled-databases="disabledDatabases"
        :disabled-mechanisms="disabledMechanism"
        :preset-authn-data="presetAuthnData"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { addGatewayAuth, deleteGatewayAuth, getGatewayAuth, updateGatewayAuth } from '@/api/gateway'
import { GATEWAY_DISABLED_DATABASES_MAP, GATEWAY_DISABLED_MECHANISM_MAP } from '@/common/constants'
import useI18nTl from '@/hooks/useI18nTl'
import { AuthnMechanismType, GatewayName } from '@/types/enum'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage as M } from 'element-plus'
import { cloneDeep, omit } from 'lodash'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthnCreate from '../../Auth/AuthnCreate.vue'
import AuthnDetails from '../../Auth/AuthnDetails.vue'

type AuthData = Record<string, any>

const presetAuthnDataMap: Record<string, any> = {
  [GatewayName.MQTT_SN]: [
    {
      mechanism: AuthnMechanismType.PasswordBased,
      subtype: 'http',
      data: { body: { clientid: '${clientid}' } },
    },
  ],
  [GatewayName.LwM2M]: [
    {
      mechanism: AuthnMechanismType.PasswordBased,
      subtype: 'http',
      data: { body: { endpoint_name: '${endpoint_name}' } },
    },
  ],
}

const createDialog = ref(false)
const hasAuth = ref(false)
const loadingAuth = ref(true)
const { t, tl } = useI18nTl('Gateway')
const route = useRoute()
const gname: GatewayName = String(route.params.name).toLowerCase() as GatewayName

const disabledMechanism = computed(() => GATEWAY_DISABLED_MECHANISM_MAP[gname] || [])
const disabledDatabases = computed(() => GATEWAY_DISABLED_DATABASES_MAP[gname] || [])

const presetAuthnData = computed(() => {
  return presetAuthnDataMap[gname] || undefined
})

const openAuthCreate = async () => {
  createDialog.value = true
}

const getAuthInfo = async () => {
  try {
    loadingAuth.value = true
    const res = await getGatewayAuth(gname)
    if (res === 204) {
      hasAuth.value = false
    } else if (res) {
      hasAuth.value = res
    }
  } catch (error) {
    //
  } finally {
    loadingAuth.value = false
  }
}

const cancelCreate = () => {
  createDialog.value = false
}

const authCreate = async (data: AuthData) => {
  try {
    const gData = {
      ...data.data,
      enable: true,
    }
    await addGatewayAuth(gname, gData)
    createDialog.value = false
    M.success(t('Base.createSuccess'))
    getAuthInfo()
  } catch (error) {
    return Promise.reject(error)
  }
}

const authUpdate = async (data: AuthData) => {
  try {
    await updateGatewayAuth(gname, omit(cloneDeep(data), ['id', 'chain_name']))
    M.success(t('Base.updateSuccess'))
    getAuthInfo()
  } catch (error) {
    //
  }
}

const authDelete = async () => {
  try {
    await deleteGatewayAuth(gname)
    hasAuth.value = false
    M.success(t('Base.deleteSuccess'))
  } catch (error) {
    //
  }
}

getAuthInfo()
</script>

<style lang="scss" scoped>
.auth-create {
  min-height: 200px;
  margin: 20px auto;
  padding-top: 32px;
  text-align: center;
  .tips {
    width: 60%;
    margin: 20px auto;
  }
}

.el-dialog__wrapper :deep(.el-dialog) {
  width: 75%;
}
</style>

<style lang="scss">
.gateway-auth-dialog {
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    .authn-create {
      padding-top: 8px;
    }
  }
}
</style>
