<template>
  <el-dialog
    v-model="showDialog"
    align-center
    destroy-on-close
    width="600px"
    class="license-reset-dialog"
    :title="startCase(tl('resetLicense'))"
  >
    <el-form
      ref="FormCom"
      label-position="top"
      :model="formData"
      :rules="formRules"
      @submit.prevent
    >
      <el-form-item :label="tl('key')" prop="key">
        <el-alert :closable="false" type="warning">
          <template v-slot:title>
            <div v-safe-html="tl('resetLicenseConfirm')"></div>
          </template>
        </el-alert>
        <el-input v-model="formData.key" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post') || confirmText !== formData.key"
          @click="submit"
          :loading="isSubmitting"
        >
          {{ t('Base.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { updateLicense } from '@/api/common'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'updated'])

const { tl, t } = useI18nTl('Dashboard')

const isSubmitting = ref(false)
const formData = reactive({ key: '' })
const confirmText = 'default'

const FormCom = ref()

const { createRequiredRule } = useFormRules()
const formRules = {
  key: createRequiredRule(tl('key')),
}

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (val) {
    formData.key = ''
    isSubmitting.value = false
  }
})

const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    await updateLicense(formData.key)
    ElMessage.success(t('Base.resetSuccess'))
    showDialog.value = false
    emit('updated')
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.license-reset-dialog {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      line-height: 1.5;
    }
    .el-alert {
      margin-bottom: 12px;
    }
  }
}
</style>
