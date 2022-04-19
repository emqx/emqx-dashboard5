<template>
  <div class="log-trace app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">{{
          $t('Base.create')
        }}</el-button>
      </div>
    </div>

    <el-table :data="traceTable" v-loading="traceTbLoading" class="data-table">
      <el-table-column :label="$t('LogTrace.name')" prop="name" sortable></el-table-column>
      <el-table-column :label="$t('LogTrace.type')" prop="type" sortable></el-table-column>
      <el-table-column :label="$t('LogTrace.condition')">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('LogTrace.startEndTime')"
        min-width="90"
        sortable
        :sort-by="({ start_at }) => new Date(start_at).getTime()"
      >
        <template #default="{ row }">
          {{ moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') }}
          <br />
          {{ moment(row.end_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.status')" prop="status" sortable>
        <template #default="{ row }">
          <el-badge
            is-dot
            :type="
              row.status === 'running' ? 'primary' : row.status === 'stopped' ? 'danger' : 'info'
            "
          />
          <span>{{ row.status && $t('LogTrace.s' + row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.logSize')" prop="log_size" sortable>
        <template #default="{ row }">
          {{
            (Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024).toFixed(2)
          }}KB
        </template>
      </el-table-column>
      <el-table-column min-width="140" :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button
            size="small"
            @click="
              $router.push({
                name: 'log-trace-detail',
                params: { id: row.name },
              })
            "
          >
            {{ $t('LogTrace.view') }}
          </el-button>
          <el-button size="small" @click="download(row)">{{ $t('LogTrace.download') }}</el-button>
          <template v-if="row.status !== 'stopped'">
            <el-button size="small" type="danger" plain @click="stopTraceHandler(row)">
              {{ $t('LogTrace.stop') }}
            </el-button>
          </template>
          <template v-else>
            <el-button size="small" type="danger" plain @click="deleteTraceHandler(row)">
              {{ $t('LogTrace.delete') }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('LogTrace.createLog')" v-model="createDialog">
      <el-form ref="createForm" label-position="top" :model="record" :rules="createRules">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item :label="$t('LogTrace.name')" prop="name">
              <el-input v-model="record.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="$t('LogTrace.type')" prop="type">
              <el-select v-model="record.type">
                <el-option
                  v-for="{ value, label } in typeOptions"
                  :key="value"
                  :value="value"
                  :label="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" v-if="record.type === 'topic'">
            <el-form-item label="Topic" prop="topic">
              <el-input v-model="record.topic" />
            </el-form-item>
          </el-col>
          <el-col :span="18" v-if="record.type === 'clientid'">
            <el-form-item label="Client ID" prop="clientid">
              <el-input v-model="record.clientid" />
            </el-form-item>
          </el-col>
          <el-col :span="18" v-if="record.type === 'ip_address'">
            <el-form-item label="IP Address" prop="ip_address">
              <el-input v-model="record.ip_address" />
            </el-form-item>
          </el-col>
          <el-col :span="18" style="clear: both">
            <el-form-item :label="$t('LogTrace.startEndTime')" prop="startTime">
              <el-date-picker
                type="datetimerange"
                :start-placeholder="$t('LogTrace.startTime')"
                :end-placeholder="$t('LogTrace.endTime')"
                v-model="record.startTime"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="cancelDialog()">{{ $t('Base.cancel') }}</el-button>
          <el-button
            class="dialog-primary-btn"
            type="primary"
            @click="submitTrace()"
            :loading="createLoading"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { ElMessage as M, ElMessageBox as MB, ElForm } from 'element-plus'
import { TraceFormRecord, TraceRecord } from '@/types/diagnose'
import { Plus } from '@element-plus/icons-vue'
import { FormItemRule } from '@/types/common'

import { getTraceList, addTrace, downloadTrace, stopTrace, deleteTrace } from '@/api/diagnose'

const DEFAULT_DURATION = 30 * 60 * 1000

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const traceTbLoading = ref(false)
    const traceTable = ref([])
    const createLoading = ref(false)
    const typeOptions = [
      {
        value: 'clientid',
        label: 'Client ID',
      },
      {
        value: 'topic',
        label: 'Topic',
      },
      {
        value: 'ip_address',
        label: 'IP Address',
      },
    ]
    const record: Ref<TraceFormRecord> = ref({
      name: '',
      type: 'clientid' as const,
      clientid: '',
      ip_address: '',
      topic: '',
      startTime: ['', ''] as [string, string],
    })
    const createDialog = ref(false)

    const createRules: Record<string, Array<FormItemRule>> = {
      name: [
        { required: true, message: t('General.pleaseEnter') },
        {
          validator: (rule, value, callback) => {
            if (/[\w-]+/.test(value)) {
              callback()
            } else {
              callback(new Error(t('General.validString')))
            }
          },
          trigger: ['change'],
        },
      ],
      topic: [{ required: true, message: t('General.pleaseEnter') }],
      clientid: [{ required: true, message: t('General.pleaseEnter') }],
      ip_address: [{ required: true, message: t('General.pleaseEnter') }],
      startTime: [
        {
          validator(r, v, cb) {
            // eslint-disable-next-line no-unused-expressions
            v && v[0] && v[1] ? cb() : cb(new Error(t('LogTrace.needStartTime')))
          },
        },
      ],
    }
    const createForm: Ref<typeof ElForm | null> = ref(null)

    const loadTraceList = async () => {
      traceTbLoading.value = true
      const traceList = await getTraceList().catch(() => {})
      traceTable.value = traceList
      traceTbLoading.value = false
    }

    const submitTrace = async () => {
      createForm.value?.validate(async (valid: boolean) => {
        if (!valid) return

        createLoading.value = true
        const { clientid, ip_address, name, topic, type } = record.value
        let targetInfo = {}
        switch (type) {
          case typeOptions[0].value:
            targetInfo = { clientid, type }
            break
          case typeOptions[1].value:
            targetInfo = { topic, type }
            break
          case typeOptions[2].value:
            targetInfo = { ip_address, type }
            break
          default:
            break
        }
        const sendbody = {
          name,
          ...targetInfo,
          start_at: new Date(record.value.startTime[0]).toISOString(),
          end_at: new Date(record.value.startTime[1]).toISOString(),
        }

        // delete sendbody.startTime;
        const res = await addTrace(sendbody).catch(() => {})
        if (res) {
          M.success(t('LogTrace.createSuc'))
          loadTraceList()
          cancelDialog()
        }
        createLoading.value = false
      })
    }

    const cancelDialog = () => {
      createDialog.value = false
      createForm.value?.resetFields()
    }

    const stopTraceHandler = async (row: TraceRecord) => {
      if (!row.name) return
      const res = await stopTrace(row.name).catch(() => {})
      if (res) {
        M.success(t('LogTrace.stopSuc'))
        loadTraceList()
      }
    }

    const openCreateDialog = async () => {
      createDialog.value = true
      const timeNow = new Date()
      record.value.startTime = [timeNow, new Date(timeNow.getTime() + DEFAULT_DURATION)]
    }

    const deleteTraceHandler = async (row: TraceRecord) => {
      if (!row.name) {
        return
      }
      const prompt = await MB.confirm(t('LogTrace.confirmDeleteTrace'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      }).catch(() => {})

      if (prompt) {
        const res = await deleteTrace(row.name).catch(() => {})
        if (res) {
          M.success(t('LogTrace.deleteSuc'))
          loadTraceList()
        }
      }
    }

    const download = async (row: TraceRecord) => {
      if (!row.name) {
        return
      }
      await downloadTrace(row.name)
      // download link, no more action needed
    }

    onMounted(() => {
      loadTraceList()
    })

    return {
      Plus,
      tl: (key: string) => t('LogTrace.' + key),
      traceTbLoading,
      traceTable,
      createForm,
      typeOptions,
      record,
      submitTrace,
      stopTraceHandler,
      openCreateDialog,
      moment,
      download,
      deleteTraceHandler,
      createRules,
      createDialog,
      createLoading,
      cancelDialog,
    }
  },
})
</script>

<style></style>
