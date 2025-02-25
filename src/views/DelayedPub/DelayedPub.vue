<template>
  <div class="app-wrapper delayed-pub" v-loading="tbLoading">
    <div class="section-header">
      <div></div>
      <el-button :icon="Setting" :disabled="!$hasPermission('put')" @click="goSetting">
        {{ $t('Base.setting') }}
      </el-button>
    </div>
    <el-table :data="delayedTbData" class="delayed-table">
      <el-table-column :label="$t('Base.topic')" prop="topic" :min-width="92" />
      <el-table-column :label="'QoS'" prop="qos" :min-width="84" />
      <el-table-column :label="'Payload'" :min-width="84">
        <template #default="{ row }">
          <TableButton @click="checkPayload(row)">{{ tl('openPayload') }}</TableButton>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.clientid')" prop="from_clientid" :min-width="146" />
      <el-table-column :label="tl('delayedTime')" prop="delayed_interval" :min-width="92" />
      <el-table-column :label="tl('remainTime')" prop="delayed_remaining" :min-width="124" />
      <el-table-column :label="tl('publishTime')" :min-width="132">
        <template #default="{ row }">
          {{ row.publish_at && dateFormat(row.publish_at) }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('Base.operation')" :min-width="92">
        <template #default="{ row }">
          <TableButton :disabled="!$hasPermission('delete')" @click="deleteDelayedInfo(row)">
            {{ $t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination @loadPage="loadDelayedList" v-model:metaData="pageMeta" />
    </div>
  </div>
  <PayloadDialog
    v-model="payloadDialog"
    :raw-payload="payloadDetail"
    :is-loading="payloadLoading"
    :topic="currentTopic"
  />
</template>

<script lang="ts" setup>
import { delDelayedInfo, getDelayedInfo, getDelayedList } from '@/api/extension'

import PayloadDialog from '@/components/PayloadDialog.vue'
import CommonPagination from '@/components/commonPagination.vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { DelayedMessage } from '@/types/extension'
import { Setting } from '@element-plus/icons-vue'
import { ElMessageBox as MB } from 'element-plus'
import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { tl, t } = useI18nTl('Extension')
const router = useRouter()
const copyShowTimeout: Ref<undefined | number> = ref(undefined)

const delayedTbData: Ref<Array<DelayedMessage>> = ref([])
const tbLoading = ref(false)
const payloadDialog = ref(false)
const payloadLoading = ref(false)
const payloadDetail = ref('')
const currentTopic = ref('')
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const goSetting = () => {
  router.push({ name: 'delayed-pub-configuration' })
}

const loadDelayedList = async (params = {}) => {
  tbLoading.value = true
  const sendParams = { ...pageParams.value, ...params }
  try {
    const { data, meta } = await getDelayedList(sendParams)
    delayedTbData.value = data
    setPageMeta(meta)
  } catch (error) {
    delayedTbData.value = []
    initPageMeta()
  } finally {
    tbLoading.value = false
  }
}

const deleteDelayedInfo = async function (row: DelayedMessage) {
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
  const { msgid, node } = row
  if (!msgid || !node) {
    return
  }
  try {
    await delDelayedInfo(node, msgid)
    loadDelayedList()
  } catch (error) {
    console.error(error)
  }
}

const checkPayload = async function (row: DelayedMessage) {
  payloadDialog.value = true
  payloadLoading.value = true
  payloadDetail.value = ''
  const { msgid, node, topic } = row
  try {
    const res = await getDelayedInfo(node, msgid)
    if (res) {
      currentTopic.value = topic
      payloadDetail.value = res?.payload
    }
  } catch (error) {
    console.error(error)
  } finally {
    payloadLoading.value = false
  }
}

onMounted(loadDelayedList)

onUnmounted(() => {
  copyShowTimeout.value && clearTimeout(copyShowTimeout.value)
})
</script>

<style lang="scss" scoped>
.delayed-table {
  :deep(.el-table__cell > .cell) {
    padding: 0 12px;
  }
}
</style>
