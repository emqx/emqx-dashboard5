<template>
  <el-dialog
    v-model="showDialog"
    width="480px"
    class="common-dialog copy-bridge-name-dialog"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form
      ref="FormCom"
      label-width="90px"
      label-position="right"
      :rules="rules"
      :model="record"
      @keyup.enter.prevent="submit"
    >
      <el-form-item prop="name">
        <el-input v-model="record.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">
          {{ t('Base.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const { t } = useI18nTl('Flow')

const FormCom = ref()

const record = ref({ name: '', desc: '' })

const { createRequiredRule, createCommonIdRule } = useFormRules()
const rules = { name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()] }

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const submit = async () => {
  try {
    await FormCom.value.validate()
    emit('save', record.value.name)
    showDialog.value = false
  } catch (error) {
    //
  }
}
</script>
