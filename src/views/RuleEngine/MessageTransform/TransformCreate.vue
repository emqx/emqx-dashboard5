<template>
  <div class="transform-create app-wrapper">
    <detail-header
      :item="{ name: t('components.message-transform-create'), routeName: 'message-transform' }"
    />
    <el-card class="app-card">
      <TransformForm ref="formCom" v-model="formData" />
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
import { postMessageTransform } from '@/api/messageTransformation'
import DetailHeader from '@/components/DetailHeader.vue'
import useI18nTl from '@/hooks/useI18nTl'
import type { MessageTransform } from '@/types/typeAlias'
import { MessageTransformFailureAction, MessageTransformLogLevel } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import TransformForm from './components/TransformForm.vue'

const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const createRawTransformForm = (): MessageTransform => ({
  name: '',
  description: '',
  topics: ['t/#'],
  operations: [{ key: '', value: '' }],
  log_failure: { level: MessageTransformLogLevel.warning },
  failure_action: MessageTransformFailureAction.drop,
  payload_decoder: { type: '' },
  payload_encoder: { type: '' },
})

const formCom = ref()
const formData: Ref<MessageTransform> = ref(createRawTransformForm())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'message-transform' })

const submit = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await postMessageTransform(formData.value)
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'message-transform' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.message-transform-form {
  width: 70%;
  margin-bottom: 36px;
}
</style>
