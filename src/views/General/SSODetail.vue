<template>
  <div class="app-wrapper">
    <detail-header
      :item="{ name: `${getBackendLabel(backend)} ${t('Base.setting')}`, routeName: 'SSO' }"
    />
    <el-card class="app-card sso-detail" v-loading="isLoading">
      <el-row>
        <el-col :md="15" :lg="12" v-if="formCom">
          <component ref="FormCom" :is="formCom" v-model="formData" />
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
import { getSSOBackend, putSSOBackend } from '@/api/sso'
import DetailHeader from '@/components/DetailHeader.vue'
import { useSSOBackendsLabel } from '@/hooks/SSO/useSSO'
import useSSODetail from '@/hooks/SSO/useSSODetail'
import useI18nTl from '@/hooks/useI18nTl'
import {
  DashboardSsoBackendStatusBackend,
  EmqxDashboardSsoLdapLdap,
} from '@/types/schemas/dashboardSingleSignOn.schemas'
import { ElMessage } from 'element-plus'
import { Component, ComputedRef, Ref, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import LDAPForm from './components/SSOForm/LDAPForm.vue'
import SAMLForm from './components/SSOForm/SAMLForm.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const { t } = useI18nTl('General')
const { getBackendLabel } = useSSOBackendsLabel()

const backend: ComputedRef<any> = computed(() => route.params.backend.toString())
const routeQuery = computed(() => ({
  isCreated: route.query.isCreated === true.toString(),
  enable: route.query.enable === true.toString(),
}))
const { createRawForm, handleFormDataBeforeSubmit } = useSSODetail()

const FormCom = ref()
const formComMap: Record<string, Component> = {
  [DashboardSsoBackendStatusBackend.ldap]: LDAPForm,
  [DashboardSsoBackendStatusBackend.saml]: SAMLForm,
}

const formCom = computed(() =>
  backend.value in formComMap ? formComMap[backend.value] : undefined,
)

const formData: Ref<any> = ref({})
const isLoading = ref(false)

const getConfig = async () => {
  try {
    isLoading.value = true
    const config = await getSSOBackend(backend.value)
    formData.value = {
      ...config,
      enable: !routeQuery.value.enable ? true : config.enable,
    }
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const initForm = () => {
  if (routeQuery.value.isCreated) {
    getConfig()
  } else {
    formData.value = createRawForm(backend.value)
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
    router.push({ name: 'SSO' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
