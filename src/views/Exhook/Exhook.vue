<template>
  <div class="exhook app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" size="small" @click="addExhook">
        {{ $t('Base.add') }}
      </el-button>
    </div>
    <el-table
      ref="tableCom"
      class="exhook-table"
      :data="exhooks"
      v-loading.lock="isTableLoading"
      row-key="name"
    >
      <el-table-column prop="name" :label="tl('name')">
        <template #default="{ row }">
          <router-link :to="exhookDetailRoute(row)">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('numberOfHooks')">
        <template #default="{ row }">
          {{ row.hooks.length }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('success')">
        <template #default="{ row }">
          {{ row.metrics.succeed }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('failure')">
        <template #default="{ row }">
          {{ row.metrics.failed }}
        </template>
      </el-table-column>
      <el-table-column :label="`${tl('speed')}(${tl('second')})`">
        <template #default="{ row }">
          {{ row.metrics.rate }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('status')">
        <template #default="{ row }">
          <!-- TODO:style detail -->
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="mini">{{ tl('setting', 'Base') }}</el-button>
          <el-button
            size="mini"
            v-if="row.status === ConnectionStatus.Connected"
            @click="changeExhookStatus(row, true)"
          >
            {{ tl('enable', 'Base') }}
          </el-button>
          <el-button
            size="mini"
            v-else-if="row.status === ConnectionStatus.Disconnected"
            @click="changeExhookStatus(row, false)"
          >
            {{ tl('disable', 'Base') }}
          </el-button>
          <TableItemDropdown
            :row-data="row"
            @move-to-top="moveExhookItemToTop"
            @move-to-bottom="moveExhookItemToBottom"
            @delete="handleDeleteExhook(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ConnectionStatus } from '@/types/enum'
import TableItemDropdown from './components/TableItemDropdown.vue'
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useHandleExhookItem from '@/hooks/Exhook/useHandleExhookItem'
import { Exhook } from '@/types/systemModule'
import { queryExhooks } from '@/api/exhook'
import useSortableTable, { SortableEvent } from '@/hooks/useSortableTable'

const router = useRouter()
const { t } = useI18n()

const exhooks: Ref<Array<Exhook>> = ref([])
const isTableLoading = ref(false)

const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const getExhooks = async () => {
  exhooks.value = await queryExhooks()
  initSortable()
  console.table(exhooks.value)
}

const addExhook = () => {
  router.push({ name: 'exhook-create' })
}

const {
  deleteExhook,
  updateExhookEnable,
  moveExhookToTop,
  moveExhookToBottom,
  moveExhookBeforeAnotherExhook,
  moveExhookAfterAnotherExhook,
} = useHandleExhookItem()

const moveExhookItemToTop = async (row: Exhook) => {
  try {
    await moveExhookToTop(row)
  } catch (error) {
    // error
  } finally {
    getExhooks()
  }
}

const moveExhookItemToBottom = async (row: Exhook) => {
  try {
    await moveExhookToBottom(row)
  } catch (error) {
    // error
  } finally {
    getExhooks()
  }
}

const exhookDetailRoute = ({ name }: Exhook) => ({
  name: 'exhook-detail',
  params: { exhookName: name },
})

const changeExhookStatus = async (exhook: Exhook, enable: boolean) => {
  await updateExhookEnable(exhook, enable)
  getExhooks()
}

const handleDeleteExhook = async (exhook: Exhook) => {
  await deleteExhook(exhook.name)
  getExhooks()
}

const handleOrderChanged = async (evt: SortableEvent) => {
  if (evt.newIndex === undefined || evt.oldIndex === undefined) {
    return
  }

  const targetExhook = exhooks.value[evt.oldIndex]
  const isTheLast = evt.newIndex === exhooks.value.length - 1
  const isFirst = evt.newIndex === 0
  // FIXME: bug
  try {
    if (isTheLast) {
      moveExhookToBottom(targetExhook)
    } else if (isFirst) {
      moveExhookToTop(targetExhook)
    } else {
      await moveExhookBeforeAnotherExhook(targetExhook, exhooks.value[evt.newIndex + 1])
    }
  } catch (error) {
    console.error(error)
  } finally {
    getExhooks()
  }
}

const { tableCom, initSortable } = useSortableTable(handleOrderChanged)

getExhooks()
</script>
