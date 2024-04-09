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
    <el-table :data="validationList" v-loading="isLoading">
      <el-table-column :label="t('Base.name')" row-key="name">
        <template #default="{ row }">
          <router-link
            :to="{ name: 'message-validation-detail', params: { validationName: row.name } }"
            class="table-data-without-break"
          >
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('sourceTopic')">
        <template #default="{ row }">
          {{ row.topics?.join(', ') }}
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
          <TableItemDropdown
            :row-data="row"
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
  getMessageValidations,
  reorderAllValidations,
} from '@/api/messageValidation'
import { useFailureAction } from '@/hooks/Rule/validation/useValidation'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { MessageValidation } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Ref, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TableItemDropdown from './components/TableItemDropdown.vue'

const router = useRouter()
const { tl, t } = useI18nTl('RuleEngine')

const validationList: Ref<Array<MessageValidation>> = ref([])
const isLoading = ref(false)

const getList = async () => {
  try {
    isLoading.value = true
    validationList.value = await getMessageValidations()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goDetail = (name: string) =>
  router.push({ name: 'message-validation-detail', params: { validationName: name } })

const addValidation = () => {
  router.push({ name: 'message-validation-create' })
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

const toggleValidationEnable = async (data: MessageValidation) => {
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

const relativeMove = (nowIndex: number, relativePosition: number) => {
  const targetIndex = nowIndex + relativePosition
  if (targetIndex < 0 || targetIndex >= validationList.value.length) {
    return
  }
  const order = validationList.value.map((item) => item.name)
  const [removed] = order.splice(nowIndex, 1)
  order.splice(targetIndex, 0, removed)
  reorderValidation(order)
}
const absoluteMove = (nowIndex: number, absolutePosition: number) => {
  if (nowIndex === absolutePosition) {
    return
  }
  const order = validationList.value.map((item) => item.name)
  const [removed] = order.splice(nowIndex, 1)
  order.splice(absolutePosition, 0, removed)
  reorderValidation(order)
}

onMounted(() => {
  getList()
})
</script>
