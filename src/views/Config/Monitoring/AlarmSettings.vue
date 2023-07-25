<template>
  <div class="alarm-settings app-wrapper">
    <el-card class="app-card">
      <schema-form
        ref="SchemaFormCom"
        type="sysmon"
        :according-to="{ path: '/configs/sysmon' }"
        :form="configs"
        :btn-loading="saveLoading"
        :label-width="state.lang === 'zh' ? 228 : 360"
        :record-loading="configLoading"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getSysMon, updateSysMon } from '@/api/config'
import { customValidate } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { AlarmSettings } from '@/types/config'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const configs = ref({})
const saveLoading = ref(false)
const configLoading = ref(false)
const { state } = useStore()
const { t } = useI18n()

let rawData: any = undefined
const SchemaFormCom = ref()
const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    configs.value = await getSysMon()
    rawData = cloneDeep(configs.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}
const reloading = () => {
  loadData()
}
const handleSave = async (val: AlarmSettings) => {
  try {
    await customValidate(SchemaFormCom.value)
    saveLoading.value = true
    const data = { ...val }
    await updateSysMon(data)
    ElMessage.success(t('Base.updateSuccess'))
    reloading()
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}
loadData()
</script>

<style lang="scss"></style>
