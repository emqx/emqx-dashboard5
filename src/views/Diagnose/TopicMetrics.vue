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
              <el-radio-group v-model="row.topicQoS" size="small">
                <el-radio-button :label="DEFAULT_QOS">{{ $t('Base.all') }}</el-radio-button>
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
                      {{ `${row.metrics[getKey(row.topicQoS, 'in.rate')]} ${tl('rate')}` }}
                    </span>
                  </div>
                  <div class="message-card--body">
                    {{ row.metrics[getKey(row.topicQoS, 'in.count')] }}
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="message-card out">
                  <div>
                    {{ tl('msgOut') }}
                    <span class="message-rate">
                      {{ `${row.metrics[getKey(row.topicQoS, 'out.rate')]} ${tl('rate')}` }}
                    </span>
                  </div>
                  <div class="message-card--body">
                    {{ row.metrics[getKey(row.topicQoS, 'out.count')] }}
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="message-card drop">
                  <div>
                    {{ tl('msgDrop') }}
                    <span class="message-rate">
                      {{ `${row.metrics[`messages.dropped.rate`]} ${tl('rate')}` }}
                    </span>
                  </div>
                  <div class="message-card--body">
                    {{ row.metrics[`messages.dropped.count`] }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="'Topic'" prop="topic" :min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          <p class="table-data-without-break">{{ row.topic }}</p>
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgIn')"
        sortable
        :sort-by="({ metrics }) => metrics['messages.in.count']"
        :min-width="184"
      >
        <template #default="{ row }">
          {{ row.metrics['messages.in.count'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgOut')"
        sortable
        :sort-by="({ metrics }) => metrics['messages.out.count']"
        :min-width="184"
      >
        <template #default="{ row }">
          {{ row.metrics['messages.out.count'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgDrop')"
        sortable
        :sort-by="({ metrics }) => metrics['messages.dropped.count']"
        :min-width="180"
      >
        <template #default="{ row }">
          {{ row.metrics['messages.dropped.count'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('startTime')"
        sortable
        :sort-by="({ create_time }) => new Date(create_time).getTime()"
        :min-width="164"
      >
        <template #default="{ row }">
          {{ (row.reset_at && df(row.reset_at)) || (row.create_time && df(row.create_time)) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="220">
        <template #default="{ row, $index }">
          <el-button size="small" @click="loadMetricsFromTopic(row, $index)">
            {{ $t('Base.view') }}
          </el-button>
          <el-button size="small" @click="resetTopic(row, $index)">
            {{ $t('Base.reset') }}
          </el-button>
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
        @submit.prevent="addTopic()"
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

const DEFAULT_QOS = 'all'

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
      addLoading.value = false
    }

    const loadTopicMetrics = async function () {
      tbLoading.value = true
      let res = await getTopicMetrics().catch(() => {})
      if (res) {
        const reconRes = Array.prototype.map.call(res, (v) => {
          return Object.assign(v, { _loading: false, topicQoS: DEFAULT_QOS })
        })
        topicMetricsTb.value = reconRes
      }
      tbLoading.value = false
    }

    const addTopic = async function () {
      try {
        await record.value?.validate()
        addLoading.value = true
        let { topic } = topicInput
        await addTopicMetrics(topic)
        ElMessage.success(t('Base.createSuccess'))
        addVisible.value = false
        loadTopicMetrics()
      } catch (error) {
        //
      } finally {
        addLoading.value = false
      }
    }

    const deleteTopic = async function ({ topic }) {
      try {
        await MB.confirm(t('Base.confirmDelete'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          type: 'warning',
        })
        await deleteTopicMetrics(topic)
        ElMessage.success(t('Base.deleteSuccess'))
        loadTopicMetrics()
      } catch (error) {
        //
      }
    }

    const resetTopic = async function (row, index) {
      try {
        await MB.confirm(t('General.confirmReset'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          type: 'warning',
        })
        await resetTopicMetrics(row.topic)
        ElMessage.success(t('Base.resetSuccess'))
        loadMetricsFromTopic(row, index, false)
      } catch (error) {
        //
      }
    }

    const loadMetricsFromTopic = async function (row, index, toggleExpand = true) {
      const { topic } = row
      row._expand = toggleExpand ? !(row._expand ?? false) : row._expand
      tbRef.value.toggleRowExpansion(row, row._expand)

      if (!row._expand) {
        return
      }

      try {
        row._loading = true
        let res = await getTopicMetrics(topic)
        topicMetricsTb.value.splice(index, 1, {
          ...res,
          _expand: true,
          _loading: false,
          topicQoS: DEFAULT_QOS,
        })
      } catch (error) {
        //
        row._loading = false
      }
    }

    const getStrForConcat = (qos) => (qos === DEFAULT_QOS ? '' : `${qos}.`)

    const getKey = (qos, subPath) => `messages.${getStrForConcat(qos)}${subPath}`

    onMounted(loadTopicMetrics)

    return {
      Plus,
      df: dateFormat,
      tl: translate,
      DEFAULT_QOS,
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
      tableExpandRowKeys,
      loadMetricsFromTopic,
      addLoading,
      getStrForConcat,
      getKey,
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
