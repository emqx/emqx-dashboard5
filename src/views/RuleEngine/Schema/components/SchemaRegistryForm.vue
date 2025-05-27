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
      <template v-if="!fixedType">
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
      </template>
      <el-col :span="24" v-if="isProtobuf && !isEdit">
        <el-form-item :label="tl('creationMethod')">
          <el-radio-group v-model="protobufCreationMethod">
            <el-radio
              v-for="{ label, value } in protobufCreationMethodOpts"
              :key="value"
              :label="value"
              :value="value"
            >
              {{ label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="showEditor">
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
              v-model="(schemaForm as NormalSchemaRegistry).source"
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
      </el-col>
      <el-col :span="24" v-else-if="isExternalHTTP">
        <HTTPSchemaRegistryParameters
          v-model="(schemaForm as SchemaRegistryExternalHttp).parameters"
          :is-edit="isEdit"
        />
      </el-col>
      <template v-else-if="isUploadProtobuf">
        <el-col :span="24">
          <el-upload
            class="object-uploader"
            drag
            :before-upload="setFile"
            :show-file-list="false"
            accept=".zip,.tar,.tar.gz,.gz,.tgz,.tar.bz2,.tar.xz"
            :disabled="isUploading"
          >
            <div v-if="!file?.name">
              <el-icon class="icon-plus">
                <Plus class="icon-plus" />
              </el-icon>
              <span class="upload-placeholder">
                {{ t('Plugins.dragFilePlaceholder') }}
              </span>
            </div>
            <p class="file-name" v-else>{{ file.name }}</p>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('rootProtoFile')" prop="root_proto_file">
            <el-input v-model="schemaForm.root_proto_file" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <JSONSchemaGeneratorDialog v-model="showJSONSchemaDialog" @submit="updateSchema" />
  </el-form>
</template>

<script lang="ts" setup>
import { ProtobufCreationMethod, SchemaRegistryType } from '@/types/enum'
import { NormalSchemaRegistry, SchemaRegistry, SchemaRegistryCreationForm } from '@/types/rule'
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
import HTTPSchemaRegistryParameters from './HTTPSchemaRegistryParameters.vue'
import JSONSchemaGeneratorDialog from './JSONSchemaGeneratorDialog.vue'
import { SchemaRegistryExternalHttp, SchemaRegistryProtobufBundle } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { UploadRawFile } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SchemaRegistry | SchemaRegistryCreationForm>,
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

const schemaForm: WritableComputedRef<SchemaRegistry | SchemaRegistryCreationForm> = computed({
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
  'parameters.url': createRequiredRule('URL'),
})

const isExternalHTTP = computed(() => schemaForm.value.type === SchemaRegistryType.ExternalHTTP)
const isProtobuf = computed(() => schemaForm.value.type === SchemaRegistryType.Protobuf)

const validate = () => FormCom.value.validate()

const onBlurChanged = () => {
  if (isExternalHTTP.value) {
    return
  }
  if (!(schemaForm.value as NormalSchemaRegistry).source) {
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
  ;(schemaForm.value as NormalSchemaRegistry).source = schema
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

const protobufCreationMethodOpts = [
  { label: tl('input'), value: ProtobufCreationMethod.Input },
  { label: tl('uploadProtobufBundle'), value: ProtobufCreationMethod.UploadBundle },
]

const protobufCreationMethod = computed({
  get() {
    return schemaForm.value.protobuf_creation_method ?? ProtobufCreationMethod.Input
  },
  set(val) {
    schemaForm.value.protobuf_creation_method = val
  },
})
const isInputProtobuf = computed(
  () => isProtobuf.value && protobufCreationMethod.value === ProtobufCreationMethod.Input,
)
const isUploadProtobuf = computed(
  () => isProtobuf.value && protobufCreationMethod.value === ProtobufCreationMethod.UploadBundle,
)

const showEditor = computed(() => !isProtobuf.value || !isProtobuf.value || isInputProtobuf.value)

const file = computed(() => (schemaForm.value as SchemaRegistryProtobufBundle).bundle)
const isUploading = ref(false)

const setFile = (f: UploadRawFile) => {
  ;(schemaForm.value as SchemaRegistryProtobufBundle).bundle = f
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
