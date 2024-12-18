<template>
  <el-form
    ref="FormCom"
    label-width="200px"
    class="schema-registry-form"
    :rules="rules"
    :model="schemaForm"
  >
    <el-form-item prop="name">
      <template #label>
        <FormItemLabel :label="t('Base.name')" :desc="tl('schemaNameTip')" desc-marked />
      </template>
      <el-input v-model="schemaForm.name" :disabled="isEdit" />
    </el-form-item>

    <el-form-item :label="t('Base.note')" prop="description">
      <el-input v-model="schemaForm.description" />
    </el-form-item>

    <template v-if="!fixedType">
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
    </template>

    <el-form-item label="Schema" prop="source">
      <template #label>
        <span>Schema</span>
        <InfoTooltip v-if="selectedJSON" popper-class="is-wider">
          <template #content>
            <MarkdownContent :content="tl('JSONSchemaVersionTip')" />
          </template>
        </InfoTooltip>
      </template>
      <div class="monaco-container">
        <Monaco
          v-model="schemaForm.source"
          :id="createRandomString()"
          :lang="isJSONFormat ? 'json' : 'plaintext'"
          :custom-monaco-handler="disableCompletionItems"
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

    <JSONSchemaGeneratorDialog v-model="showJSONSchemaDialog" @submit="updateSchema" />
  </el-form>
</template>

<script lang="ts" setup>
import { createRandomString } from '@/common/tools'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import Monaco from '@/components/Monaco.vue'
import useSchemaType from '@/hooks/Rule/schema/useSchemaType'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import { SchemaRegistry } from '@/types/rule'
import ajv from 'ajv'
import Ajv04 from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onUnmounted,
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
  fixedType: {
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
          const schemaObj = JSON.parse(value)
          const { $schema } = schemaObj
          // do not support validate 03
          // now the default version is 06
          if (/03/.test($schema)) {
            callback()
            return
          }
          const isVersion06 = /06/.test($schema)
          const ajvInstance = isVersion06
            ? new ajv({ validateSchema: false })
            : new Ajv04({ validateSchema: false })
          addFormats(ajvInstance)

          if (isVersion06) {
            ajvInstance.addMetaSchema(draft6MetaSchema)
          }
          // remove all existed schemas..
          // otherwise it throws the magical `existed` error
          Object.keys(ajvInstance.schemas).forEach((key) => ajvInstance.removeSchema(key))
          ajvInstance.compile(JSON.parse(value))
          callback()
        } catch (e: any) {
          callback(new Error(e.toString()))
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

const selectedJSON = computed(() => schemaForm.value.type === SchemaRegistryType.JSON)

const isJSONFormat = computed(
  () => selectedJSON.value || schemaForm.value.type === SchemaRegistryType.Avro,
)

const showJSONSchemaDialog = ref(false)
const openJSONSchemaDialog = () => {
  showJSONSchemaDialog.value = true
}

const updateSchema = (schema: string) => {
  schemaForm.value.source = schema
  onBlurChanged()
}

/**
 * Stores pointers to reset `completionItems` when leaving the page.....
 */
let monacoTarget: any

const setCompletionItems = (value: boolean) => {
  const jsonDefault = monacoTarget?.languages?.json?.jsonDefaults
  if (jsonDefault?.setModeConfiguration) {
    jsonDefault.setModeConfiguration({
      ...jsonDefault.modeConfiguration,
      completionItems: value,
    })
  }
}
const disableCompletionItems = (monaco: any) => {
  monacoTarget = monaco
  setCompletionItems(false)
}

onUnmounted(() => {
  setCompletionItems(true)
})

defineExpose({ validate })
</script>

<style lang="scss" scoped>
.schema-registry-form {
  .btn-schema {
    margin-bottom: 20px;
  }
}
</style>
