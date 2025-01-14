<template>
  <div class="app-wrapper">
    <detail-header
      :item="{ name: `${method.toUpperCase()} ${t('Base.setting')}`, routeName: 'mfa' }"
    />
    <el-card class="app-card mfa-detail" v-loading="isLoading">
      <el-row>
        <el-col :span="12" v-if="formCom">
          <component ref="FormCom" :is="formCom" v-model="formData" :is-edit="!!baseInfo" />
        </el-col>
      </el-row>
      <el-row class="mfa-form">
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
import { getMfaList, postMfa } from '@/api/systemModule'
import DetailHeader from '@/components/DetailHeader.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { MfaMethod, type MfaTotpConfig } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import TOTPForm from './components/MFAForm/TOTPForm.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const { t } = useI18nTl('General')

const method: ComputedRef<any> = computed(() => route.params.method.toString())
const baseInfo: Ref<undefined | MfaTotpConfig> = ref(undefined)

const createRawForm = () => {
  return {
    enable: true,
    interval_length: 30,
    method: MfaMethod.totp,
    token_length: 6,
  }
}

const FormCom = ref()
const formComMap: Record<string, Component> = {
  [MfaMethod.totp]: TOTPForm,
}

const formCom = computed(() => (method.value in formComMap ? formComMap[method.value] : undefined))

const formData: Ref<any> = ref({})
const isLoading = ref(false)

const getBaseInfo = async () => {
  try {
    const createdList = await getMfaList()
    baseInfo.value = createdList.find((item) => item.method === method.value)
  } catch (error) {
    //
  }
}

const initForm = async () => {
  try {
    isLoading.value = true
    await getBaseInfo()
    if (baseInfo.value) {
      formData.value = {
        ...cloneDeep(baseInfo.value),
        enable: !baseInfo.value.enable ? true : baseInfo.value.enable,
      }
    } else {
      formData.value = createRawForm()
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
    await postMfa(formData.value)
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'mfa' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
