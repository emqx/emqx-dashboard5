<template>
  <div class="topic-metrics-collections app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="openCreateDialog" />
    </div>

    <el-table
      ref="tableRef"
      :data="collections"
      v-loading="isLoading"
      :row-key="getRowKey"
      :expand-row-keys="tableExpandRowKeys"
      @sort-change="handleSortChange"
    >
      <el-table-column type="expand" width="1">
        <template #default="{ row, $index }">
          <div v-loading="row._loading">
            <div
              class="grid items-center gap-x-5 grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_220px]"
            >
              <div class="col-start-1 px-4">
                <p class="m-0 mb-2 text-[var(--color-text-secondary)]">{{ tl('bytesIn') }}</p>
                <p class="m-0 text-base font-normal text-[var(--color-text-primary)]">
                  {{ formatBytes(getMetric(row, 'bytes.in')) }}
                </p>
              </div>
              <div class="col-start-2">
                <p class="m-0 mb-2 text-[var(--color-text-secondary)]">{{ tl('bytesOut') }}</p>
                <p class="m-0 text-base font-normal text-[var(--color-text-primary)]">
                  {{ formatBytes(getMetric(row, 'bytes.out')) }}
                </p>
              </div>
              <div class="col-start-3">
                <p class="m-0 mb-2 text-[var(--color-text-secondary)]">{{ t('Base.createdAt') }}</p>
                <p class="m-0 text-base font-normal text-[var(--color-text-primary)]">
                  {{ dateFormat(row.create_time, '-') }}
                </p>
              </div>
              <div class="flex min-h-[52px] items-center self-stretch px-4 col-start-4">
                <RefreshButton
                  size="small"
                  :disabled="!$hasPermission('get') || row._loading"
                  @click="loadCollectionDetail(row, $index, false)"
                />
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="tl('collectionName')" prop="name" sortable="custom" min-width="162">
        <template #default="{ row }">
          <CommonOverflowTooltip :content="row.name" />
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('topicFilter')"
        prop="topic_filter"
        sortable="custom"
        min-width="128"
      >
        <template #default="{ row }">
          <CommonOverflowTooltip :content="row.topic_filter" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="isMultiTenancyEnabled && !isNamespaceUser"
        :label="t('BasicConfig.namespace')"
        prop="namespace"
        sortable="custom"
        min-width="132"
      >
        <template #default="{ row }">
          {{ getNamespaceLabel(row.namespace) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgIn')"
        sortable="custom"
        prop="messages.in.count"
        min-width="188"
      >
        <template #default="{ row }">
          {{ formatCount(getMetric(row, 'messages.in.count')) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgOut')"
        sortable="custom"
        prop="messages.out.count"
        min-width="184"
      >
        <template #default="{ row }">
          {{ formatCount(getMetric(row, 'messages.out.count')) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('msgDrop')"
        sortable="custom"
        prop="messages.dropped.count"
        min-width="180"
      >
        <template #default="{ row }">
          {{ formatCount(getMetric(row, 'messages.dropped.count')) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')" width="220">
        <template #default="{ row, $index }">
          <TableButton
            :disabled="!$hasPermission('get')"
            @click="loadCollectionDetail(row, $index)"
          >
            {{ t('Base.view') }}
          </TableButton>
          <NamespaceResourcePopover
            v-if="isOpNsDisabled(row)"
            :namespace="row.namespace || undefined"
            :target-label="tl('topicMetricsCollection')"
          >
            <template #default>
              <span class="inline-flex items-center gap-2">
                <TableButton disabled>{{ t('Base.reset') }}</TableButton>
                <TableButton disabled>{{ t('Base.delete') }}</TableButton>
              </span>
            </template>
          </NamespaceResourcePopover>
          <template v-else>
            <TableButton :disabled="!$hasPermission('put')" @click="resetCollection(row, $index)">
              {{ t('Base.reset') }}
            </TableButton>
            <TableButton :disabled="!$hasPermission('delete')" @click="deleteCollection(row)">
              {{ t('Base.delete') }}
            </TableButton>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="tl('createCollection')" v-model="createDialogVisible" width="460px">
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-position="top"
        require-asterisk-position="right"
        @submit.prevent="submitCreate"
      >
        <el-form-item prop="name" :label="tl('collectionName')">
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item prop="topic_filter" :label="tl('topicFilter')">
          <el-input v-model="createForm.topic_filter" />
        </el-form-item>
        <el-alert
          v-if="isNamespaceUser"
          class="mt-1"
          type="info"
          show-icon
          :closable="false"
          :description="tl('topicFilterMountpointTip', { namespace: currentNamespace || '-' })"
        />
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <CancelButton @click="createDialogVisible = false" />
          <el-button
            type="primary"
            :disabled="!$hasPermission('post')"
            :loading="createLoading"
            @click="submitCreate"
          >
            {{ t('Base.create') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  createTopicMetricCollection,
  deleteTopicMetricCollection,
  getTopicMetricCollection,
  getTopicMetricCollections,
  resetTopicMetricCollection,
} from '@/api/diagnose'
import { GLOBAL_NAMESPACE } from '@/common/constants'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import type {
  TopicMetricCollection,
  TopicMetricCollectionCreate,
  TopicMetricCollectionMetrics,
} from '@/types/typeAlias'
import type { FormInstance, FormRules } from 'element-plus'
import NamespaceResourcePopover from '../RuleEngine/components/NamespaceResourcePopover.vue'

type MetricKey = keyof TopicMetricCollectionMetrics
type TopicMetricCollectionRow = TopicMetricCollection & {
  _expand?: boolean
  _loading?: boolean
}

const { t, tl } = useI18nTl('Tools')
const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const currentNamespace = computed(() => store.getters.userNamespace)
const { isOpNsResourceDisabled } = useNsResource()

const tableRef = ref()
const collections = ref<Array<TopicMetricCollectionRow>>([])
const isLoading = ref(false)
const createDialogVisible = ref(false)
const createLoading = ref(false)

const getNamespaceLabel = (namespace?: string | null) =>
  !namespace || namespace === GLOBAL_NAMESPACE ? t('BasicConfig.global') : namespace

const getRowKey = ({ namespace, name }: TopicMetricCollectionRow) =>
  `${namespace || GLOBAL_NAMESPACE}::${name}`

const tableExpandRowKeys = computed(() =>
  collections.value.filter(({ _expand }) => _expand).map(getRowKey),
)

const isOpNsDisabled = (row: TopicMetricCollectionRow) => isOpNsResourceDisabled(row)
const getMetric = ({ metrics }: TopicMetricCollectionRow, key: MetricKey) => metrics?.[key] ?? 0
const formatCount = (value?: number) => Number(value ?? 0).toLocaleString()
const formatBytes = (value?: number) => transMemorySizeNumToStr(Number(value ?? 0), 2)

let sortFrom: { key: string; type: 'asc' | 'desc' } | undefined
const getSortValue = (row: TopicMetricCollectionRow, key?: string) => {
  if (!key) {
    return ''
  }
  if (key in (row.metrics || {})) {
    return row.metrics[key as MetricKey] ?? 0
  }
  return (row as Record<string, any>)[key] ?? ''
}
const sortCollections = (rows: Array<TopicMetricCollectionRow>) => {
  if (!sortFrom) {
    return rows
  }
  return [...rows].sort((a, b) => {
    const aVal = getSortValue(a, sortFrom?.key)
    const bVal = getSortValue(b, sortFrom?.key)
    if (aVal === bVal) {
      return 0
    }
    const ret = aVal > bVal ? 1 : -1
    return sortFrom?.type === 'desc' ? -ret : ret
  })
}

const loadCollections = async () => {
  isLoading.value = true
  try {
    const rows = (await getTopicMetricCollections()).map((item) => ({
      ...item,
      _expand: false,
      _loading: false,
    }))
    collections.value = sortCollections(rows)
  } catch (error) {
    collections.value = []
  } finally {
    isLoading.value = false
  }
}

const loadCollectionDetail = async (
  row: TopicMetricCollectionRow,
  index: number,
  toggleExpand = true,
) => {
  const rowExpand = toggleExpand ? !row._expand : row._expand
  if (toggleExpand) {
    tableRef.value?.toggleRowExpansion(row, rowExpand)
    if (!rowExpand && collections.value[index]?._expand) {
      collections.value[index]._expand = rowExpand
      return
    }
  }

  row._loading = true
  try {
    const data = await getTopicMetricCollection(row.name)
    collections.value.splice(index, 1, {
      ...data,
      _expand: rowExpand,
      _loading: false,
    })
  } catch (error) {
    row._loading = false
    //
  }
}

const resetCollection = async (row: TopicMetricCollectionRow, index: number) => {
  try {
    await ElMessageBox.confirm(tl('resetCollectionTip', { name: row.name }), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })
    await resetTopicMetricCollection(row.name)
    ElMessage.success(t('Base.resetSuccess'))
    await loadCollectionDetail(row, index, false)
  } catch (error) {
    //
  }
}

const deleteCollection = async (row: TopicMetricCollectionRow) => {
  try {
    await ElMessageBox.confirm(tl('deleteCollectionTip', { name: row.name }), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await deleteTopicMetricCollection(row.name)
    ElMessage.success(t('Base.deleteSuccess'))
    await loadCollections()
  } catch (error) {
    //
  }
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  sortFrom =
    prop && order ? { key: prop, type: order === 'descending' ? 'desc' : 'asc' } : undefined
  collections.value = sortCollections(collections.value)
}

const createFormRef = ref<FormInstance>()
const createForm = reactive<TopicMetricCollectionCreate>({
  name: '',
  topic_filter: '',
})

const { createRequiredRule, createMqttSubscribeTopicRule } = useFormRules()
const createRules: FormRules = {
  name: [
    ...createRequiredRule(tl('collectionName')),
    {
      pattern: /^[A-Za-z0-9_-]{1,64}$/,
      message: tl('collectionNameError'),
      trigger: 'blur',
    },
  ],
  topic_filter: [...createRequiredRule(tl('topicFilter')), ...createMqttSubscribeTopicRule()],
}

const openCreateDialog = () => {
  createForm.name = ''
  createForm.topic_filter = ''
  createDialogVisible.value = true
  nextTick(() => createFormRef.value?.clearValidate())
}

const submitCreate = async () => {
  try {
    await createFormRef.value?.validate()
  } catch (error) {
    return
  }
  createLoading.value = true
  try {
    await createTopicMetricCollection({
      name: createForm.name.trim(),
      topic_filter: createForm.topic_filter.trim(),
    })
    ElMessage.success(t('Base.createSuccess'))
    createDialogVisible.value = false
    await loadCollections()
  } catch (error) {
    //
  } finally {
    createLoading.value = false
  }
}

loadCollections()
</script>

<style lang="scss" scoped>
.el-table :deep(.el-table__expand-icon) {
  display: none;
}
</style>
