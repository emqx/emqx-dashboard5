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
          <el-input
            v-model="schemaForm.description"
            :disabled="isEdit && isEditingProtobufBundle"
          />
        </el-form-item>
      </el-col>
      <template v-if="!fixedType">
        <el-col :span="8" />
        <el-col :span="8">
          <el-form-item :label="tl('type')" prop="type">
            <el-select v-model="schemaForm.type" :disabled="isEdit && isEditingProtobufBundle">
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
      <el-col :span="24" v-if="isProtobuf">
        <el-form-item :label="tl('creationMethod')">
          <el-radio-group v-model="protobufCreationMethod" :disabled="isEdit">
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
        <template v-if="isEdit && !isReplacingProtobufBundle">
          <el-col :span="16">
            <el-form-item class="path-view">
              <template #label>
                <span>{{ tl('protobufBundle') }}</span>
                <el-upload
                  :before-upload="setFile"
                  :show-file-list="false"
                  accept=".tar.gz,application/gzip"
                  :disabled="isUploading"
                >
                  <el-button>{{ tl('reuploadProtobufBundle') }}</el-button>
                </el-upload>
              </template>
              <el-input :model-value="`${t('Base.filePath')}: ${filePosition}`" disabled />
              <el-icon class="icon-copy" :size="18" @click="copyText(filePosition)">
                <DocumentCopy />
              </el-icon>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="tl('rootProtoFile')">
              <el-input :model-value="rootFileName" disabled readonly />
              <el-icon class="icon-copy" :size="18" @click="copyText(rootFileName)">
                <DocumentCopy />
              </el-icon>
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="16">
            <el-form-item :label="tl('protobufBundle')" prop="bundle" class="upload-item">
              <el-upload
                :before-upload="setFile"
                :show-file-list="false"
                accept=".tar.gz,application/gzip"
                :disabled="isUploading"
                class="file-input-upload"
              >
                <el-input :model-value="file?.name" readonly>
                  <template #suffix>
                    <el-button link type="primary">{{ t('Base.selectFile') }}</el-button>
                  </template>
                </el-input>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="tl('rootProtoFile')" prop="root_proto_file">
              <InputWithOptions
                v-model="(schemaForm as any).root_proto_file"
                :options="rootProtoFileOptions"
              />
            </el-form-item>
          </el-col>
        </template>
      </template>
    </el-row>
    <JSONSchemaGeneratorDialog v-model="showJSONSchemaDialog" @submit="updateSchema" />
  </el-form>
</template>

<script lang="ts" setup>
import { ProtobufCreationMethod, SchemaRegistryType } from '@/types/enum'
import {
  NormalSchemaRegistry,
  SchemaRegistryCreationForm,
  SchemaRegistryEditForm,
  SchemaRegistryProtobufBundleEditForm,
} from '@/types/rule'
import { ProtobufBundleSourceType, SchemaRegistryExternalHttp } from '@/types/typeAlias'
import { DocumentCopy } from '@element-plus/icons-vue'
import ajv from 'ajv'
import Ajv04 from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json'
import { UploadRawFile } from 'element-plus'
import HTTPSchemaRegistryParameters from './HTTPSchemaRegistryParameters.vue'
import JSONSchemaGeneratorDialog from './JSONSchemaGeneratorDialog.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SchemaRegistryEditForm | SchemaRegistryCreationForm>,
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

const schemaForm: WritableComputedRef<SchemaRegistryEditForm | SchemaRegistryCreationForm> =
  computed({
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
  bundle: createRequiredRule(tl('protobufBundle'), 'select'),
  root_proto_file: createRequiredRule(tl('rootProtoFile')),
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
    if (schemaForm.value.type !== SchemaRegistryType.Protobuf) {
      return ProtobufCreationMethod.Input
    }
    return schemaForm.value.protobuf_creation_method ?? ProtobufCreationMethod.Input
  },
  set(val) {
    if (schemaForm.value.type !== SchemaRegistryType.Protobuf) {
      return
    }
    schemaForm.value.protobuf_creation_method = val
  },
})
const isInputProtobuf = computed(
  () => isProtobuf.value && protobufCreationMethod.value === ProtobufCreationMethod.Input,
)
const isUploadProtobuf = computed(
  () => isProtobuf.value && protobufCreationMethod.value === ProtobufCreationMethod.UploadBundle,
)

const isEditingProtobufBundle = computed(
  () =>
    props.isEdit &&
    props.modelValue.type === SchemaRegistryType.Protobuf &&
    typeof props.modelValue.source === 'object' &&
    props.modelValue.source?.type === ProtobufBundleSourceType.bundle,
)

const showEditor = computed(() => !isProtobuf.value || !isProtobuf.value || isInputProtobuf.value)

const file = computed(() => (schemaForm.value as SchemaRegistryProtobufBundleEditForm).bundle)
const isUploading = ref(false)

const { getGzipRootFiles } = useGetRootFiles()
const rootProtoFileOptions = ref<string[]>([])
const setFile = async (f: UploadRawFile) => {
  if (schemaForm.value.type !== SchemaRegistryType.Protobuf) {
    return
  }
  schemaForm.value.bundle = f
  rootProtoFileOptions.value = await getGzipRootFiles(f)
  isReplacingProtobufBundle.value = true
  schemaForm.value.root_proto_file = ''
  return false
}

const { copyText } = useCopy()

const isReplacingProtobufBundle = ref(false)
const fileNameReg = /\/[^/]+$/
const filePosition = computed(() => {
  if (
    schemaForm.value.type !== SchemaRegistryType.Protobuf ||
    typeof schemaForm.value.source !== 'object'
  ) {
    return ''
  }
  if (isEditingProtobufBundle.value) {
    return schemaForm.value.source.root_proto_path?.replace(fileNameReg, '')
  }
  return ''
})
const rootFileName = computed(() => {
  if (isEditingProtobufBundle.value) {
    if (
      schemaForm.value.type !== SchemaRegistryType.Protobuf ||
      typeof schemaForm.value.source !== 'object'
    ) {
      return ''
    }
    const fileName = schemaForm.value.source.root_proto_path?.match(fileNameReg)?.[0]
    return fileName?.slice(1)
  }
  return ''
})

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
  .file-input-upload {
    width: 100%;
  }
  .upload-item {
    :deep(.el-upload) {
      width: 100%;
    }
  }
  .icon-copy {
    position: absolute;
    right: -24px;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 4px;
    cursor: pointer;
  }
  .path-view {
    :deep(.el-form-item__label) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>
