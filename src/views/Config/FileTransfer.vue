<template>
  <div class="file-trans app-wrapper">
    <el-card class="app-card">
      <el-tabs v-model="currentGroup" class="group-tabs">
        <el-tab-pane :label="tl('basicConf')" :name="Tabs.Basic">
          <schema-form
            ref="SchemaFormCom"
            type="file-trans"
            :according-to="{ path: '/configs/file_transfer' }"
            :form="configs"
            :form-props="{ labelWidth: state.lang === 'zh' ? 270 : 270 }"
            :btn-loading="saveLoading"
            :record-loading="configLoading"
            :props-order-map="propsOrderMap.basic"
            :data-handler="handleSchemaToBasicInfo"
            :advanced-fields="advancedFields.basic"
            @save="handleSave"
          >
          </schema-form>
        </el-tab-pane>
        <el-tab-pane :label="tl('fileStorage')" :name="Tabs.File">
          <div class="config-sub-block">
            <p class="sub-title">{{ tl('localStorage') }}</p>
            <schema-form
              ref="SchemaFormCom"
              type="file-trans"
              :according-to="{ path: '/configs/file_transfer' }"
              :form="configs"
              :form-props="{ labelWidth: state.lang === 'zh' ? 270 : 270 }"
              :btn-loading="saveLoading"
              :record-loading="configLoading"
              :data-handler="handleSchemaToLocalFileInfo"
              @save="handleSave"
            />
          </div>
          <el-divider />
          <div class="config-sub-block">
            <p class="sub-title">{{ tl('s3Storage') }}</p>
            <schema-form
              ref="SchemaFormCom"
              type="file-trans"
              :according-to="{ path: '/configs/file_transfer' }"
              :form="configs"
              :form-props="{ labelWidth: state.lang === 'zh' ? 270 : 270 }"
              :btn-loading="saveLoading"
              :record-loading="configLoading"
              :props-order-map="propsOrderMap.file"
              :data-handler="handleSchemaToS3FileInfo"
              :advanced-fields="advancedFields.file"
              @save="handleSave"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getFileTransConfigs, updateFileTransConfigs } from '@/api/config'
import { checkNOmitFromObj, createOrderObj, customValidate } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { Properties } from '@/types/schemaForm'
import { FileTransferConf } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual, pick } from 'lodash'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

interface SchemaData {
  components: Properties
  rules: SchemaRules
}

const enum Tabs {
  Basic,
  File,
}

const currentGroup = ref(Tabs.Basic)

const configs = ref({})
const saveLoading = ref(false)
const { t, tl } = useI18nTl('BasicConfig')
const { state } = useStore()

let rawData: any = undefined
const SchemaFormCom = ref()
const configLoading = ref(false)
const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const propsOrderMap = {
  basic: createOrderObj([], 0),
  file: createOrderObj(
    [
      'enable',
      'host',
      'port',
      'access_key_id',
      'secret_access_key',
      'bucket',
      'url_expire_time',
      'min_part_size',
      'max_part_size',
      'acl',
      'transport_options',
      'verify',
      'server_name_indication',
      'cacertfile',
      'certfile',
      'keyfile',
    ],
    0,
  ),
}

const advancedFields = {
  basic: [
    'init_timeout',
    'store_segment_timeout',
    'assemble_timeout',
    /maximum_segments_ttl/,
    /minimum_segments_ttl/,
  ],
  file: [/transport_options/, /acl/, /max_part_size/, /min_part_size/, /url_expire_time/],
}

const handleSchemaToBasicInfo = (data: SchemaData) => {
  const { components, rules } = data
  const target = components?.storage?.properties?.local
  if (target && target.properties) {
    target.properties = pick(target.properties, 'segments')
  }
  return { components, rules }
}

const handleSchemaToFileInfo = (data: SchemaData, type: 'local' | 's3') => {
  const { components, rules } = data
  if (!Object.keys(components).length) {
    return data
  }
  Object.keys(components).forEach((key) => {
    if (key !== 'storage') {
      Reflect.deleteProperty(components, key)
    }
  })
  const target = components?.storage?.properties?.local
  if (target && target.properties) {
    target.properties = pick(target.properties, 'exporter')
    const exporter = target?.properties?.exporter
    if (exporter && exporter.properties) {
      exporter.properties = pick(exporter.properties, type)
    }
  }

  return { components, rules }
}

const handleSchemaToLocalFileInfo = (data: SchemaData) => handleSchemaToFileInfo(data, 'local')
const handleSchemaToS3FileInfo = (data: SchemaData) => handleSchemaToFileInfo(data, 's3')

const loadData = async () => {
  try {
    configLoading.value = true
    configs.value = await getFileTransConfigs()
    rawData = cloneDeep(configs.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}
const reloading = () => {
  loadData()
}
const handleSave = async (val: FileTransferConf) => {
  try {
    await customValidate(SchemaFormCom.value)
    saveLoading.value = true
    const data = { ...val }
    await updateFileTransConfigs(checkNOmitFromObj(data))
    ElMessage.success(t('Base.updateSuccess'))
    reloading()
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}
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
}
</style>
