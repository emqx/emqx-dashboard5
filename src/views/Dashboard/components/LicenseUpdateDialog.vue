<template>
  <el-dialog
    v-model="showDialog"
    align-center
    destroy-on-close
    width="600px"
    class="license-update-dialog"
    :title="startCase(tl('updateLicense'))"
  >
    <el-form
      ref="FormCom"
      label-position="top"
      :model="formData"
      :rules="formRules"
      @submit.prevent
    >
      <el-form-item :label="tl('key')" prop="key">
        <el-input v-model="formData.key" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit" :loading="isSubmitting">
          {{ t('Base.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog, ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue'
import { updateLicense } from '@/api/common'
import { startCase } from 'lodash'

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
    ElMessage.success(tl('uploadedSuccessfully'))
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
.license-update-dialog {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
