<template>
  <el-dialog
    v-model="showDialog"
    width="480px"
    custom-class="common-dialog dialog-with-divider"
    :close-on-click-modal="false"
    :title="tl('basicInfo')"
  >
    <el-form
      ref="FormCom"
      label-width="90px"
      label-position="right"
      :rules="rules"
      :model="record"
      @keyup.enter.prevent="submit"
    >
      <el-form-item :label="t('RuleEngine.name')" prop="name">
        <el-input v-model="record.name" :disabled="isEdit" />
      </el-form-item>
      <el-form-item :label="tl('description')" prop="desc">
        <el-input v-model="record.desc" />
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
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog } from 'element-plus'
import { PropType, computed, defineEmits, defineProps, ref, watch } from 'vue'
import useFormRules from '@/hooks/useFormRules'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object as PropType<{ name: string; desc: string }>,
    default: () => ({ name: '', desc: '' }),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { t, tl } = useI18nTl('Flow')

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

watch(showDialog, (val) => {
  if (val) {
    record.value = { ...props.data }
  } else {
    FormCom.value.clearValidate()
  }
})

const submit = async () => {
  try {
    await FormCom.value.validate()
    emit('save', record.value)
    showDialog.value = false
  } catch (error) {
    //
  }
}
</script>
