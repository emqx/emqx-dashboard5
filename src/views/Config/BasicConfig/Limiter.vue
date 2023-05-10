<template>
  <div class="limiter app-wrapper">
    <el-card class="config-card">
      <schema-form
        ref="SchemaFormCom"
        :according-to="{ path: '/configs/limiter' }"
        type="limiter"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :label-width="state.lang === 'zh' ? 140 : 236"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getLimiters, updateLimiters } from '@/api/config'
import SchemaForm from '@/components/SchemaForm'
import { Limiter } from '@/types/config'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const configs = ref<Limiter>({} as Limiter)
const saveLoading = ref(false)
const configLoading = ref(false)

const { t } = useI18n()
const { state } = useStore()

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getLimiters()
    configs.value = res
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const handleSave = async (val: Limiter) => {
  saveLoading.value = true
  try {
    const data = { ...val }
    await updateLimiters(data)
    ElMessage.success(t('Base.updateSuccess'))
    loadData()
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}

loadData()
</script>
<style lang="scss">
.limiter {
  .card-client-rate {
    width: 60%;
    margin-left: -1px;
    margin-top: 20px;
    .part-header {
      margin-top: 0;
      padding-left: 12px + 12px + 4px;
    }
    .el-card__body {
      padding-left: 0;
      padding-right: 0;
    }
    .el-form-item {
      padding: 8px 12px 12px;
    }
    .col-custom-width {
      flex-basis: 91.6%;
      max-width: 91.6%;
    }
  }
  .desc-config {
    margin: 16px 0;
    padding-left: 12px + 4px;
  }
}
</style>
