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
          <DeleteButton @click="handleDelete" />
        </template>
      </detail-header>
      <div class="btn-wrap"></div>
    </div>
    <el-tabs class="detail-tabs">
      <div class="app-wrapper">
        <el-tab-pane :label="t('Base.setting')">
          <el-card class="detail-card app-card overview-visible" v-loading="isLoading">
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
import {
  deleteSchema,
  querySchemaDetail,
  updateProtobufBundleSchema,
  updateSchema,
} from '@/api/ruleengine'
import { ConnectionStatus, SchemaRegistryType } from '@/types/enum'
import { SchemaRegistryEditForm } from '@/types/rule'
import SchemaRegistryForm from './components/SchemaRegistryForm.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const schemaData = ref<SchemaRegistryEditForm>({} as SchemaRegistryEditForm)
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
  if (schemaData.value.type !== SchemaRegistryType.ExternalHTTP) {
    return
  }
  const { status: s, node_status = {} } = schemaData.value
  const status = s as ConnectionStatus
  return {
    details: Object.entries(node_status).map(([node, status]) => ({
      node,
      ...getStatusLabelNClass(status as ConnectionStatus),
    })),
    statusLabel: getStatusLabel(status),
    statusClass: getStatusClass(status),
  }
})

const { handleFormDataForUpdate, handleDataForViewDetail, isProtobufBundleData } =
  useSchemaRegistryForm()

const getSchemaData = async () => {
  if (!schemaName.value) {
    return
  }
  try {
    isLoading.value = true
    const data = await querySchemaDetail(schemaName.value)
    schemaData.value = handleDataForViewDetail(data)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const isSubmitting = ref(false)
const handleUpdate = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value.validate()
    const data = handleFormDataForUpdate(schemaData.value)
    await (isProtobufBundleData(data)
      ? updateProtobufBundleSchema(data)
      : updateSchema(schemaName.value, data))
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
  width: 80%;
}
</style>
