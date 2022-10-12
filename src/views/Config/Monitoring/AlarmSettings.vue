<template>
  <div class="alarm-settings app-wrapper">
    <el-card class="config-card">
      <schema-form
        :according-to="{ path: '/configs/sysmon' }"
        type="sysmon"
        :form="configs"
        :btn-loading="saveLoading"
        @save="handleSave"
      ></schema-form>
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

const configs = ref({})
const saveLoading = ref(false)
const { t } = useI18n()
const loadData = async () => {
  const res = await getSysMon()
  if (res) {
    configs.value = res
  }
}
const reloading = () => {
  loadData()
}
const handleSave = async (val: AlarmSettings) => {
  saveLoading.value = true
  const data = {
    ...val,
  }
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
