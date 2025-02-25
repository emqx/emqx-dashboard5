<template>
  <div class="app-wrapper">
    <detail-header
      :item="{ name: `${getBackendLabel(backend)} ${t('Base.setting')}`, routeName: 'sso' }"
    />
    <el-card class="app-card sso-detail" v-loading="isLoading">
      <el-row>
        <el-col :md="18" :lg="15" v-if="formCom">
          <component ref="FormCom" :is="formCom" v-model="formData" :is-edit="!!baseInfo" />
        </el-col>
      </el-row>
      <el-row class="schema-form">
        <el-col class="btn-col" :span="24" :style="store.getters.configPageBtnStyle">
          <el-button
            type="primary"
            :disabled="!$hasPermission('put')"
            :loading="isSubmitting"
            @click="saveConfig"
          >
            {{ $t('Base.update') }}
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getSSOBackend, putSSOBackend, getSSOList } from '@/api/sso'
import {
  DashboardSsoBackendStatus,
  DashboardSsoBackendStatusBackend,
  EmqxDashboardSsoLdapLdap,
} from '@/types/schemas/dashboardSingleSignOn.schemas'
import LDAPForm from './components/SSOForm/LDAPForm.vue'
import SAMLForm from './components/SSOForm/SAMLForm.vue'
import OIDCForm from './components/SSOForm/OIDCForm.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const { t } = useI18nTl('General')
const { getBackendLabel } = useSSOBackendsLabel()

const backend: ComputedRef<any> = computed(() => route.params.backend.toString())
const baseInfo: Ref<undefined | DashboardSsoBackendStatus> = ref(undefined)
const { createRawForm, handleFormDataBeforeSubmit } = useSSODetail()

const FormCom = ref()
const formComMap: Record<string, Component> = {
  [DashboardSsoBackendStatusBackend.ldap]: LDAPForm,
  [DashboardSsoBackendStatusBackend.saml]: SAMLForm,
  [DashboardSsoBackendStatusBackend.oidc]: OIDCForm,
}

const formCom = computed(() =>
  backend.value in formComMap ? formComMap[backend.value] : undefined,
)

const formData: Ref<any> = ref({})
const isLoading = ref(false)

const getBaseInfo = async () => {
  try {
    const createdList = await getSSOList()
    baseInfo.value = createdList.find((item) => item.backend === backend.value)
  } catch (error) {
    //
  }
}

const initForm = async () => {
  try {
    isLoading.value = true
    await getBaseInfo()
    if (baseInfo.value) {
      const config = await getSSOBackend(backend.value)
      formData.value = {
        ...config,
        enable: !baseInfo.value.enable ? true : config.enable,
      }
    } else {
      formData.value = createRawForm(backend.value)
    }
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
initForm()

const isSubmitting = ref(false)
const saveConfig = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value?.validate?.()
    await putSSOBackend(
      backend.value,
      handleFormDataBeforeSubmit(backend.value, formData.value) as EmqxDashboardSsoLdapLdap,
    )
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'sso' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.sso-detail {
  .info-idp-block {
    margin-bottom: 24px;
  }
  .info-desc {
    margin-bottom: 16px;
    font-size: 12px;
    color: var(--color-text-secondary);
    opacity: 0.8;
  }
  $padding-vertical: 8px;
  .info-item {
    position: relative;
    padding: $padding-vertical 48px $padding-vertical 180px;
    line-height: 24px;
    border-radius: 4px;
    background: var(--color-bg-main);
    &.is-first {
      margin-bottom: 8px;
    }
  }
  .info-label {
    position: absolute;
    left: 0;
    top: 0;
    width: 180px;
    padding: $padding-vertical 16px;
    font-size: 14px;
    text-align: right;
    color: var(--color-text-primary);
  }
  .info-value {
    overflow: hidden;
    margin: 0;
    color: var(--color-text-primary);
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }
  .btn-copy {
    position: absolute;
    right: 24px;
    top: $padding-vertical;
    &.el-button.is-link:focus,
    &.el-button.is-link:not(.is-disabled):active {
      color: inherit;
    }
  }
}
</style>
