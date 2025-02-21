<template>
  <div class="exhook-detail" v-loading.lock="isLoading">
    <div class="detail-top">
      <detail-header :item="{ name: exhookName, path: '/exhook' }">
        <template #content>
          <div class="vertical-align-center">
            <p class="block-title">{{ exhookName }}</p>
            <ExhookItemStatus :exhook="exhookData" is-tag />
          </div>
        </template>
        <template #extra>
          <el-tooltip
            :content="exhookData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              v-model="exhookData.enable"
              @change="(val) => updateExhookStatus(val as boolean)"
            />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button class="icon-button" type="danger" :icon="Delete" @click="handleDelete" plain>
            </el-button>
          </el-tooltip>
        </template>
      </detail-header>
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" name="overview" lazy>
          <ExhookItemOverview :exhook="exhookData" :exhook-name="exhookName" />
        </el-tab-pane>
        <el-tab-pane :label="tl('registeredHooks')" name="hooks">
          <el-table :data="registeredHooks">
            <el-table-column prop="name" :label="tl('name')"></el-table-column>
            <el-table-column prop="params" :label="tl('params')">
              <template #default="{ row }">
                {{ stringifyObjSafely(row.params) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('Base.success')">
              <template #default="{ row }">
                {{ row.metrics?.succeed }}
              </template>
            </el-table-column>
            <el-table-column :label="t('Base.failed')">
              <template #default="{ row }">
                {{ row.metrics?.failed }}
              </template>
            </el-table-column>
            <el-table-column :label="`${tl('rate')}(${tl('second')})`">
              <template #default="{ row }">
                {{ row.metrics?.rate / 1000 }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" name="settings">
          <el-card class="app-card">
            <ExhookForm class="exhook-form" ref="formCom" v-model="exhookData" is-edit />
            <el-button type="primary" :loading="isSubmitting" @click="updateExhook">
              {{ $t('Base.update') }}
            </el-button>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { Exhook, RegisteredHook } from '@/types/systemModule'
import ExhookForm from './components/ExhookForm.vue'

import useHandleExhookItem from '@/hooks/Exhook/useHandleExhookItem'
import {
  queryExhookDetail,
  queryExhookRegisteredHooks,
  updateExhook as requestUpdateExhook,
} from '@/api/exhook'
import { stringifyObjSafely } from '@/common/tools'
import ExhookItemStatus from './components/ExhookItemStatus.vue'
import useSSL from '@/hooks/useSSL'
import DetailHeader from '@/components/DetailHeader.vue'
import ExhookItemOverview from './components/ExhookItemOverview.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const activeTab = ref('overview')
const isLoading = ref(false)
const exhookData: Ref<Exhook> = ref({} as Exhook)

const formCom = ref()
const exhookName = computed(() => route.params.exhookName.toString())
const isSubmitting = ref(false)

const queryTab = computed(() => {
  return route.query.tab as string
})
if (queryTab.value) {
  activeTab.value = queryTab.value
}

const registeredHooks: Ref<Array<RegisteredHook>> = ref([])

const { deleteExhook, updateExhookEnable, handleExhookBeforeSubmit } = useHandleExhookItem()
const { handleSSLDataBeforeSubmit } = useSSL()

const getExhookDetail = async () => {
  try {
    isLoading.value = true
    const data = await queryExhookDetail(exhookName.value)
    exhookData.value = data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const updateExhook = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    const { auto_reconnect, enable, failed_action, name, pool_size, request_timeout, ssl, url } =
      exhookData.value
    await requestUpdateExhook(
      handleExhookBeforeSubmit({
        auto_reconnect,
        enable,
        failed_action,
        name,
        pool_size,
        request_timeout,
        ssl: handleSSLDataBeforeSubmit(ssl),
        url,
      }),
    )
    ElMessage.success(tl('updateSuccess', 'Base'))
    router.push({ name: 'exhook' })
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
  width: 75%;
}
</style>
