<template>
  <div class="limiter app-wrapper">
    <el-card class="app-card allow-overflow">
      <schema-form
        need-rules
        type="limiter"
        ref="SchemaFormCom"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :data-handler="addPattern"
        :according-to="{ path: '/configs/limiter' }"
        :form-props="{ labelWidth: state.lang === 'zh' ? 140 : 236 }"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getLimiters, updateLimiters } from '@/api/config'
import SchemaForm from '@/components/SchemaForm'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import { Limiter } from '@/types/config'
import { Properties } from '@/types/schemaForm'

import { checkNOmitFromObj, customValidate } from '@/common/tools'
import useLimiter from '@/hooks/Config/useLimiter'

const configs = ref<Limiter>({} as Limiter)
const saveLoading = ref(false)
const configLoading = ref(false)

const SchemaFormCom = ref()

const { t } = useI18n()
const { state } = useStore()

const { limiterRules, limiterPlaceholderMap } = useLimiter()
const addPattern = (data: { components: Properties; rules: SchemaRules }) => {
  const { components } = data
  Object.entries(components).forEach(([key, value]) => {
    if (key in limiterPlaceholderMap) {
      value.default = limiterPlaceholderMap[key]
    }
  })
  return { components: components, rules: limiterRules }
}

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
  try {
    await customValidate(SchemaFormCom.value)
    saveLoading.value = true
    const data = checkNOmitFromObj({ ...val }) as Limiter
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
