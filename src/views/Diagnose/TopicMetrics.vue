<template>
  <div class="topicMetrics app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="openAdd()">
        {{ tl('addTopic') }}
      </el-button>
    </div>

    <el-table
      :data="topicMetricsTb"
      v-loading="tbLoading"
      ref="tbRef"
      row-key="topic"
      :expand-row-keys="tableExpandRowKeys"
    >
      <el-table-column type="expand" width="1">
        <template #default="{ row }">
          <div v-loading="row._loading" class="topic-detail">
            <el-row class="topic-detail-header">
              <div>{{ $t('Base.detail') }}</div>
              <el-radio-group v-model="topicQos" size="small">
                <el-radio-button label="all">{{ $t('Base.all') }}</el-radio-button>
                <el-radio-button label="qos0">QoS 0</el-radio-button>
                <el-radio-button label="qos1">QoS 1</el-radio-button>
                <el-radio-button label="qos2">QoS 2</el-radio-button>
              </el-radio-group>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="message-card in">
                  <div>
                    {{ tl('msgIn') }}
                    <span class="message-rate">
                      {{
                        row._detail[`messages.${topicQos == 'all' ? '' : topicQos + '.'}in.rate`] +
                        ' ' +
                        tl('rate')
                      }}
                    </span>
                  </div>
                  <div class="message-card--body">
                    {{ row._detail[`messages.${topicQos == 'all' ? '' : topicQos + '.'}in.count`] }}
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="message-card out">
                  <div>
                    {{ tl('msgOut') }}
                    <span class="message-rate">
                      {{
                        row._detail[`messages.${topicQos == 'all' ? '' : topicQos + '.'}out.rate`] +
                        ' ' +
                        tl('rate')
                      }}
                    </span>
                  </div>
                  <div class="message-card--body">
                    {{
                      row._detail[`messages.${topicQos == 'all' ? '' : topicQos + '.'}out.count`]
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="message-card drop">
                  <div>
                    {{ tl('msgDrop') }}
                    <span class="message-rate">
                      {{ row._detail[`messages.dropped.rate`] + ' ' + tl('rate') }}
                    </span>
                  </div>
                  <div class="message-card--body">
                    {{ row._detail[`messages.dropped.count`] }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="'Topic'" prop="topic" sortable></el-table-column>
      <el-table-column
        :label="tl('msgIn')"
        sortable
        :sort-by="({ metrics }) => metrics['messages.in.count']"
      >
        <template #default="{ row }">
          {{ row.metrics['messages.in.count'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgOut')"
        sortable
        :sort-by="({ metrics }) => metrics['messages.out.count']"
      >
        <template #default="{ row }">
          {{ row.metrics['messages.out.count'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgDrop')"
        sortable
        :sort-by="({ metrics }) => metrics['messages.dropped.count']"
      >
        <template #default="{ row }">
          {{ row.metrics['messages.dropped.count'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('startTime')"
        sortable
        :sort-by="({ create_time }) => new Date(create_time).getTime()"
      >
        <template #default="{ row }">
          {{ (row.reset_at && df(row.reset_at)) || (row.create_time && df(row.create_time)) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :width="230">
        <template #default="{ row, $index }">
          <el-button size="small" @click="loadMetricsFromTopic(row, $index)">
            {{ $t('Base.view') }}
          </el-button>
          <el-button size="small" @click="resetTopic(row)">{{ $t('Base.reset') }}</el-button>
          <el-button size="small" type="danger" plain @click="deleteTopic(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="tl('addTopic')" v-model="addVisible">
      <el-form
        ref="record"
        :model="topicInput"
        label-position="top"
        :rules="topicRules"
        @keyup.enter.stop="addTopic()"
      >
        <el-form-item prop="topic" :label="'topic'">
          <el-input v-model="topicInput.topic"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="addVisible = false">{{ $t('Base.cancel') }}</el-button>
          <el-button type="primary" @click="addTopic()" :loading="addLoading">
            {{ $t('Base.add') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import {
  getTopicMetrics,
  addTopicMetrics,
  deleteTopicMetrics,
  resetTopicMetrics,
} from '@/api/diagnose'
import { dateFormat } from '@/common/utils'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'TopicMetrics',
  data: function () {
    return {
      topicRules: {
        topic: [
          {
            required: true,
            message: this.$t('Advanced.required'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  setup() {
    const { t } = useI18n()

    let addVisible = ref(false)
    let topicInput = reactive({
      topic: '',
    })
    let record = ref(null)
    let topicMetricsTb = ref([])
    let tbLoading = ref(false)
    let tbRef = ref(null)
    let topicQos = ref('all')
    let addLoading = ref(false)

    const tableExpandRowKeys = computed(() => {
      return topicMetricsTb.value.filter(({ _expand }) => _expand).map(({ topic }) => topic)
    })

    const translate = function (key, collection = 'Tools') {
      return t(collection + '.' + key)
    }

    const openAdd = () => {
      addVisible.value = true
      record.value?.resetFields()
    }

    const loadTopicMetrics = async function () {
      tbLoading.value = true
      let res = await getTopicMetrics().catch(() => {})
      if (res) {
        const reconRes = Array.prototype.map.call(res, (v) => {
          return Object.assign(v, { _detail: {}, _loading: false })
        })
        topicMetricsTb.value = reconRes
      }
      tbLoading.value = false
    }

    const addTopic = async function () {
      addLoading.value = true
      let validate = await record.value?.validate().catch(() => {})
      if (!validate) return
      let { topic } = topicInput
      let res = await addTopicMetrics(topic).catch(() => {})
      if (res) {
        ElMessage({
          type: 'success',
          message: t('Base.createSuccess'),
        })
        loadTopicMetrics()
      }
      addVisible.value = false
      addLoading.value = false
    }

    const deleteTopic = async function (row) {
      let confirm = await MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      }).catch((e) => e)

      if (confirm !== 'confirm') return
      let { topic } = row
      let res = await deleteTopicMetrics(topic).catch(() => {})
      if (res) {
        ElMessage({
          type: 'success',
          message: t('Base.deleteSuccess'),
        })
        loadTopicMetrics()
      }
    }

    const resetTopic = async function (row) {
      let confirm = await MB.confirm(t('General.confirmReset'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      }).catch((e) => e)

      if (confirm !== 'confirm') return
      let { topic } = row
      let res = await resetTopicMetrics(topic).catch(() => {})
      if (res) {
        ElMessage({
          type: 'success',
          message: t('Base.resetSuccess'),
        })
        loadTopicMetrics()
      }
    }

    const loadMetricsFromTopic = async function (row, index) {
      const { topic } = row
      row._loading = true
      row._expand = !(row._expand ?? false)
      tbRef.value.toggleRowExpansion(row, row._expand)

      if (row._expand) {
        let res = await getTopicMetrics(topic).catch(() => {})
        if (res && row) {
          row._detail = res.metrics
        }
        row._loading = false
      }
    }

    onMounted(loadTopicMetrics)

    return {
      Plus,
      df: dateFormat,
      tl: translate,
      addVisible,
      openAdd,
      record,
      topicInput,
      addTopic,
      topicMetricsTb,
      tbLoading,
      deleteTopic,
      resetTopic,
      tbRef,
      topicQos,
      tableExpandRowKeys,
      loadMetricsFromTopic,
      addLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.message-card {
  height: 112px;
  border-radius: 4px;
  padding: 6px 12px;
  color: #fff;
  &.in {
    background: linear-gradient(0.25turn, #3e3ab4, #4c5ae0);
  }
  &.out {
    background: linear-gradient(0.25turn, #0c7cd1, #19bcc2);
  }
  &.drop {
    background: linear-gradient(0.25turn, #00ac70, #34c388);
  }
  .message-card--body {
    font-size: 28px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .message-rate {
    float: right;
  }
}

.el-table :deep(.el-table__expand-icon) {
  display: none;
}

.topic-detail-header {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  & > :first-child {
    font-size: 16px;
    font-weight: 700;
  }
}

.topic-detail {
  margin: 0 10px;
}
</style>
