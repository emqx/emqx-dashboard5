<template>
  <div class="batch-settings">
    <el-button link type="primary" class="btn" @click="dialogVisible = true">
      {{ $t('Base.batchSetting') }}
    </el-button>

    <el-dialog
      :title="$t('Base.importBatchSetting')"
      v-model="dialogVisible"
      modal-class="batch-settings-dialog"
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
    >
      <el-steps direction="vertical">
        <el-step>
          <template #title>
            <div>{{ $t('Base.downloadTemplatePrompt') }}</div>
            <ul>
              <li>{{ $t('Base.batchSettingDownloadFirst') }}</li>
              <i18n-t keypath="Base.moreImportInstructions" tag="li">
                <template #link>
                  <a :href="checkDocMap[type]" target="_blank">{{ $t('Base.helpDocs') }}</a>
                </template>
              </i18n-t>
            </ul>
          </template>
          <template #description>
            <el-button type="primary" plain @click="downloadTemplate">
              {{ $t('Base.downloadTemplate') }}
            </el-button>
          </template>
        </el-step>
        <el-step>
          <template #title>
            <div>{{ $t('Base.uploadFile') }}</div>
            <ul>
              <li>{{ $t('Base.csvFileLimit') }}</li>
            </ul>
          </template>
          <template #description>
            <el-upload
              ref="UploadRef"
              :auto-upload="false"
              v-model:file-list="fileList"
              :limit="1"
              accept=".csv"
            >
              <el-button type="primary" plain>{{ $t('Base.uploadFile') }}</el-button>
            </el-upload>
          </template>
        </el-step>
      </el-steps>

      <template #footer class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="importData" :loading="importLoading">{{
          $t('Base.import')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { BATCH_UPLOAD_CSV_MAX_ROWS } from '@/common/constants'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { BatchSettingDatabaseType } from '@/types/enum'
import { useBatchSettings } from '@emqx/shared-ui-utils'
import { ElMessage, ElUpload } from 'element-plus'
import { defineEmits, defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  type: BatchSettingDatabaseType
}>()
const emits = defineEmits(['uploadedData'])
const { locale } = useI18n()
const { tl } = useI18nTl('General')

const UploadRef = ref<typeof ElUpload | null>(null)
const dialogVisible = ref(false)
const fileList = ref<any[]>([])
const importLoading = ref(false)
const { docMap } = useDocLink()

const checkDocMap = {
  [BatchSettingDatabaseType.InfluxDB]: docMap.influxDbBatchSettings,
  [BatchSettingDatabaseType.TDengine]: docMap.tdengineBatchSettings,
  [BatchSettingDatabaseType.IoTDB]: docMap.iotDbBatchSettings,
  [BatchSettingDatabaseType.Datalayers]: docMap.datalayersBatchSettings,
}

const dbNameMap = {
  [BatchSettingDatabaseType.InfluxDB]: 'InfluxDB',
  [BatchSettingDatabaseType.TDengine]: 'TDengine',
  [BatchSettingDatabaseType.IoTDB]: 'IoTDB',
  [BatchSettingDatabaseType.Datalayers]: 'Datalayers',
}

const {
  processTDengineData,
  processIoTDBData,
  processInfluxDBData,
  readFileAndParse: processingUploadedFile,
  handleDownloadTemp,
  templateContentMap,
} = useBatchSettings(locale.value === 'zh' ? 'zh' : 'en')

function downloadTemplate() {
  const template = templateContentMap[props.type]
  handleDownloadTemp(template, `EMQX_${dbNameMap[props.type]}_Template.csv`)
}

/**
 * Reads and parses a CSV file.
 * @param file The file to be read and parsed.
 * @returns A promise that resolves to a 2D array representing the CSV data.
 */
async function readFileAndParse(file: File): Promise<string[][]> {
  return processingUploadedFile(file, BATCH_UPLOAD_CSV_MAX_ROWS)
}

async function importData() {
  importLoading.value = true
  try {
    if (fileList.value.length > 0) {
      const file = fileList.value[0].raw
      const data = await readFileAndParse(file)
      let res: any
      if (
        [BatchSettingDatabaseType.Datalayers, BatchSettingDatabaseType.InfluxDB].includes(
          props.type,
        )
      ) {
        res = (await processInfluxDBData(data)) as { key: string; value: string }[]
      } else if (props.type === BatchSettingDatabaseType.TDengine) {
        res = (await processTDengineData(data)) as string
      } else if (props.type === BatchSettingDatabaseType.IoTDB) {
        res = await processIoTDBData(data)
      }
      emits('uploadedData', res)
      fileList.value = []
      UploadRef.value?.clearFiles()
      dialogVisible.value = false
    } else {
      ElMessage.warning(tl('pleaseUploadFile'))
    }
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    }
  } finally {
    importLoading.value = false
  }
}
</script>

<style lang="scss">
.batch-settings {
  line-height: 0;
  .el-button.is-link {
    font-weight: normal;
  }
}
.batch-settings-dialog {
  .el-step__title {
    ul {
      padding-left: 14px;
    }
  }
  .el-step__title.is-wait,
  .el-step__title.is-process {
    font-weight: normal;
    color: var(--color-text-primary);
    font-size: 14px;
  }
  .el-step:not(:last-child) {
    .el-button {
      margin-bottom: 32px;
    }
  }
}
</style>
