<template>
  <div class="exhook-detail app-wrapper">
    <div class="exhook-detail-hd">
      <h6>{{ exhookName }}</h6>
      <div>
        <el-button type="danger" size="small" @click="handleDelete">
          {{ tl('delete', 'Base') }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="updateExhookStatus(false)"
          v-if="exhookData.enable"
        >
          {{ tl('disable', 'Base') }}
        </el-button>
        <el-button type="primary" size="small" @click="updateExhookStatus(true)" v-else>
          {{ tl('enable', 'Base') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="tl('overview')" name="overview">
        <el-card shadow="never" class="app-card exhook-metrics-card">
          <h6>{{ tl('metricsData') }}</h6>
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
        <el-card shadow="never" class="app-card">
          <ExhookForm class="exhook-form" ref="formCom" v-model="exhookData" is-edit />
          <el-button size="small" type="primary" :loading="isSubmitting" @click="updateExhook">
            {{ $t('Base.update') }}
          </el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="tl('registeredHooks')" name="hooks">
        <el-table :data="registeredHooks">
          <el-table-column prop="name" :label="tl('name')"></el-table-column>
          <el-table-column :label="tl('desc')"></el-table-column>
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

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const activeName = ref('overview')
const exhookData: Ref<Exhook> = ref({} as Exhook)

const formCom = ref()
const exhookName = computed(() => route.params.exhookName.toString())
const isSubmitting = ref(false)

const registeredHooks: Ref<Array<RegisteredHook>> = ref([])

const { deleteExhook, updateExhookEnable } = useHandleExhookItem()

const getExhookDetail = async () => {
  try {
    exhookData.value = await queryExhookDetail(exhookName.value)
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
  h6 {
    margin-top: 0;
    margin-bottom: 0;
  }
}
.exhook-metrics-card {
  margin-bottom: 28px;
}
.metric-num {
  font-size: 24px;
}
.exhook-form {
  width: 70%;
}
</style>
