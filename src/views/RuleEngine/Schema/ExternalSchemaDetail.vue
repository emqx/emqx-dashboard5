<template>
  <div class="schema-detail">
    <div class="detail-top">
      <detail-header :item="{ name: schemaName, routeName: 'external-schema' }">
        <template #content>
          <CommonOverflowTooltip :content="schemaName" />
        </template>
      </detail-header>
      <div class="btn-wrap">
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
      </div>
    </div>
    <el-tabs class="detail-tabs">
      <div class="app-wrapper">
        <el-tab-pane :label="t('Base.setting')">
          <el-card class="detail-card overview-visible" v-loading="isLoading">
            <ExternalSchemaForm
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
import { deleteExternalSchema, getExternalSchemaDetail, putExternalSchema } from '@/api/ruleengine'
import DetailHeader from '@/components/DetailHeader.vue'
import PreWithEllipsis from '@/components/PreWithEllipsis.vue'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import type { ExternalSchema } from '@/types/typeAlias'
import { Delete } from '@element-plus/icons-vue'

import ExternalSchemaForm from './components/ExternalSchemaForm.vue'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const schemaData = ref({} as ExternalSchema)

const isLoading = ref(false)

const FormCom = ref()

const schemaName = computed(() => route.params.schemaName.toString())

const getSchemaData = async () => {
  if (!schemaName.value) {
    return
  }
  try {
    isLoading.value = true
    const data = await getExternalSchemaDetail(schemaName.value)
    schemaData.value = { ...data, name: schemaName.value }
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
    await putExternalSchema(schemaName.value, omit(cloneDeep(schemaData.value), 'name'))
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'external-schema' })
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteExternalSchema(schemaName.value))
    router.push({ name: 'external-schema' })
  } catch (error) {
    //
  }
}

getSchemaData()
</script>

<style lang="scss" scoped>
.schema-detail {
  .detail-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .detail-header {
    margin-bottom: 18px;
  }
}
.schema-create-form {
  width: 70%;
}
</style>
