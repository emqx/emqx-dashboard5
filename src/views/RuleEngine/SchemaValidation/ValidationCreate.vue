<template>
  <div class="validation-create app-wrapper">
    <detail-header
      :item="{ name: t('components.schema-validation-create'), routeName: 'schema-validation' }"
    />
    <el-card class="app-card">
      <SchemaValidationForm ref="formCom" v-model="formData" />
      <div>
        <el-button @click="cancel">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ t('Base.create') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { postSchemaValidation } from '@/api/schemaValidation'
import DetailHeader from '@/components/DetailHeader.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import type { SchemaValidation } from '@/types/typeAlias'
import {
  SchemaValidationFailureAction,
  SchemaValidationLogLevel,
  SchemaValidationStrategy,
} from '@/types/typeAlias'

import SchemaValidationForm from './components/SchemaValidationForm.vue'

const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const createRawValidationForm = (): SchemaValidation => ({
  name: '',
  description: '',
  topics: ['t/#'],
  strategy: SchemaValidationStrategy.any_pass,
  checks: [{ type: SchemaRegistryType.Avro, schema: '' }],
  log_failure: { level: SchemaValidationLogLevel.warning },
  failure_action: SchemaValidationFailureAction.drop,
})

const formCom = ref()
const formData: Ref<SchemaValidation> = ref(createRawValidationForm())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'schema-validation' })

const submit = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await postSchemaValidation(formData.value)
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'schema-validation' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.message-validation-form {
  width: 70%;
  margin-bottom: 36px;
}
</style>
