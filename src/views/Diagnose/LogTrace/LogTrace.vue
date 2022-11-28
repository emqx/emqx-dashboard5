<template>
  <div class="log-trace app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">
          {{ $t('Base.create') }}
        </el-button>
      </div>
    </div>

    <el-table :data="traceTable" v-loading="traceTbLoading" class="data-table">
      <el-table-column :label="$t('LogTrace.name')" prop="name" :min-width="100">
        <template #default="{ row }">
          <a
            href="javascript:;"
            @click="
              $router.push({
                name: 'log-trace-detail',
                params: { id: row.name },
              })
            "
          >
            {{ row.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.type')" prop="type" :min-width="100">
        <template #default="{ row }">
          {{ getTypeLabelByValue(row.type) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.condition')" :min-width="100">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('LogTrace.startEndTime')"
        sortable
        :sort-by="({ start_at }) => new Date(start_at).getTime()"
        :min-width="188"
      >
        <template #default="{ row }">
          {{ moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') }}
          <br />
          {{ moment(row.end_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.status')" prop="status" :min-width="120">
        <template #default="{ row }">
          <div class="vertical-align-center">
            <CheckIcon
              :status="
                row.status === 'running'
                  ? CheckStatus.Check
                  : row.status === 'stopped'
                  ? CheckStatus.Close
                  : CheckStatus.Disable
              "
            />
            <span>{{ row.status && $t('LogTrace.s' + row.status) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('LogTrace.logSize')" prop="log_size" sortable :min-width="112">
        <template #default="{ row }">
          {{
            (Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024).toFixed(2)
          }}KB
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="220">
        <template #default="{ row }">
          <el-button size="small" @click="download(row)" :loading="row.isLoading">
            {{ $t('LogTrace.download') }}
          </el-button>
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

    <el-dialog
      :title="$t('LogTrace.createLog')"
      v-model="createDialog"
      @close="initForm"
      width="800px"
    >
      <el-form ref="createForm" label-position="top" :model="record" :rules="createRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('LogTrace.name')" prop="name">
              <el-input v-model="record.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          <el-col :span="12" v-if="record.type === 'topic'">
            <el-form-item :label="$t('Base.topic')" prop="topic">
              <el-input v-model="record.topic" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="record.type === 'clientid'">
            <el-form-item :label="$t('Base.clientid')" prop="clientid">
              <el-input v-model="record.clientid" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="record.type === 'ip_address'">
            <el-form-item :label="$t('Base.ip')" prop="ip_address">
              <el-input v-model="record.ip_address" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
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
import { defineComponent, nextTick, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { ElMessage as M, ElMessageBox as MB, ElForm } from 'element-plus'
import { TraceFormRecord, TraceRecord, TraceItem } from '@/types/diagnose'
import { Plus } from '@element-plus/icons-vue'
import { FormItemRule } from '@/types/common'
import CheckIcon from '@/components/CheckIcon.vue'

import { getTraceList, addTrace, downloadTrace, stopTrace, deleteTrace } from '@/api/diagnose'
import { CheckStatus } from '@/types/enum'
import { getLabelFromValueInOptionList } from '@/common/tools'

const DEFAULT_DURATION = 30 * 60 * 1000

const createRawTraceForm = () => ({
  name: '',
  type: 'clientid' as const,
  clientid: '',
  ip_address: '',
  topic: '',
  startTime: ['', ''] as [string, string],
})

type TraceItemInTable = TraceItem & {
  isLoading: boolean
}

export default defineComponent({
  components: {
    CheckIcon,
  },
  setup() {
    const { t } = useI18n()
    const traceTbLoading = ref(false)
    const traceTable: Ref<Array<TraceItemInTable>> = ref([])
    const createLoading = ref(false)
    const typeOptions = [
      {
        value: 'clientid',
        label: t('Base.clientid'),
      },
      {
        value: 'topic',
        label: t('Base.topic'),
      },
      {
        value: 'ip_address',
        label: t('Base.ip'),
      },
    ]
    const record: Ref<TraceFormRecord> = ref(createRawTraceForm())
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
      try {
        const traceList = await getTraceList()
        traceTable.value = traceList.map((item: any) => {
          return {
            ...item,
            // for download
            isLoading: false,
          }
        })
      } catch (error) {
        //
      } finally {
        traceTbLoading.value = false
      }
    }

    const getTypeLabelByValue = (value: string) => getLabelFromValueInOptionList(value, typeOptions)

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
        try {
          await addTrace(sendbody)
          M.success(t('LogTrace.createSuc'))
          loadTraceList()
          cancelDialog()
        } catch (error) {
          //
        } finally {
          createLoading.value = false
        }
      })
    }

    const cancelDialog = () => {
      createDialog.value = false
    }

    const initForm = () => {
      record.value = createRawTraceForm()
    }

    const stopTraceHandler = async (row: TraceRecord) => {
      if (!row.name) return
      try {
        await stopTrace(row.name)
        M.success(t('LogTrace.stopSuc'))
        loadTraceList()
      } catch (error) {
        //
      }
    }

    const openCreateDialog = async () => {
      createDialog.value = true
      const timeNow = new Date()
      record.value.startTime = [timeNow, new Date(timeNow.getTime() + DEFAULT_DURATION)]
      await nextTick()
      createForm.value?.clearValidate()
    }

    const deleteTraceHandler = async (row: TraceRecord) => {
      if (!row.name) {
        return
      }
      try {
        await MB.confirm(t('LogTrace.confirmDeleteTrace'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          type: 'warning',
        })

        await deleteTrace(row.name)
        M.success(t('LogTrace.deleteSuc'))
        loadTraceList()
      } catch (error) {
        //
      }
    }

    const download = async (row: TraceItemInTable) => {
      if (!row.name) {
        return
      }
      try {
        row.isLoading = true
        await downloadTrace(row.name)
      } catch (error) {
        //
      } finally {
        row.isLoading = false
      }
    }

    onMounted(() => {
      loadTraceList()
    })

    return {
      Plus,
      tl: (key: string) => t('LogTrace.' + key),
      traceTbLoading,
      traceTable,
      CheckStatus,
      createForm,
      typeOptions,
      record,
      getTypeLabelByValue,
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
      initForm,
    }
  },
})
</script>

<style></style>
