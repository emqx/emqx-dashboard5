<template>
  <div class="schema-detail">
    <div class="detail-top">
      <detail-header :item="{ name: schemaName, routeName: 'internal-schema' }">
        <template #content>
          <div class="vertical-align-center">
            <p class="block-title">{{ schemaName }}</p>
            <StatusDetailsOfEachNode v-if="isExternalHTTP" :status-data="statusData" is-tag />
          </div>
        </template>
        <template #extra>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              type="danger"
              :disabled="!$hasPermission('delete')"
              :icon="Delete"
              @click="handleDelete"
              plain
            >
            </el-button>
          </el-tooltip>
        </template>
      </detail-header>
      <div class="btn-wrap"></div>
    </div>
    <el-tabs class="detail-tabs">
      <div class="app-wrapper">
        <el-tab-pane :label="t('Base.setting')">
          <el-card class="detail-card overview-visible" v-loading="isLoading">
            <SchemaRegistryForm
              class="schema-create-form"
              ref="FormCom"
              v-model="schemaData"
              is-edit
            />
            <el-button
              type="primary"
              :disabled="!$hasPermission('put')"
              :loading="isSubmitting"
              @click="handleUpdate"
            >
              {{ $t('Base.update') }}
            </el-button>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { deleteSchema, querySchemaDetail, updateSchema } from '@/api/ruleengine'
import { SchemaRegistryDetail } from '@/types/rule'
import { Delete } from '@element-plus/icons-vue'
import SchemaRegistryForm from './components/SchemaRegistryForm.vue'
import { ConnectionStatus, SchemaRegistryType } from '@/types/enum'

const route = useRoute()
const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const schemaData = ref<SchemaRegistryDetail>({} as SchemaRegistryDetail)
const isLoading = ref(false)

const FormCom = ref()

const schemaName = computed(() => route.params.schemaName.toString())

const isExternalHTTP = computed(() => schemaData.value.type === SchemaRegistryType.ExternalHTTP)

const { getStatusClass, getStatusLabel } = useCommonConnectionStatus()
const getStatusLabelNClass = (status: ConnectionStatus) => ({
  statusLabel: getStatusLabel(status),
  statusClass: getStatusClass(status),
})
const statusData = computed(() => {
  const { status, node_status = {} } = schemaData.value
  return {
    details: Object.entries(node_status).map(([node, status]) => ({
      node,
      ...getStatusLabelNClass(status as ConnectionStatus),
    })),
    statusLabel: getStatusLabel(status),
    statusClass: getStatusClass(status),
  }
})

const getSchemaData = async () => {
  if (!schemaName.value) {
    return
  }
  try {
    isLoading.value = true
    schemaData.value = await querySchemaDetail(schemaName.value)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const isSubmitting = ref(false)
const { handleFormDataForUpdate } = useSchemaRegistryForm()
const handleUpdate = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value.validate()
    await updateSchema(schemaName.value, handleFormDataForUpdate(schemaData.value))
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'internal-schema' })
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await deleteSchema(schemaName.value)
    ElMessage.success(t('Base.deleteSuccess'))
    router.push({ name: 'internal-schema' })
  } catch (error) {
    //
  }
}

getSchemaData()
</script>

<style lang="scss" scoped>
.schema-detail {
  .detail-header {
    margin-bottom: 18px;
  }
}
.schema-create-form {
  width: 70%;
}
</style>
