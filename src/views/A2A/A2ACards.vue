<template>
  <div class="a2a-cards">
    <el-form class="search-wrapper" @keyup.enter="handleSearch">
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
        <el-col v-bind="SEARCH_FORM_RES_PROPS" class="col-oper">
          <InfoTooltip :content="tl('exactFilterTip')" />
          <SearchButton @click="handleSearch" />
          <ResetButton @click="handleReset" />
        </el-col>
      </el-row>
    </el-form>

    <div class="app-wrapper">
      <div class="section-header !mt-0">
        <div></div>
        <RefreshButton :disabled="!$hasPermission('get')" @click="loadCards" />
        <CreateButton :disabled="!$hasPermission('post')" @click="goRegister">
          {{ tl('registerCard') }}
        </CreateButton>
      </div>

      <TipContainer class="mb-4">
        <MarkdownContent :content="tl('A2AHelp')" />
      </TipContainer>

      <el-table :data="cards" v-loading="isLoading">
        <el-table-column
          :label="t('Base.name')"
          prop="name"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column :label="tl('version')" prop="version" min-width="100" />
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
        <el-table-column :label="t('Base.operation')" min-width="160">
          <template #default="{ row }">
            <TableButton @click="showRaw(row)">{{ tl('agentJson') }}</TableButton>
            <TableButton :disabled="!$hasPermission('delete')" @click="openDeleteDialog">
              {{ t('Base.delete') }}
            </TableButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- Raw card dialog -->
  <el-dialog v-model="rawDialogVisible" :title="tl('agentJson')" width="600px">
    <code-view lang="json" :code="formattedRaw" show-copy-btn />
  </el-dialog>

  <!-- Delete dialog -->
  <el-dialog v-model="deleteDialogVisible" :title="t('Base.delete')" width="480px">
    <p class="delete-dialog-tip">{{ tl('deleteCardTip') }}</p>
    <el-form ref="deleteFormRef" :model="deleteForm" :rules="deleteRules" label-position="top">
      <el-form-item :label="tl('orgId')" prop="org_id">
        <el-input v-model="deleteForm.org_id" />
      </el-form-item>
      <el-form-item :label="tl('unitId')" prop="unit_id">
        <el-input v-model="deleteForm.unit_id" />
      </el-form-item>
      <el-form-item :label="tl('agentId')" prop="agent_id">
        <el-input v-model="deleteForm.agent_id" />
      </el-form-item>
    </el-form>
    <template #footer>
      <CancelButton @click="deleteDialogVisible = false" />
      <el-button type="danger" :loading="isDeleting" @click="confirmDelete">
        {{ t('Base.delete') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { deleteA2ACard, listA2ACards } from '@/api/a2a'
import type { A2ACardListParams, A2ACardOut } from '@/types/typeAlias'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const { t } = useI18n()
const tl = (key: string) => t(`A2A.${key}`)

const isLoading = ref(false)
const cards = ref<A2ACardOut[]>([])

const rawDialogVisible = ref(false)
const formattedRaw = ref('')

const deleteDialogVisible = ref(false)
const isDeleting = ref(false)
const deleteFormRef = ref<FormInstance>()
const deleteForm = ref({ org_id: '', unit_id: '', agent_id: '' })

const filterParams = ref<A2ACardListParams>({
  org_id: undefined,
  unit_id: undefined,
  agent_id: undefined,
})

const ID_PATTERN = /^[A-Za-z0-9._-]+$/
const validateDeleteId = (_rule: any, value: string, callback: (err?: Error) => void) => {
  if (!value) callback(new Error(tl('fieldRequired')))
  else if (!ID_PATTERN.test(value)) callback(new Error(tl('idFormatTip')))
  else callback()
}

const deleteRules: FormRules = {
  org_id: [{ validator: validateDeleteId, trigger: 'blur' }],
  unit_id: [{ validator: validateDeleteId, trigger: 'blur' }],
  agent_id: [{ validator: validateDeleteId, trigger: 'blur' }],
}

const buildParams = (): A2ACardListParams => {
  const p: A2ACardListParams = {}
  if (filterParams.value.org_id) p.org_id = filterParams.value.org_id
  if (filterParams.value.unit_id) p.unit_id = filterParams.value.unit_id
  if (filterParams.value.agent_id) p.agent_id = filterParams.value.agent_id
  return p
}

const loadCards = async () => {
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
  loadCards()
}

const showRaw = (row: A2ACardOut) => {
  try {
    formattedRaw.value = row.raw ? JSON.stringify(JSON.parse(row.raw), null, 2) : ''
  } catch {
    formattedRaw.value = row.raw ?? ''
  }
  rawDialogVisible.value = true
}

const openDeleteDialog = () => {
  deleteForm.value = {
    org_id: filterParams.value.org_id ?? '',
    unit_id: filterParams.value.unit_id ?? '',
    agent_id: filterParams.value.agent_id ?? '',
  }
  deleteDialogVisible.value = true
  nextTick(() => deleteFormRef.value?.clearValidate())
}

const confirmDelete = async () => {
  if (!deleteFormRef.value) return
  try {
    await deleteFormRef.value.validate()
  } catch {
    return
  }
  isDeleting.value = true
  try {
    const { org_id, unit_id, agent_id } = deleteForm.value
    await deleteA2ACard(org_id, unit_id, agent_id)
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

loadCards()
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

.raw-card-pre {
  background-color: var(--color-bg-secondary, #f5f7fa);
  border-radius: 4px;
  padding: 16px;
  overflow: auto;
  max-height: 400px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.delete-dialog-tip {
  margin-bottom: 16px;
  color: var(--color-text-secondary);
  font-size: 13px;
}
</style>
