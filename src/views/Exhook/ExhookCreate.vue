<template>
  <div class="exhook-create app-wrapper">
    <detail-header :item="{ name: tl('addExhook'), path: '/exhook' }" />
    <el-card class="app-card exhook-create-card">
      <ExhookForm ref="formCom" v-model="formData" />
    </el-card>
    <el-card class="ft-card">
      <el-button @click="cancel">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button
        type="primary"
        :disabled="!$hasPermission('post')"
        :loading="isSubmitting"
        @click="submit"
      >
        {{ $t('Base.create') }}
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createExhook } from '@/api/exhook'
import DetailHeader from '@/components/DetailHeader.vue'
import useHandleExhookItem from '@/hooks/Exhook/useHandleExhookItem'
import useSSL from '@/hooks/useSSL'
import { ExhookFailedAction } from '@/types/enum'
import { ExhookFormForCreate } from '@/types/systemModule'
import { ElMessage } from 'element-plus'
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ExhookForm from './components/ExhookForm.vue'

const router = useRouter()
const { t } = useI18n()
const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const { createSSLForm, handleSSLDataBeforeSubmit } = useSSL()

const createRawExhookForm = (): ExhookFormForCreate => ({
  auto_reconnect: '60s',
  enable: false,
  failed_action: ExhookFailedAction.Deny,
  name: '',
  pool_size: 16,
  request_timeout: '5s',
  ssl: createSSLForm(),
  url: '',
})

const formCom = ref()
const formData: Ref<ExhookFormForCreate> = ref(createRawExhookForm())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'exhook' })

const { handleExhookBeforeSubmit } = useHandleExhookItem()
const submit = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await createExhook({
      ...handleExhookBeforeSubmit(formData.value),
      ssl: handleSSLDataBeforeSubmit(formData.value.ssl),
    })
    ElMessage.success(tl('createSuccess', 'Base'))
    router.push({ name: 'exhook' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.exhook-create-form {
  width: 75%;
  margin-bottom: 36px;
}
.form-sub-block {
  margin-bottom: 8px;
}
</style>
