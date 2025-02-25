<template>
  <div class="validation-detail" v-loading.lock="isLoading">
    <div class="detail-top">
      <detail-header :item="{ name: validationName, routeName: 'schema-validation' }">
        <template #content>
          <StatusDetailsOfEachNode :status-data="statusData" is-tag />
        </template>
        <template #extra>
          <el-tooltip
            :content="validationData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              v-model="validationData.enable"
              :disabled="!$hasPermission('put')"
              @change="(val) => toggleEnable(val as boolean)"
            />
          </el-tooltip>
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
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" :name="DetailTab.Overview" lazy>
          <ValidationOverview :validation-name="validationName" />
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="DetailTab.Setting">
          <el-card class="app-card">
            <SchemaValidationForm
              v-if="!isLoading"
              ref="formCom"
              v-model="validationData"
              is-edit
            />
            <el-button
              type="primary"
              :disabled="!$hasPermission('put')"
              :loading="isSubmitting"
              @click="updateValidation"
            >
              {{ $t('Base.update') }}
            </el-button>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {
  deleteValidation,
  enableDisableValidation,
  getSchemaValidationDetail,
  putSchemaValidation,
} from '@/api/schemaValidation'
import DetailHeader from '@/components/DetailHeader.vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { NodeStatusClass } from '@/types/enum'
import type { SchemaValidation } from '@/types/typeAlias'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { useRoute, useRouter } from 'vue-router'
import SchemaValidationForm from './components/SchemaValidationForm.vue'
import { DetailTab } from '@/types/enum'
import ValidationOverview from './components/ValidationOverview.vue'

const router = useRouter()
const route = useRoute()

const { t, tl } = useI18nTl('RuleEngine')

const activeTab = ref(DetailTab.Overview)

const validationName = computed(() => route.params.validationName.toString())

const formCom = ref()
const isLoading = ref(false)
const validationData: Ref<SchemaValidation> = ref({} as SchemaValidation)
const isSubmitting = ref(false)

const queryTab = computed(() => {
  return route.query.tab && Number(route.query.tab)
})
if (queryTab.value !== undefined) {
  activeTab.value = queryTab.value as DetailTab
}

const statusData = computed(() => {
  const { enable } = validationData.value
  return {
    statusLabel: enable ? t('Base.enable') : t('Base.disabled'),
    statusClass: enable ? NodeStatusClass.Success : NodeStatusClass.Danger,
  }
})

const getDetail = async () => {
  try {
    isLoading.value = true
    const data = await getSchemaValidationDetail(validationName.value)
    validationData.value = data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const updateValidation = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await putSchemaValidation(validationData.value)
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'schema-validation' })
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const toggleEnable = async (enable: boolean) => {
  try {
    await enableDisableValidation(validationName.value, enable)
    ElMessage.success(t(enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    validationData.value.enable = !enable
  }
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteValidation(validationName.value))
    router.push({ name: 'schema-validation' })
  } catch (error) {
    console.error(error)
  }
}

getDetail()
</script>

<style lang="scss" scoped>
.message-validation-form {
  width: 70%;
  margin-bottom: 36px;
}
</style>
