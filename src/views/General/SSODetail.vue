<template>
  <div class="app-wrapper">
    <detail-header :item="{ name: t('components.sso'), routeName: 'SSO' }" />
    <el-card class="app-card sso-detail" v-loading="isLoading">
      <el-row>
        <el-col :md="15" :lg="12" v-if="formCom">
          <component ref="FormCom" :is="formCom" v-model="formData" />
        </el-col>
      </el-row>
      <el-row class="schema-form">
        <el-col class="btn-col" :span="24" :style="store.getters.configPageBtnStyle">
          <el-button type="primary" :loading="isSubmitting" @click="saveConfig">
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
import useI18nTl from '@/hooks/useI18nTl'
import { DashboardSsoBackendStatusBackend } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { ElMessage } from 'element-plus'
import { Component, ComputedRef, Ref, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import LDAPForm from './components/SSOForm/LDAPForm.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const { t } = useI18nTl('General')

const backend: ComputedRef<any> = computed(() => route.params.backend.toString())

const formComMap: Map<string, Component> = new Map([
  [DashboardSsoBackendStatusBackend.ldap, LDAPForm],
])
const formCom = computed(() =>
  formComMap.has(backend.value) ? formComMap.get(backend.value) : undefined,
)

const formData: Ref<any> = ref({})
const isLoading = ref(false)

const getConfig = async () => {
  try {
    isLoading.value = true
    formData.value = await getSSOBackend(backend.value)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getConfig()

const isSubmitting = ref(false)
const saveConfig = async () => {
  try {
    isSubmitting.value = true
    await putSSOBackend(backend.value, formData.value)
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'sso' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
