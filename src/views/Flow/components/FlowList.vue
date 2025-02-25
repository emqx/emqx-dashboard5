<template>
  <div class="flow-list">
    <div class="search-block">
      <el-form @keyup.enter="search">
        <el-row :gutter="52">
          <el-col v-bind="colProps">
            <el-form-item label="ID">
              <el-input type="text" v-model="filterParams.like_id" clearable @clear="search" />
            </el-form-item>
          </el-col>
          <el-col v-bind="colProps">
            <el-form-item :label="$t('Base.topic')">
              <el-input
                clearable
                type="text"
                v-model="filterParams[keyForSearchTopic]"
                @clear="search"
              >
                <template #prepend>
                  <el-select class="select-topic-type" v-model="keyForSearchTopic">
                    <el-option
                      v-for="{ label, value } in KEYS_FOR_SEARCH_TOPIC"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-bind="colProps">
            <el-form-item :label="$t('Base.isEnabled')">
              <el-select
                class="select-status"
                v-model="filterParams.enable"
                clearable
                @clear="search"
              >
                <el-option :label="$t('Base.enabled')" :value="true" />
                <el-option :label="$t('Base.disabled')" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="btnContainerProps" class="btn-container">
            <el-button @click="clearFilterForm">
              {{ $t('Base.reset') }}
            </el-button>
            <el-button type="primary" @click="search">
              {{ $t('Base.search') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="ruleList" v-loading="isLoading">
      <el-table-column prop="id" :label="t('Base.name')" />
      <el-table-column :label="tl('source')">
        <template #default="{ row }">
          <div class="inputs-container">
            <el-tag class="input-item" type="info" v-for="item in row.from" :key="item">
              {{ item }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
        <template #default="{ row }">
          <el-switch v-model="row.enable" @change="handleToggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-icon><EditPen /></el-icon>
          <el-icon><PieChart /></el-icon>
          <FlowTableDropDown
            :row-data="row"
            @copy="copyFlowItem(row)"
            @delete="submitDeleteRules"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <CommonPagination :meta-data="pageMeta" @load-page="getList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteRules, getRules } from '@/api/ruleengine'

import CommonPagination from '@/components/commonPagination.vue'

import { RuleItem } from '@/types/rule'
import { EditPen, PieChart } from '@element-plus/icons-vue'

import FlowTableDropDown from './FlowTableDropDown.vue'

const colProps = { sm: 12, md: 12, lg: 8 }
const btnContainerProps = { sm: 12, md: 12, lg: 24 }

const { t, tl } = useI18nTl('RuleEngine')

const isLoading = ref(false)
const ruleList: Ref<Array<RuleItem>> = ref([])

const createRawFilterParams = () => ({
  like_id: undefined,

  like_from: undefined,
  match_from: undefined,

  enable: undefined,
})

const filterParams = ref(createRawFilterParams())

const { resetPageNum } = usePagination()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const KEYS_FOR_SEARCH_TOPIC: Array<{ value: 'like_from' | 'match_from'; label: string }> = [
  { value: 'like_from', label: t('Base.topic') },
  { value: 'match_from', label: t('Clients.wildcard') },
]
const keyForSearchTopic: Ref<'like_from' | 'match_from'> = ref(KEYS_FOR_SEARCH_TOPIC[0].value)

const getList = async () => {
  isLoading.value = true
  try {
    const { data = [], meta } = await getRules({
      ...pageParams.value,
      ...checkNOmitFromObj(filterParams.value),
    })
    ruleList.value = data
    setPageMeta(meta)
  } catch (error) {
    ruleList.value = []
    initPageMeta()
  } finally {
    isLoading.value = false
  }
}

const search = () => {
  pageMeta.value.page = 1
  getList()
}

const clearFilterForm = () => {
  filterParams.value = createRawFilterParams()
  search()
}

const handleToggleStatus = () => {
  // TODO: toggle rule status
  // TODO: toggle bridge status
}

const copyFlowItem = () => {
  // TODO:
}

const submitDeleteRules = async ({ id }: RuleItem) => {
  if (!id) return
  await ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
  isLoading.value = true
  try {
    await deleteRules(id)
    // TODO: maybe delete bridge
    ElMessage.success(t('Base.deleteSuccess'))
    pageMeta.value.page = resetPageNum(ruleList.value, pageMeta.value.page)
    getList()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

getList()
</script>

<style lang="scss">
.flow-list {
  padding: 24px;
  background-color: var(--color-bg-content);
  .search-block {
    position: relative;
    padding: 24px;
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 8px;
    background-color: var(--color-bg-split);
  }
  .btn-container {
    display: flex;
    justify-content: flex-end;
  }

  .el-table {
    .el-icon {
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
    .el-dropdown {
      vertical-align: baseline;
    }
  }
}
</style>
