<template>
  <div class="exhook-create app-wrapper">
    <detail-header :item="{ name: tl('addExhook'), path: '/exhook' }" />
    <el-card class="app-card exhook-create-card">
      <ExhookForm ref="formCom" v-model="formData" />
      <div class="exhook-create-ft">
        <el-button @click="cancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submit">
          {{ $t('Base.create') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ExhookForm from './components/ExhookForm.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { ExhookFormForCreate } from '@/types/systemModule'
import { createExhook } from '@/api/exhook'
import { ExhookFailedAction } from '@/types/enum'

const router = useRouter()
const { t } = useI18n()
const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const createRawExhookForm = (): ExhookFormForCreate => ({
  auto_reconnect: '60s',
  enable: false,
  failed_action: ExhookFailedAction.Deny,
  name: '',
  pool_size: 16,
  request_timeout: '5s',
  ssl: {
    cacertfile: '',
    certfile: '',
    enable: false,
    keyfile: '',
  },
  url: '',
})

const formCom = ref()
const formData: Ref<ExhookFormForCreate> = ref(createRawExhookForm())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'exhook' })

const submit = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await createExhook(formData.value)
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
  width: 70%;
  margin-bottom: 36px;
}
.form-sub-block {
  margin-bottom: 8px;
}
</style>
