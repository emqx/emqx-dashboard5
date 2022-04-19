<template>
  <div class="exhook-detail app-wrapper" v-loading.lock="isLoading">
    <div class="exhook-detail-hd">
      <div>
        <h6 class="exhook-detail-title">{{ exhookName }}</h6>
        <ExhookItemStatus :exhook="exhookData" is-tag />
      </div>
      <div>
        <el-button type="danger" plain @click="handleDelete">
          {{ tl('delete', 'Base') }}
        </el-button>
        <el-button type="primary" @click="updateExhookStatus(false)" v-if="exhookData.enable">
          {{ tl('disable', 'Base') }}
        </el-button>
        <el-button type="primary" @click="updateExhookStatus(true)" v-else>
          {{ tl('enable', 'Base') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="tl('overview')" name="overview">
        <el-card class="app-card exhook-metrics-card">
          <h6 class="block-title metrics-title">{{ tl('metricsData') }}</h6>
          <div class="metrics-data-content">
            <el-row>
              <el-col :span="4">
                <span class="metric-num">
                  {{ exhookData?.hooks?.length }}
                </span>
                <p class="metric-type">{{ tl('registeredHooks') }}</p>
              </el-col>
              <el-col :span="4">
                <span class="metric-num">
                  {{ exhookData?.metrics?.succeed }}
                </span>
                <p class="metric-type">{{ tl('success') }}</p>
              </el-col>
              <el-col :span="4">
                <span class="metric-num">{{ exhookData?.metrics?.failed }}</span>
                <p class="metric-type">{{ tl('failure') }}</p>
              </el-col>
              <el-col :span="4">
                <span class="metric-num">{{ exhookData?.metrics?.rate }}</span>
                <p class="metric-type">{{ tl('currentSpeed') }}</p>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="app-card">
          <ExhookForm class="exhook-form" ref="formCom" v-model="exhookData" is-edit />
          <el-button type="primary" :loading="isSubmitting" @click="updateExhook">
            {{ $t('Base.update') }}
          </el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="tl('registeredHooks')" name="hooks">
        <el-table :data="registeredHooks">
          <el-table-column prop="name" :label="tl('name')"></el-table-column>
          <el-table-column prop="params" :label="tl('params')">
            <template #default="{ row }">
              {{ stringifyObjSafely(row.params) }}
            </template>
          </el-table-column>
          <el-table-column :label="tl('success')">
            <template #default="{ row }">
              {{ row.metrics?.succeed }}
            </template>
          </el-table-column>
          <el-table-column :label="tl('failure')">
            <template #default="{ row }">
              {{ row.metrics?.failed }}
            </template>
          </el-table-column>
          <el-table-column :label="`${tl('speed')}(${tl('second')})`">
            <template #default="{ row }">
              {{ row.metrics?.rate / 1000 }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { Exhook, RegisteredHook } from '@/types/systemModule'
import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ExhookForm from './components/ExhookForm.vue'
import { ElMessage } from 'element-plus'
import useHandleExhookItem from '@/hooks/Exhook/useHandleExhookItem'
import {
  queryExhookDetail,
  queryExhookRegisteredHooks,
  updateExhook as requestUpdateExhook,
} from '@/api/exhook'
import { stringifyObjSafely, transMSNumToString } from '@/common/tools'
import ExhookItemStatus from './components/ExhookItemStatus.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const activeName = ref('overview')
const isLoading = ref(false)
const exhookData: Ref<Exhook> = ref({} as Exhook)

const formCom = ref()
const exhookName = computed(() => route.params.exhookName.toString())
const isSubmitting = ref(false)

const registeredHooks: Ref<Array<RegisteredHook>> = ref([])

const { deleteExhook, updateExhookEnable } = useHandleExhookItem()

const getExhookDetail = async () => {
  try {
    isLoading.value = true
    const data = await queryExhookDetail(exhookName.value)
    const { request_timeout, auto_reconnect } = data
    exhookData.value = {
      ...data,
      request_timeout: transMSNumToString(request_timeout),
      auto_reconnect: auto_reconnect
        ? transMSNumToString(auto_reconnect)
        : (auto_reconnect as false),
    }
    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
}

const updateExhook = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    const { auto_reconnect, enable, failed_action, name, pool_size, request_timeout, ssl, url } =
      exhookData.value
    await requestUpdateExhook({
      auto_reconnect,
      enable,
      failed_action,
      name,
      pool_size,
      request_timeout,
      ssl,
      url,
    })
    ElMessage.success(tl('updateSuccess', 'Base'))
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const updateExhookStatus = async (enable: boolean) => {
  try {
    await updateExhookEnable(exhookData.value, enable)
    getExhookDetail()
    queryRegisteredHooks()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async () => {
  try {
    await deleteExhook(exhookName.value)
    router.push({ name: 'exhook' })
  } catch (error) {
    console.error(error)
  }
}

const queryRegisteredHooks = async () => {
  try {
    registeredHooks.value = await queryExhookRegisteredHooks(exhookName.value)
  } catch (error) {
    console.error(error)
  }
}

getExhookDetail()
queryRegisteredHooks()
</script>

<style lang="scss" scoped>
.exhook-detail-hd {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  .exhook-detail-title {
    margin-top: 0;
    margin-bottom: 16px;
    line-height: 25px;
    font-size: 24px;
    font-weight: 600;
  }
}
:deep(.el-tabs.el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top) {
  padding-left: 0;
  padding-right: 0;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    visibility: hidden;
  }
  &::before {
    width: 12px;
  }
  &::after {
    width: 32px;
  }
}
.exhook-metrics-card {
  margin-bottom: 28px;
}
.metrics-title {
  margin-bottom: 12px;
}
.metric-num {
  font-size: 24px;
}
.exhook-form {
  width: 70%;
}
</style>
