<template>
  <div class="message-validation app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        :disabled="!$hasPermission('post')"
        type="primary"
        @click="addValidation"
        :icon="Plus"
      >
        {{ t('Base.create') }}
      </el-button>
    </div>
    <el-table
      ref="tableCom"
      :data="validationList"
      v-loading="isLoading"
      class="table-with-draggable"
      row-key="name"
    >
      <el-table-column :label="t('Base.name')" row-key="name" show-overflow-tooltip>
        <template #default="{ row }">
          <router-link
            :to="{ name: 'schema-validation-detail', params: { validationName: row.name } }"
            class="table-data-without-break"
          >
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('sourceTopic')">
        <template #default="{ row }">
          <div class="topic-list">
            <span class="topic-item" v-for="item in row.topics || []" :key="item">
              <CommonOverflowTooltip :content="item" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch
            v-model="row.enable"
            :disabled="!$hasPermission('put')"
            @change="toggleValidationEnable(row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="tl('actionAfterFailure')">
        <template #default="{ row }">
          {{ getLabelByValue(row.failure_action) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" :label="t('Base.note')" />
      <el-table-column :label="t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button size="small" @click="goDetail(row.name)">
            {{ t('Base.setting') }}
          </el-button>
          <MovableItemTableItemDrop
            :table-data-len="validationList.length"
            :row-index="$index"
            @delete="handleDel(row.name)"
            @move-up="relativeMove($index, -1)"
            @move-down="relativeMove($index, 1)"
            @move-to-top="absoluteMove($index, 0)"
            @move-to-bottom="absoluteMove($index, validationList.length - 1)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {
  deleteValidation,
  enableDisableValidation,
  getSchemaValidations,
  reorderAllValidations,
} from '@/api/schemaValidation'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import { useFailureAction } from '@/hooks/Rule/validation/useValidation'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import useSortableTable from '@/hooks/useSortableTable'
import { DetailTab } from '@/types/enum'
import { SchemaValidation } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { SortableEvent } from 'sortablejs'
import { Ref, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MovableItemTableItemDrop from '../components/MovableItemTableItemDrop.vue'

const router = useRouter()
const { tl, t } = useI18nTl('RuleEngine')

const validationList: Ref<Array<SchemaValidation>> = ref([])
const isLoading = ref(false)

const getList = async () => {
  try {
    isLoading.value = true
    validationList.value = await getSchemaValidations()
    await nextTick()
    initSortable()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goDetail = (name: string) =>
  router.push({
    name: 'schema-validation-detail',
    params: { validationName: name },
    query: { tab: DetailTab.Setting },
  })

const addValidation = () => {
  router.push({ name: 'schema-validation-create' })
}

const { confirmDel } = useOperationConfirm()
const handleDel = async (name: string) => {
  try {
    await confirmDel(() => deleteValidation(name))
    getList()
  } catch (error) {
    //
  }
}

const toggleValidationEnable = async (data: SchemaValidation) => {
  try {
    await enableDisableValidation(data.name, data.enable ?? true)
    ElMessage.success(t(data.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    data.enable = !data.enable
  }
}

const { getLabelByValue } = useFailureAction()

const reorderValidation = async (order: Array<string>) => {
  try {
    await reorderAllValidations({ order })
  } catch (error) {
    //
  } finally {
    getList()
  }
}

const moveToTargetPosition = async (nowIndex: number, targetIndex: number) => {
  const order = validationList.value.map((item) => item.name)
  const [removed] = order.splice(nowIndex, 1)
  order.splice(targetIndex, 0, removed)
  reorderValidation(order)
}

const relativeMove = (nowIndex: number, relativePosition: number) => {
  const targetIndex = nowIndex + relativePosition
  if (targetIndex < 0 || targetIndex >= validationList.value.length) {
    return
  }
  moveToTargetPosition(nowIndex, targetIndex)
}

const absoluteMove = (nowIndex: number, absolutePosition: number) => {
  if (nowIndex === absolutePosition) {
    return
  }
  moveToTargetPosition(nowIndex, absolutePosition)
}

const handleOrderChanged = async (evt: SortableEvent) => {
  const { newIndex, oldIndex } = evt
  if (newIndex === undefined || oldIndex === undefined) {
    return
  }
  absoluteMove(oldIndex, newIndex)
}

const { tableCom, initSortable } = useSortableTable(handleOrderChanged)

onMounted(() => {
  getList()
})
</script>
