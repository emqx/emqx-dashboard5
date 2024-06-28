<template>
  <div class="retained">
    <el-form class="search-wrapper" @keyup.enter="handleSearch">
      <el-row :gutter="28">
        <el-col :span="8">
          <el-input
            v-model="searchValue"
            :placeholder="$t('Topics.topic')"
            clearable
            @clear="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-button type="primary" plain :icon="Search" @click="handleSearch">
            {{ $t('Base.search') }}
          </el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">
            {{ $t('Base.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="app-wrapper">
      <div class="section-header">
        <div></div>
        <template v-if="isEnabledRetainer">
          <el-button
            :icon="Setting"
            :disabled="!$hasPermission('put')"
            @click="$router.push({ name: 'mqtt-retainer' })"
          >
            {{ $t('Base.setting') }}
          </el-button>
          <el-button
            type="primary"
            :disabled="!$hasPermission('get')"
            :icon="RefreshRight"
            @click="refresh"
          >
            {{ $t('Base.refresh') }}
          </el-button>
          <el-button
            type="danger"
            plain
            :icon="Remove"
            :disabled="tbData.length === 0 || !$hasPermission('delete')"
            @click="handleDeleteAll"
          >
            {{ $t('General.clearAll') }}
          </el-button>
        </template>
        <el-tooltip v-else effect="dark" placement="top" :content="tl('retainerDisabled')">
          <el-button
            type="primary"
            :disabled="!$hasPermission('put')"
            @click="$router.push({ name: 'mqtt-retainer' })"
          >
            {{ $t('Base.enable') }}
          </el-button>
        </el-tooltip>
      </div>
      <el-table :data="tbData" v-loading="tbLoading" row-key="topic">
        <el-table-column :label="$t('Base.topic')" prop="topic" min-width="100">
          <template #default="{ row }">
            <CommonOverflowTooltip :content="row.topic" />
          </template>
        </el-table-column>
        <el-table-column :label="'QoS'" prop="qos" min-width="30" />
        <el-table-column :label="$t('Base.clientid')" prop="from_clientid" />
        <el-table-column
          :label="tl('createDate')"
          prop="publish_at"
          :sort-by="(row: any) => new Date(row.publish_at).getTime()"
        >
          <template #default="{ row }">
            {{ row.publish_at && dateFormat(row.publish_at) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <el-button size="small" @click="checkPayload(row)">
              {{ tl('openPayload') }}
            </el-button>
            <el-button
              size="small"
              :disabled="!$hasPermission('delete')"
              plain
              @click="deleteRetainerTopic(row)"
            >
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="emq-table-footer">
        <CommonPagination @loadPage="loadTbData" v-model:metaData="pageMeta" />
      </div>
      <PayloadDialog
        v-model="payloadDialog"
        :raw-payload="payloadDetail"
        :is-loading="payloadLoading"
        :topic="currentTopic"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Retained',
})
</script>

<script setup lang="ts">
import {
  delAllRetainerMessages,
  delRetainerTopic,
  getRetainer,
  getRetainerList,
  getRetainerTopic,
} from '@/api/extension'
import { dateFormat } from '@/common/tools'
import PayloadDialog from '@/components/PayloadDialog.vue'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import CommonPagination from '@/components/commonPagination.vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { RetainerMessage } from '@/types/extension'
import { RefreshLeft, RefreshRight, Remove, Search, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElMessageBox as MB } from 'element-plus'

const { tl, t } = useI18nTl('Extension')
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const tbLoading = ref(true)
const tbData = ref<RetainerMessage[]>([])
const payloadDialog = ref(false)
const currentTopic = ref('')
const payloadDetail = ref('')
const payloadLoading = ref(false)
const isEnabledRetainer = ref(true)
const searchValue = ref('')
const params = ref<Record<string, any>>({})

const loadTbData = async (_params = {}) => {
  tbLoading.value = true
  const sendParams = { ...params.value, ...pageParams.value, ..._params }
  try {
    const { data = [], meta } = await getRetainerList(sendParams)
    tbData.value = data
    setPageMeta(meta)
  } catch (error) {
    tbData.value = []
    initPageMeta()
  } finally {
    tbLoading.value = false
  }
}

const refresh = () => {
  initPageMeta()
  loadTbData()
}

const checkPayload = async (row: any) => {
  payloadDialog.value = true
  payloadDetail.value = ''
  payloadLoading.value = true
  const { topic } = row
  if (!topic) return
  try {
    currentTopic.value = topic
    const res = await getRetainerTopic(topic)
    if (res) {
      payloadDetail.value = res.payload
    }
  } catch (error) {
    //
  } finally {
    payloadLoading.value = false
  }
}

const deleteRetainerTopic = async function (row: any) {
  MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
    .then(async () => {
      const { topic } = row
      if (!topic) return
      try {
        const res = await delRetainerTopic(topic)
        if (res) {
          ElMessage.success(t('Base.deleteSuccess'))
          initPageMeta()
          loadTbData()
        }
      } catch (error) {
        //
      }
    })
    .catch(() => {
      //
    })
}

const loadConfigData = async () => {
  try {
    let res = await getRetainer()
    if (res) {
      isEnabledRetainer.value = res.enable
    }
  } catch (error) {
    //
  }
}

const handleDeleteAll = () => {
  ElMessageBox.confirm(t('General.clearAllRetainedConfirm'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      try {
        await delAllRetainerMessages()
        ElMessage.success(t('Base.deleteSuccess'))
        loadTbData()
        done()
      } catch (error) {
        instance.confirmButtonLoading = false
        instance.confirmButtonText = t('base.confirm')
        done()
      }
    },
  })
}

const handleSearch = () => {
  const topic = searchValue.value.trim()
  params.value.topic = topic
  loadTbData({ page: 1 })
}

const handleReset = () => {
  searchValue.value = ''
  params.value = {}
  loadTbData({ page: 1 })
}

loadTbData()
loadConfigData()
</script>
