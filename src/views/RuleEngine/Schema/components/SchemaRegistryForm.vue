<template>
  <el-form
    ref="FormCom"
    label-position="top"
    class="schema-registry-form"
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
          <template #label>
            <FormItemLabel
              label="Schema"
              :desc="selectedJSON ? tl('JSONSchemaVersionTip') : undefined"
              desc-marked
              popper-class="is-wider"
            />
          </template>
          <div class="monaco-container">
            <Monaco
              v-model="schemaForm.source"
              :id="createRandomString()"
              :lang="selectedJSON ? 'json' : 'plaintext'"
              @blur="onBlurChanged"
            />
          </div>
        </el-form-item>
        <el-button
          v-if="selectedJSON"
          class="btn-schema"
          type="primary"
          plain
          @click="openJSONSchemaDialog"
        >
          {{ tl('generateFromJSON') }}
        </el-button>
      </el-col>
    </el-row>
    <JSONSchemaGeneratorDialog v-model="showJSONSchemaDialog" @submit="updateSchema" />
  </el-form>
</template>

<script lang="ts" setup>
import { createRandomString } from '@/common/tools'
import FormItemLabel from '@/components/FormItemLabel.vue'
import Monaco from '@/components/Monaco.vue'
import useSchemaType from '@/hooks/Rule/schema/useSchemaType'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import { SchemaRegistry } from '@/types/rule'
import ajv from 'ajv'
import draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  ref,
} from 'vue'
import JSONSchemaGeneratorDialog from './JSONSchemaGeneratorDialog.vue'

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

const { createRequiredRule, createCommonIdRule } = useFormRules()
const rules = ref({
  name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()],
  type: createRequiredRule(tl('type'), 'select'),
  source: [
    ...createRequiredRule('Schema'),
    {
      validator(rule, value, callback) {
        if (schemaForm.value.type !== SchemaRegistryType.JSON) {
          callback()
          return
        }
        try {
          const ajvInstance = new ajv({ validateSchema: false })
          ajvInstance.addMetaSchema(draft6MetaSchema)
          ajvInstance.compile(JSON.parse(value))
          callback()
        } catch (e) {
          console.error(e)
          callback(new Error(tl('invalidJSONSchema')))
        }
      },
    },
  ],
})

const validate = () => FormCom.value.validate()

const onBlurChanged = () => {
  if (!schemaForm.value.source) {
    FormCom.value.validateField('source')
  } else {
    FormCom.value.clearValidate('source')
  }
}

const selectedJSON = computed(() => {
  return schemaForm.value.type === SchemaRegistryType.JSON
})

const showJSONSchemaDialog = ref(false)
const openJSONSchemaDialog = () => {
  showJSONSchemaDialog.value = true
}

const updateSchema = (schema: string) => {
  schemaForm.value.source = schema
}

defineExpose({ validate })
</script>

<style lang="scss" scoped>
.schema-registry-form {
  .btn-schema {
    margin-bottom: 20px;
  }
}
</style>
