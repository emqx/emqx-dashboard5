<template>
  <div class="a2a-cards" v-loading="isLoading">
    <el-form v-if="isA2AEnabled" class="search-wrapper" @keyup.enter="handleSearch">
      <el-row :gutter="20">
        <el-col v-bind="SEARCH_FORM_RES_PROPS">
          <el-input
            v-model="filterParams.org_id"
            :placeholder="tl('orgId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col v-bind="SEARCH_FORM_RES_PROPS">
          <el-input
            v-model="filterParams.unit_id"
            :placeholder="tl('unitId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col v-bind="SEARCH_FORM_RES_PROPS">
          <el-input
            v-model="filterParams.agent_id"
            :placeholder="tl('agentId')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <template v-if="showMoreQuery">
          <el-col v-if="isMultiTenancyEnabled && !isNamespaceUser" v-bind="SEARCH_FORM_RES_PROPS">
            <NamespaceSelect
              v-model="namespaceFilter"
              :global="{ enable: true, value: GLOBAL_NAMESPACE_VALUE }"
              @clear="handleSearch"
              @change="handleSearch"
            />
          </el-col>
        </template>
        <el-col v-bind="showMoreQuery ? { span: 24 } : SEARCH_FORM_RES_PROPS" class="col-oper">
          <InfoTooltip :content="tl('exactFilterTip')" />
          <SearchButton @click="handleSearch" />
          <ResetButton @click="handleReset" />
          <ShowMoreButton v-model="showMoreQuery" />
        </el-col>
      </el-row>
    </el-form>

    <A2AGuidance v-if="!isLoading && !isA2AEnabled" />

    <div v-else class="app-wrapper">
      <div class="section-header !mt-0">
        <div></div>
        <LinkButton :to="{ name: 'a2a-registry-settings' }">
          <Settings class="mr-2" />
          {{ t('Base.setting') }}
        </LinkButton>
        <RefreshButton :disabled="!$hasPermission('get')" @click="loadCards" />
        <CreateButton :disabled="!$hasPermission('post')" @click="goRegister">
          {{ tl('registerCard') }}
        </CreateButton>
      </div>

      <TipContainer class="mb-4">
        <MarkdownContent :content="tl('A2AHelp')" />
      </TipContainer>

      <el-table :data="cards">
        <el-table-column
          :label="t('Base.name')"
          prop="name"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column :label="tl('version')" prop="version" min-width="100" />
        <el-table-column
          v-if="isMultiTenancyEnabled && !isNamespaceUser"
          :label="tl('namespace')"
          min-width="140"
        >
          <template #default="{ row }">
            {{ getNamespaceLabel(row.namespace) }}
          </template>
        </el-table-column>
        <el-table-column :label="tl('orgId')" prop="org_id" min-width="120" show-overflow-tooltip />
        <el-table-column
          :label="tl('unitId')"
          prop="unit_id"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column :label="tl('agentId')" prop="agent_id" min-width="120">
          <template #default="{ row }">
            <CommonOverflowTooltip :content="row.agent_id" />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('Base.description')"
          prop="description"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column :label="t('Base.status')" min-width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'online' ? 'success' : 'info'"
              size="small"
              effect="light"
            >
              {{ row.status === 'online' ? tl('online') : tl('offline') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('Base.operation')" min-width="152">
          <template #default="{ row }">
            <TableButton
              :disabled="!$hasPermission('post') || !row.org_id || !row.unit_id || !row.agent_id"
              @click="goEdit(row)"
            >
              {{ t('Base.edit') }}
            </TableButton>
            <NamespaceResourcePopover
              v-if="isOpNsDisabled(row)"
              :namespace="row.namespace || undefined"
              :target-label="tl('agentCardLabel')"
            >
              <template #default>
                <TableButton disabled>
                  {{ t('Base.delete') }}
                </TableButton>
              </template>
            </NamespaceResourcePopover>
            <TableButton
              v-else
              :disabled="!$hasPermission('delete') || !row.org_id || !row.unit_id || !row.agent_id"
              @click="handleDelete(row)"
            >
              {{ t('Base.delete') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- Delete confirmation dialog -->
  <el-dialog v-model="deleteDialogVisible" :title="t('Base.confirmDelete')" width="600px">
    <p class="mb-4">{{ tl('deleteConfirm') }}</p>
    <el-descriptions :column="1" :label-width="150" border>
      <el-descriptions-item
        v-if="isMultiTenancyEnabled && !isNamespaceUser"
        :label="tl('namespace')"
      >
        {{ getNamespaceLabel(deletingRow?.namespace) }}
      </el-descriptions-item>
      <el-descriptions-item :label="tl('orgId')"> {{ deletingRow?.org_id }}</el-descriptions-item>
      <el-descriptions-item :label="tl('unitId')">{{ deletingRow?.unit_id }}</el-descriptions-item>
      <el-descriptions-item :label="tl('agentId')">
        {{ deletingRow?.agent_id }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="mt-4">
      <p class="mb-2 text-sm text-gray-500">{{ tl('agentJson') }}</p>
      <code-view lang="json" :code="deletingFormattedRaw" show-copy-btn />
    </div>
    <template #footer>
      <CancelButton @click="deleteDialogVisible = false" />
      <el-button type="danger" :loading="isDeleting" @click="confirmDelete">
        {{ t('Base.delete') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { deleteA2ACard, getA2ARegistryConfig, listA2ACards } from '@/api/a2a'
import { GLOBAL_NAMESPACE_VALUE, type NamespaceSelection } from '@/common/constants'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import type { A2ACardListParams, A2ACardOut } from '@/types/typeAlias'
import { Settings } from 'lucide-vue-next'
import NamespaceResourcePopover from '../RuleEngine/components/NamespaceResourcePopover.vue'
import A2AGuidance from './components/A2AGuidance.vue'

const router = useRouter()
const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const { t } = useI18n()
const tl = (key: string) => t(`A2A.${key}`)
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const getNamespaceLabel = (namespace?: string) => (namespace ? namespace : t('BasicConfig.global'))
const { isOpNsResourceDisabled } = useNsResource()
const isOpNsDisabled = (row?: { namespace?: string | null }) => isOpNsResourceDisabled(row)

const isLoading = ref(false)
const isA2AEnabled = ref(false)
const cards = ref<A2ACardOut[]>([])
const showMoreQuery = ref(false)

const deleteDialogVisible = ref(false)
const deletingRow = ref<A2ACardOut | null>(null)
const deletingFormattedRaw = ref('')
const isDeleting = ref(false)

const filterParams = ref<A2ACardListParams>({
  org_id: undefined,
  unit_id: undefined,
  agent_id: undefined,
})
const namespaceFilter = ref<NamespaceSelection | undefined>(undefined)
const { getListNamespaceParams } = useListNsParams()
const { getNsParams } = useNsParams()

const buildParams = (): A2ACardListParams => {
  const p: A2ACardListParams = {
    ...(isMultiTenancyEnabled.value && !isNamespaceUser.value
      ? getListNamespaceParams(namespaceFilter.value)
      : {}),
  }
  if (filterParams.value.org_id) p.org_id = filterParams.value.org_id
  if (filterParams.value.unit_id) p.unit_id = filterParams.value.unit_id
  if (filterParams.value.agent_id) p.agent_id = filterParams.value.agent_id
  return p
}

const loadCards = async () => {
  if (!isA2AEnabled.value) return
  isLoading.value = true
  try {
    cards.value = await listA2ACards(buildParams())
  } catch (error) {
    cards.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => loadCards()

const handleReset = () => {
  filterParams.value = { org_id: undefined, unit_id: undefined, agent_id: undefined }
  namespaceFilter.value = undefined
  loadCards()
}

const handleDelete = (row: A2ACardOut) => {
  deletingRow.value = row
  try {
    deletingFormattedRaw.value = row.raw ? JSON.stringify(JSON.parse(row.raw), null, 2) : ''
  } catch {
    deletingFormattedRaw.value = row.raw ?? ''
  }
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!deletingRow.value) return
  isDeleting.value = true
  try {
    await deleteA2ACard(
      deletingRow.value.org_id!,
      deletingRow.value.unit_id!,
      deletingRow.value.agent_id!,
      getNsParams(deletingRow.value.namespace),
    )
    ElMessage.success(t('Base.deleteSuccess'))
    deleteDialogVisible.value = false
    loadCards()
  } catch (error) {
    // handled by global error handler
  } finally {
    isDeleting.value = false
  }
}

const goRegister = () => {
  router.push({ name: 'a2a-registry-register' })
}

const goEdit = (row: A2ACardOut) => {
  const { org_id, unit_id, agent_id } = row
  router.push({
    name: 'a2a-registry-edit',
    params: { org_id, unit_id, agent_id },
    query: getNsParams(row.namespace),
  })
}

const loadData = async () => {
  try {
    isLoading.value = true
    const config = await getA2ARegistryConfig()
    isA2AEnabled.value = config.enable ?? false
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
  if (isA2AEnabled.value) {
    loadCards()
  }
}

loadData()
</script>

<style lang="scss" scoped>
.a2a-cards {
  .tip-container {
    :deep(.markdown-body ol) {
      padding-left: 1em;
    }
    :deep(p) {
      margin-bottom: 4px;
    }
  }
}
</style>
