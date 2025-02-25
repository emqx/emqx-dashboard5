<template>
  <div class="file-trans app-wrapper with-padding-top">
    <el-card class="app-card">
      <schema-form
        ref="BasicFormCom"
        type="file_trans"
        :according-to="{ path: '/configs/file_transfer' }"
        :form="configs"
        :form-props="{ labelWidth }"
        :btn-loading="saveLoading"
        :record-loading="isPageLoading"
        :props-order-map="propsOrderMap.basic"
        :data-handler="handleSchemaToBasicInfo"
        :need-footer="false"
        @schema-loaded="isSchemaLoading = false"
      />
      <template v-if="!isPageLoading">
        <el-form class="schema-form">
          <el-row>
            <el-col :span="21">
              <el-form-item :label-width="labelWidth" :label="tl('fileStorage')">
                <el-radio-group
                  class="platform-radio-group"
                  v-model="selectedStorageType"
                  @change="handleTypeChanged"
                >
                  <el-row :gutter="28">
                    <el-col v-for="{ value, label } in storageTypeOpt" :key="value" :span="12">
                      <el-radio class="platform-radio" :value="value" border>
                        <span class="platform-name"> {{ label }} </span>
                      </el-radio>
                    </el-col>
                  </el-row>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <schema-form
          :key="storageFormComKey"
          v-show="selectedStorageType === StorageType.Local"
          ref="LocalStorageFormCom"
          type="file_trans"
          :according-to="{ path: '/configs/file_transfer' }"
          :form="configs"
          :form-props="{ labelWidth }"
          :btn-loading="saveLoading"
          :record-loading="configLoading"
          :data-handler="handleSchemaToLocalFileInfo"
          :advanced-fields="advancedFields.local"
          @save="handleSave"
        />
        <schema-form
          v-show="selectedStorageType === StorageType.S3"
          ref="S3StorageFormCom"
          type="file_trans"
          :according-to="{ path: '/configs/file_transfer' }"
          :form="configs"
          :form-props="{ labelWidth }"
          :btn-loading="saveLoading"
          :record-loading="configLoading"
          :props-order-map="propsOrderMap.file"
          :data-handler="handleSchemaToS3FileInfo"
          :advanced-fields="advancedFields.s3"
          :custom-col-class="customColClass"
          @save="handleSave"
        />
      </template>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getFileTransConfigs, updateFileTransConfigs } from '@/api/config'

import SchemaForm from '@/components/SchemaForm'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { Properties, Property } from '@/types/schemaForm'
import { FileTransferConf } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'

import { useStore } from 'vuex'

interface SchemaData {
  components: Properties
  rules: SchemaRules
}

const enum StorageType {
  Local,
  S3,
}

const configs: Ref<FileTransferConf> = ref({})
const saveLoading = ref(false)
const { t, tl } = useI18nTl('BasicConfig')
const { state } = useStore()

const selectedStorageType = ref(StorageType.Local)

const storageTypeOpt = [
  { value: StorageType.Local, label: tl('localStorage') },
  { value: StorageType.S3, label: tl('s3Storage') },
]

let rawData: any = undefined

// hack for refresh component
const storageFormComKey = ref(0)

const BasicFormCom = ref()
const LocalStorageFormCom = ref()
const S3StorageFormCom = ref()

const configLoading = ref(true)
const isSchemaLoading = ref(false)
const isPageLoading = computed(() => configLoading.value || isSchemaLoading.value)

const labelWidth = computed(() => (state.lang === 'zh' ? 210 : 230))

const propsOrderMap = {
  basic: createOrderObj([], 0),
  file: createOrderObj(
    [
      'segments',
      'exporter',
      'enable',
      'host',
      'port',
      'access_key_id',
      'secret_access_key',
      'access_method',
      'bucket',
      'url_expire_time',
      'min_part_size',
      'max_part_size',
      'acl',
      'transport_options',
      'verify',
      'server_name_indication',
      'certfile',
      'keyfile',
      'cacertfile',
    ],
    0,
  ),
}

/**
 * This form is not bound to the form component. It is used to
 * get the latest storage form data to control whether the
 * SSL configuration needs to be displayed.
 */
const recordInS3Form: Ref<FileTransferConf> = ref({})
const sslConfPath = 'storage.local.exporter.s3.transport_options.ssl'
const getSSLConfPath = (key: string) => `${sslConfPath}.${key}`
const customColClass = computed(() => {
  const isSSLEnabled = get(recordInS3Form.value, getSSLConfPath('enable'))
  if (isSSLEnabled) {
    return {}
  }
  return SSL_FIELDS.reduce((obj: Record<string, string>, key) => {
    if (key === 'enable') {
      return obj
    }
    return { ...obj, [getSSLConfPath(key)]: 'is-hidden' }
  }, {})
})
const getRecordInS3Form = () => {
  recordInS3Form.value = S3StorageFormCom.value.configForm
}

const getFieldSchemaPath = (fieldPath: string) => fieldPath.split('.').join('.properties.')

// TODO:
// const pickNeededFieldsSchema = (schema: Properties, fieldPaths: Array<string>) => {}

const omitFieldItemFromSchema = (schema: Properties, fieldPath: string) => {
  if (!/\./.test(fieldPath)) {
    Reflect.deleteProperty(schema, fieldPath)
  } else {
    const parent = get(schema, getFieldSchemaPath(fieldPath.split('.').slice(0, -1).join('.')))
    if (parent?.properties) {
      Reflect.deleteProperty(parent.properties, fieldPath.split('.').slice(-1)[0])
    }
  }
  return schema
}
const omitFieldsFromSchema = (schema: Properties, fieldPaths: Array<string>) => {
  fieldPaths.forEach((path) => omitFieldItemFromSchema(schema, path))
  return schema
}

const basicConfFields = ['enable', 'init_timeout', 'storage.local.segments.root']
// storage.properties.local.properties.segments.properties.root

const basicAdvancedFields = ['store_segment_timeout', 'assemble_timeout', /\.gc\./]
const advancedFields = {
  local: basicAdvancedFields,
  s3: [
    ...basicAdvancedFields,
    /transport_options\.(?!ssl)/,
    /acl/,
    /max_part_size/,
    /min_part_size/,
    /url_expire_time/,
    ...[
      'reuse_sessions',
      'depth',
      'password',
      'versions',
      'ciphers',
      'secure_renegotiate',
      'log_level',
      'hibernate_after',
      'partial_chain',
      'verify_peer_ext_key_usage',
    ].map(getSSLConfPath),
  ],
}

const handleSchemaToBasicInfo = (data: SchemaData) => {
  const { components, rules } = data
  const localSchema = components?.storage?.properties?.local
  if (localSchema && localSchema.properties) {
    localSchema.properties = pick(localSchema.properties, 'segments')
  }
  const segmentsSchema = localSchema?.properties?.segments
  if (segmentsSchema && segmentsSchema.properties) {
    segmentsSchema.properties = pick(segmentsSchema.properties, 'root')
  }
  const firstLevelKeys = basicConfFields.map((item) => {
    const dotIndex = item.indexOf('.')
    return dotIndex < 0 ? item : item.slice(0, dotIndex)
  })
  Object.keys(components).forEach((key) => {
    if (!firstLevelKeys.includes(key)) {
      Reflect.deleteProperty(components, key)
    }
  })
  return { components, rules }
}

const handleFieldVerifySchema = (schema: Property) => {
  schema.type = 'boolean'
  schema.componentProps = {
    activeValue: SSL_VERIFY_VALUE_MAP.get(true),
    inactiveValue: SSL_VERIFY_VALUE_MAP.get(false),
  }
  return schema
}

const getFieldPath = (key: string, prePath?: string): string => `${prePath}${prePath && '.'}${key}`

const localPartPath = 'storage.local.exporter.local'
const s3PartPath = 'storage.local.exporter.s3'
const enableField = {
  [StorageType.Local]: getFieldPath('enable', localPartPath),
  [StorageType.S3]: getFieldPath('enable', s3PartPath),
}
const handleSchemaToFileInfo = (data: SchemaData, type: 'local' | 's3') => {
  const { components, rules } = data
  if (!Object.keys(components).length) {
    return data
  }
  omitFieldsFromSchema(components, basicConfFields)
  // hide two enable fields
  omitFieldsFromSchema(components, [enableField[StorageType.Local], enableField[StorageType.S3]])

  const target = components?.storage?.properties?.local
  if (target && target.properties) {
    target.properties = pick(target.properties, ['exporter', 'segments'])
    const exporter = target?.properties?.exporter
    if (exporter && exporter.properties) {
      exporter.properties = pick(exporter.properties, type)
    }
  }

  if (type === 's3') {
    const fieldVerifySchema = get(components, getFieldSchemaPath(getSSLConfPath('verify')))
    fieldVerifySchema && handleFieldVerifySchema(fieldVerifySchema)

    const fieldKeyFileSchema = get(components, getFieldSchemaPath(getSSLConfPath('keyfile')))
    fieldKeyFileSchema.componentProps = { placeholder: t('Base.keyFilePlaceholder') }

    const fieldCiphersSchema = get(components, getFieldSchemaPath(getSSLConfPath('ciphers')))
    fieldCiphersSchema.items.component = 'input'

    const fieldVersionsSchema = get(components, getFieldSchemaPath(getSSLConfPath('versions')))
    fieldVersionsSchema.items.type = 'enum'
    fieldVersionsSchema.symbols = ['tlsv1', 'tlsv1.1', 'tlsv1.2', 'tlsv1.3']
  }

  return { components, rules }
}

const handleSchemaToLocalFileInfo = (data: SchemaData) => handleSchemaToFileInfo(data, 'local')
const handleSchemaToS3FileInfo = (data: SchemaData) => handleSchemaToFileInfo(data, 's3')

const handleTypeChanged = (val: StorageType | any) => {
  const isLocal = val === StorageType.Local
  // sync form data
  const SourceFormCom = isLocal ? LocalStorageFormCom.value : S3StorageFormCom.value
  const TargetFormCom = isLocal ? S3StorageFormCom.value : LocalStorageFormCom.value
  const storageForm = merge(SourceFormCom.configForm, TargetFormCom.configForm)
  // set value to enable
  set(storageForm, enableField[StorageType.Local], isLocal)
  set(storageForm, enableField[StorageType.S3], !isLocal)

  const basicConfig = pick(BasicFormCom.value.configForm, basicConfFields)
  configs.value = { ...merge(basicConfig, omit(storageForm, basicConfFields)) }
  if (!isLocal) {
    getRecordInS3Form()
  }
}

/**
 * If there are some parameters that do not have a value set,
 * set a default value for them.(because these parameters are advanced settings but required too)
 */
const setDefaultValue = (conf: FileTransferConf) => {
  const minSizePath = getFieldPath('min_part_size', s3PartPath)
  const maxSizePath = getFieldPath('max_part_size', s3PartPath)
  if (!get(conf, minSizePath)) {
    set(conf, minSizePath, '5MB')
  }
  if (!get(conf, maxSizePath)) {
    set(conf, maxSizePath, '5MB')
  }
  return conf
}

/**
 * After getting the conf, based on the conf, determine the type of storage enabled
 */
const setSelectedStorageType = async () => {
  const localEnable = get(configs.value, enableField[StorageType.Local])
  const s3Enable = get(configs.value, enableField[StorageType.S3])
  if (!localEnable && s3Enable) {
    selectedStorageType.value = StorageType.S3
    await nextTick()
    getRecordInS3Form()
  } else {
    selectedStorageType.value = StorageType.Local
  }
}

const loadData = async () => {
  try {
    configs.value = await getFileTransConfigs()
    rawData = cloneDeep(configs.value)
    setDefaultValue(configs.value)
    setSelectedStorageType()
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}
const reloading = () => {
  loadData()
}
const getDataToSubmit = () => {
  const basicFormData = BasicFormCom.value.configForm

  const isLocal = selectedStorageType.value === StorageType.Local

  const storageFormCom = isLocal ? LocalStorageFormCom.value : S3StorageFormCom.value
  const partNeedBeOmitted = isLocal ? s3PartPath : localPartPath
  const storageFormData = omit(cloneDeep(storageFormCom.configForm), partNeedBeOmitted)

  // When saving, the form data comes from the storage conf form component;
  // this component does not have basic conf data and needs to be processed.
  return checkNOmitFromObj(merge(storageFormData, pick(basicFormData, basicConfFields)))
}
const handleSave = async () => {
  try {
    await customValidate(BasicFormCom.value)
    const isLocal = selectedStorageType.value === StorageType.Local
    const storageFormCom = isLocal ? LocalStorageFormCom.value : S3StorageFormCom.value
    await customValidate(storageFormCom)
    saveLoading.value = true

    await updateFileTransConfigs(getDataToSubmit())
    ElMessage.success(t('Base.updateSuccess'))
    reloading()
  } catch (error) {
    console.error(error)
  } finally {
    saveLoading.value = false
  }
}

const checkDataIsChanged = () => !isEqual(getDataToSubmit(), rawData)
useDataNotSaveConfirm(checkDataIsChanged)

loadData()
</script>

<style lang="scss">
.file-trans {
  .config-sub-block {
    padding-top: 16px;
    &:not(:last-child) {
      .schema-form {
        padding-bottom: 0;
      }
    }
  }
  .el-divider {
    margin-bottom: 0;
  }
  .sub-title {
    text-align: right;
    width: 250px;
    font-size: 16px;
  }
  .schema-form:not(:last-child) {
    padding-bottom: 0;
  }
  .el-radio {
    line-height: 1;
  }
  .el-col-24 {
    padding: 8px;
  }
}
</style>
