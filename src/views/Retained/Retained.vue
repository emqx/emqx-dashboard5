<template>
  <div class="app-wrapper retained">
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
      <el-table-column :label="$t('Base.topic')" prop="topic" min-width="100" show-overflow-tooltip>
        <template #default="{ row }">
          <PreWithEllipsis>{{ row.topic }}</PreWithEllipsis>
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
    <el-dialog v-model="payloadDialog" class="payload-dialog" :title="tl('view')">
      <el-row v-loading="payloadLoading">
        <el-col :span="24">
          <el-row>
            <el-col :span="2">
              <label>{{ $t('Base.topic') }}</label>
            </el-col>
            <el-col :span="21">
              <p class="topic-text">{{ currentTopic }}</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <label class="label-top">Payload</label>
          <div class="monaco-container">
            <Monaco
              disabled
              id="payload"
              v-model="payloadForShow"
              :lang="plaintextShow ? 'plaintext' : 'json'"
              :jsonWithoutValidate="payloadShowBy !== PayloadShowByType.JSON"
            />
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <div class="payload-dialog-ft" v-if="!(payloadDetail === null)">
          <el-select v-model="payloadShowBy">
            <el-option
              v-for="item in payloadShowByOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button @click="copyText(payloadForShow)">
            {{ $t('Base.copy') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Retained',
})
</script>

<script setup lang="ts">
import { delRetainerTopic, getRetainer, getRetainerList, getRetainerTopic } from '@/api/extension'
import { dateFormat } from '@/common/tools'
import Monaco from '@/components/Monaco.vue'
import PreWithEllipsis from '@/components/PreWithEllipsis.vue'
import CommonPagination from '@/components/commonPagination.vue'
import useCopy from '@/hooks/useCopy'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import useShowTextByDifferent from '@/hooks/useShowTextByDifferent'
import { PayloadShowByType } from '@/types/enum'
import { RetainerMessage } from '@/types/extension'
import { RefreshRight, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox as MB } from 'element-plus'

const { tl, t } = useI18nTl('Extension')
const { copyText } = useCopy()
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const { payloadForShow, payloadShowBy, payloadShowByOptions, setRawText } = useShowTextByDifferent()
const tbLoading = ref(true)
const tbData = ref<RetainerMessage[]>([])
const payloadDialog = ref(false)
const currentTopic = ref('')
const payloadDetail = ref('')
const payloadLoading = ref(false)
const isEnabledRetainer = ref(true)

const plaintextShow = computed(() => {
  return (
    payloadShowBy.value === PayloadShowByType.Hex ||
    payloadShowBy.value === PayloadShowByType.Base64
  )
})

const loadTbData = async (reload?: boolean) => {
  tbLoading.value = true
  try {
    const { data, meta } = await getRetainerList(pageParams.value)
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
      setRawText(payloadDetail.value)
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

loadTbData()
loadConfigData()
</script>

<style lang="scss">
.retained {
  .el-col-24 {
    margin-bottom: 20px;
    line-height: 20px;
  }
  .topic-text {
    margin: 0;
    word-wrap: break-word;
    white-space: pre-wrap;
    color: var(--el-text-color-regular);
  }
  label {
    color: var(--color-text-secondary);
  }
  .label-top {
    display: block;
    margin-bottom: 16px;
  }
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
}
</style>
