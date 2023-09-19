<template>
  <el-form
    ref="FormCom"
    label-position="top"
    class="schema-create-form"
    :rules="rules"
    :model="schemaForm"
    require-asterisk-position="right"
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item prop="name">
          <template #label>
            <FormItemLabel :label="t('Base.name')" :desc="tl('schemaNameTip')" desc-marked />
          </template>
          <el-input v-model="schemaForm.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="t('Base.note')" prop="description">
          <el-input v-model="schemaForm.description" />
        </el-form-item>
      </el-col>
      <el-col :span="8" />
      <el-col :span="8">
        <el-form-item :label="tl('type')" prop="type">
          <el-select v-model="schemaForm.type">
            <el-option
              v-for="{ label, value } in schemaTypeOpts"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Schema" prop="source">
          <div class="monaco-container">
            <Monaco v-model="schemaForm.source" :id="createRandomString()" lang="plaintext" />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { COMMON_ID_REG } from '@/common/constants'
import { createRandomString } from '@/common/tools'
import FormItemLabel from '@/components/FormItemLabel.vue'
import Monaco from '@/components/Monaco.vue'
import useSchemaType from '@/hooks/Rule/schema/useSchemaType'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistry } from '@/types/rule'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  ref,
} from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SchemaRegistry>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const schemaForm: WritableComputedRef<SchemaRegistry> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('RuleEngine')

const FormCom = ref()

const { schemaTypeOpts } = useSchemaType()

const { createRequiredRule } = useFormRules()
const rules = ref({
  name: [
    ...createRequiredRule(t('Base.name')),
    { pattern: COMMON_ID_REG, message: t('Base.commonIdError') },
  ],
  type: createRequiredRule(tl('type'), 'select'),
  source: createRequiredRule('Schema'),
})

const validate = () => FormCom.value.validate()

defineExpose({ validate })
</script>

<style scoped>
.el-form-item {
  margin-bottom: 24px;
}
</style>
