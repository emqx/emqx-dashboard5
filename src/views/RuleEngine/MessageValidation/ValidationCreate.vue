<template>
  <div class="validation-create app-wrapper">
    <detail-header
      :item="{ name: t('components.message-validation-create'), routeName: 'message-validation' }"
    />
    <el-card class="app-card">
      <MessageValidationForm ref="formCom" v-model="formData" />
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
import { postMessageValidation } from '@/api/messageValidation'
import DetailHeader from '@/components/DetailHeader.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import type { MessageValidation } from '@/types/typeAlias'
import {
  MessageValidationFailureAction,
  MessageValidationLogLevel,
  MessageValidationStrategy,
} from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import MessageValidationForm from './components/MessageValidationForm.vue'

const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const createRawValidationForm = (): MessageValidation => ({
  name: '',
  description: '',
  topics: ['t/#'],
  strategy: MessageValidationStrategy.any_pass,
  checks: [{ type: SchemaRegistryType.Avro, schema: '' }],
  log_failure: { level: MessageValidationLogLevel.warning },
  failure_action: MessageValidationFailureAction.drop,
})

const formCom = ref()
const formData: Ref<MessageValidation> = ref(createRawValidationForm())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'message-validation' })

const submit = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await postMessageValidation(formData.value)
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'message-validation' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.message-validation-form {
  width: 60%;
  margin-bottom: 36px;
}
</style>
