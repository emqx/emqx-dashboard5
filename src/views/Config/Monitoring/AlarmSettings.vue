<template>
  <div class="alarm-settings app-wrapper">
    <el-card class="config-card">
      <schema-form
        ref="SchemaFormCom"
        :according-to="{ path: '/configs/sysmon' }"
        type="sysmon"
        :form="configs"
        :btn-loading="saveLoading"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import { getSysMon, updateSysMon } from '@/api/config'
import { AlarmSettings } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { cloneDeep, isEqual } from 'lodash'

const configs = ref({})
const saveLoading = ref(false)
const { t } = useI18n()

let rawData: any = undefined
const SchemaFormCom = ref()
const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configs.value = await getSysMon()
    rawData = cloneDeep(configs.value)
  } catch (error) {
    //
  }
}
const reloading = () => {
  loadData()
}
const handleSave = async (val: AlarmSettings) => {
  saveLoading.value = true
  const data = { ...val }
  try {
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
