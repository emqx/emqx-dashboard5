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
          <el-button size="small" @click="checkPayload(row)">{{ tl('openPayload') }}</el-button>
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
          <el-button
            size="small"
            :disabled="!$hasPermission('delete')"
            plain
            @click="deleteDelayedInfo(row)"
          >
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination @loadPage="loadDelayedList" v-model:metaData="pageMeta" />
    </div>
  </div>
  <el-dialog class="payload-dialog" v-model="payloadDialog" :title="'Payload'">
    <el-row v-loading="payloadLoading">
      <el-input
        type="textarea"
        :rows="10"
        resize="none"
        placeholder="Payload"
        v-model="payloadForShow"
        readonly
      />
    </el-row>
    <template #footer>
      <div class="payload-dialog-ft" v-if="!(payloadDetail === null)">
        <el-select v-model="payloadShowBy">
          <el-option v-for="item in payloadShowByOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <div>
          <span v-if="isCopyShow" class="payload-copied">{{ $t('Base.copied') }}</span>

          <el-button @click="copyText(payloadForShow)">
            {{ $t('Base.copy') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { delDelayedInfo, getDelayedInfo, getDelayedList } from '@/api/extension'
import { dateFormat } from '@/common/tools'
import CommonPagination from '@/components/commonPagination.vue'
import useCopy from '@/hooks/useCopy'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import useShowTextByDifferent from '@/hooks/useShowTextByDifferent'
import { DelayedMessage } from '@/types/extension'
import { Setting } from '@element-plus/icons-vue'
import { ElMessageBox as MB } from 'element-plus'
import { onMounted, onUnmounted, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

const { tl, t } = useI18nTl('Extension')
const router = useRouter()
let copyShowTimeout: Ref<undefined | number> = ref(undefined)
const copySuccess = () => {
  isCopyShow.value = true
  window.clearTimeout(copyShowTimeout.value)
  copyShowTimeout.value = window.setTimeout(() => {
    isCopyShow.value = false
  }, 2000)
}
const { copyText } = useCopy(copySuccess)

let delayedTbData: Ref<Array<DelayedMessage>> = ref([])
let tbLoading = ref(false)
let payloadDialog = ref(false)
let payloadLoading = ref(false)
let payloadDetail = ref('')
let isCopyShow = ref(false)
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const { payloadForShow, payloadShowBy, payloadShowByOptions, setRawText } = useShowTextByDifferent()

const goSetting = () => {
  router.push({ name: 'delayed-pub-configuration' })
}

const loadDelayedList = async (params = {}) => {
  tbLoading.value = true
  let sendParams = { ...pageParams.value, ...params }
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
  const { msgid, node } = row
  try {
    let res = await getDelayedInfo(node, msgid)
    if (res) {
      payloadDetail.value = res?.payload
      setRawText(payloadDetail.value)
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
.payload-copied {
  padding-right: 10px;
}
.payload-dialog {
  .payload-dialog-ft {
    display: flex;
    justify-content: space-between;
    .el-select {
      width: 200px;
    }
  }
}
.delayed-table {
  :deep(.el-table__cell > .cell) {
    padding: 0 12px;
  }
}
</style>
