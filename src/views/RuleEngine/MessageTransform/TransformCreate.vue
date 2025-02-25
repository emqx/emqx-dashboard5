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
        <el-button type="primary" :disabled="!$hasPermission('post')" plain @click="openTest">
          {{ tl('preview') }}
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
  <TestDrawer :message-transform="formData" v-model="showTestDrawer" />
</template>

<script setup lang="ts">
import { postMessageTransform } from '@/api/messageTransformation'
import { SchemaRegistryType } from '@/types/enum'
import type { MessageTransform } from '@/types/typeAlias'
import { MessageTransformFailureAction, MessageTransformLogLevel } from '@/types/typeAlias'
import TestDrawer from './components/TestDrawer.vue'
import TransformForm from './components/TransformForm.vue'

const router = useRouter()
const { t, tl } = useI18nTl('RuleEngine')

const createRawTransformForm = (): MessageTransform => ({
  name: '',
  description: '',
  topics: ['t/#'],
  operations: [{ key: '', value: '' }],
  log_failure: { level: MessageTransformLogLevel.warning },
  failure_action: MessageTransformFailureAction.drop,
  payload_decoder: { type: SchemaRegistryType.JSON },
  payload_encoder: { type: SchemaRegistryType.JSON },
})

const formCom = ref()
const formData: Ref<MessageTransform> = ref(createRawTransformForm())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'message-transform' })

const showTestDrawer = ref(false)
const openTest = async () => {
  await formCom.value.validate()
  showTestDrawer.value = true
}

const { handleDataBeforeSubmit } = handleTransformData()
const submit = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await postMessageTransform(handleDataBeforeSubmit(formData.value))
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
  width: 80%;
  margin-bottom: 36px;
}
</style>
