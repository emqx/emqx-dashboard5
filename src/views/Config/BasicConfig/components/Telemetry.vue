<template>
  <div class="telemetry">
    <el-form class="schema-form" :model="configs" label-position="top">
      <el-row class="telemetry-form">
        <el-col :span="16">
          <el-form-item :label="$t('BasicConfig.enableTelemetry')">
            <p class="item-desc">{{ $t('BasicConfig.telemetryTip') }}</p>
            <el-switch v-model="configs.enable"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" @click="handleSave" :loading="saveLoading">
            {{ $t('Base.save') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { getTeleStatus, updateTeleStatus } from '@/api/config'
import { TeleStatus } from '@/types/config'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Telemetry',
  setup() {
    const configs = ref<TeleStatus>({
      enable: true,
    })
    const saveLoading = ref(false)
    const { t } = useI18n()
    const loadData = async () => {
      const res = await getTeleStatus()
      if (res) {
        configs.value = res
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async () => {
      saveLoading.value = true
      const data = {
        ...configs.value,
      }
      try {
        await updateTeleStatus(data)
        ElMessage.success(t('Base.updateSuccess'))
        reloading()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    loadData()
    return {
      handleSave,
      configs,
      reloading,
      saveLoading,
    }
  },
})
</script>

<style lang="scss">
@import '@/style/schemaForm.scss';

.telemetry {
  .telemetry-form {
    .el-form-item {
      margin: 24px 0 32px 0;
    }
    .el-button {
      margin-left: 12px;
    }
  }
}
</style>
