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
              <li>{{ $t('Base.moreImportInstructions') }}</li>
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
import { ref, defineProps, defineEmits } from 'vue'
import { BatchSettingDatabaseType } from '@/types/enum'
import Papa from 'papaparse'
import { ElMessage } from 'element-plus'
import { downloadByURL } from '@/common/tools'
import { ElUpload } from 'element-plus'

const props = defineProps<{
  type: BatchSettingDatabaseType
}>()
const emits = defineEmits(['uploadedData'])

const UploadRef = ref<typeof ElUpload | null>(null)
const dialogVisible = ref(false)
const fileList = ref<any[]>([])
const importLoading = ref(false)

function downloadTemplate() {
  const fileNames: { [key in BatchSettingDatabaseType]: string } = {
    [BatchSettingDatabaseType.InfluxDB]: 'InfluxDB',
    [BatchSettingDatabaseType.TDengine]: 'TDengine',
    [BatchSettingDatabaseType.IoTDB]: 'IoTDB',
    // Add more mappings here if needed
  }

  const downloadFile = fileNames[props.type]

  if (downloadFile) {
    downloadByURL(`static/templates/EMQX_${downloadFile}_Template.csv`)
  } else {
    console.error(`Unsupported type: ${props.type}`)
  }
}

/**
 * Processes the InfluxDB data and returns a promise that resolves to an array of key-value pairs.
 * @param {string[][]} data - The InfluxDB data to be processed.
 * @returns {Promise<{ key: string; value: string }[]>} - A promise that resolves to an array of key-value pairs.
 */
function processInfluxDBData(data: string[][]): Promise<{ key: string; value: string }[]> {
  return new Promise((resolve, reject) => {
    try {
      // Skip the first row and map each row to an object
      const result = data.slice(1).map((row) => ({
        key: row[0],
        value: row[1],
      }))
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * Processes TDengine data and returns a promise that resolves to a string.
 *
 * @param {string[][]} data - The TDengine data to be processed.
 * @returns {Promise<string>} - A promise that resolves to the generated SQL insert string.
 */
function processTDengineData(data: string[][]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const tableName = '<table>'
      const fields = []
      const values = []
      for (let i = 1; i < data.length; i++) {
        const [field, value, isChar] = data[i]
        if (!field || !value) continue
        fields.push(field)
        const isCharValue = isChar && ['true', 'TRUE', '1'].includes(isChar.trim())
        values.push(isCharValue ? `'${value}'` : value)
      }
      const result = `insert into ${tableName}(${fields.join(', ')}) values (${values.join(', ')})`
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Reads and parses a CSV file.
 * @param file The file to be read and parsed.
 * @returns A promise that resolves to a 2D array representing the CSV data.
 */
async function readFileAndParse(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (!event.target) {
        return reject(new Error('FileReader event target is null'))
      }
      const csvData = event.target.result
      const results: any = Papa.parse(csvData as string)
      if (results.errors.length > 0) {
        reject(new Error('Failed to parse CSV data: ' + results.errors[0].message))
      }
      resolve(results.data)
    }
    reader.onerror = () => {
      reject(new Error('An error occurred while reading the file'))
    }
    reader.onabort = () => {
      reject(new Error('File reading was aborted'))
    }
    reader.readAsText(file)
  })
}

async function importData() {
  importLoading.value = true
  try {
    if (fileList.value.length > 0) {
      const file = fileList.value[0].raw
      const data = await readFileAndParse(file)
      let res: any
      if (props.type === BatchSettingDatabaseType.InfluxDB) {
        res = (await processInfluxDBData(data)) as { key: string; value: string }[]
      }
      if (props.type === BatchSettingDatabaseType.TDengine) {
        res = (await processTDengineData(data)) as string
      }
      emits('uploadedData', res)
      fileList.value = []
      UploadRef.value?.clearFiles()
      dialogVisible.value = false
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
