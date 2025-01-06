<template>
  <div class="message-transform app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="addTransform" />
    </div>
    <el-table
      ref="tableCom"
      :data="tableData"
      v-loading="isLoading"
      class="table-with-draggable"
      row-key="name"
    >
      <el-table-column :label="t('Base.name')" row-key="name" show-overflow-tooltip>
        <template #default="{ row }">
          <router-link
            :to="{ name: 'message-transform-detail', params: { transformName: row.name } }"
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
            @change="toggleTransformEnable(row)"
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
          <TableButton @click="goDetail(row.name)">
            {{ t('Base.setting') }}
          </TableButton>
          <MovableItemTableItemDrop
            :table-data-len="tableData.length"
            :row-index="$index"
            @delete="handleDel(row.name)"
            @move-up="relativeMove($index, -1)"
            @move-down="relativeMove($index, 1)"
            @move-to-top="absoluteMove($index, 0)"
            @move-to-bottom="absoluteMove($index, tableData.length - 1)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {
  deleteMessageTransform,
  enableDisableMessageTransform,
  getMessageTransforms,
  reorderMessageTransforms,
} from '@/api/messageTransformation'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import { useFailureAction } from '@/hooks/Rule/validation/useValidation'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import useSortableTable from '@/hooks/useSortableTable'
import { DetailTab } from '@/types/enum'
import { MessageTransform } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { SortableEvent } from 'sortablejs'
import { Ref, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MovableItemTableItemDrop from '../components/MovableItemTableItemDrop.vue'

const router = useRouter()
const { tl, t } = useI18nTl('RuleEngine')

const tableData: Ref<Array<MessageTransform>> = ref([])
const isLoading = ref(false)

const getList = async () => {
  try {
    isLoading.value = true
    tableData.value = await getMessageTransforms()
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
    name: 'message-transform-detail',
    params: { transformName: name },
    query: { tab: DetailTab.Setting },
  })

const addTransform = () => {
  router.push({ name: 'message-transform-create' })
}

const { confirmDel } = useOperationConfirm()
const handleDel = async (name: string) => {
  try {
    await confirmDel(() => deleteMessageTransform(name))
    getList()
  } catch (error) {
    //
  }
}

const toggleTransformEnable = async (data: MessageTransform) => {
  try {
    await enableDisableMessageTransform(data.name, data.enable ?? true)
    ElMessage.success(t(data.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    data.enable = !data.enable
  }
}

const { getLabelByValue } = useFailureAction()

const reorderTransform = async (order: Array<string>) => {
  try {
    await reorderMessageTransforms({ order })
  } catch (error) {
    //
  } finally {
    getList()
  }
}

const moveToTargetPosition = async (nowIndex: number, targetIndex: number) => {
  const order = tableData.value.map((item) => item.name)
  const [removed] = order.splice(nowIndex, 1)
  order.splice(targetIndex, 0, removed)
  reorderTransform(order)
}

const relativeMove = (nowIndex: number, relativePosition: number) => {
  const targetIndex = nowIndex + relativePosition
  if (targetIndex < 0 || targetIndex >= tableData.value.length) {
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
