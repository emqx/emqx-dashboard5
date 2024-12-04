<template>
  <div class="streams app-wrapper">
    <div class="section-header">
      <div />
      <el-button :disabled="!$hasPermission('post')" type="primary" @click="addStream" :icon="Plus">
        {{ t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="streamList" v-loading="isLoading">
      <el-table-column min-width="160px">
        <template #header>
          {{ tl('streamName') }}
          <InfoTooltip :content="tl('streamNameTip')" />
        </template>
        <template #default="{ row }">
          <router-link :to="{ name: 'stream-detail', params: { name: row.stream_name } }">
            {{ row.stream_name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column min-width="140px">
        <template #header>
          {{ tl('streamType') }}
          <InfoTooltip :content="tl('streamTypeTip')" />
        </template>
        <template #default="{ row }">
          {{ row.stream_type ? tl(`streamTypeLabel.${row.stream_type}`) : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="mqtt_topic_filter" min-width="180px">
        <template #header>
          {{ tl('mqttTopic') }}
          <InfoTooltip :content="tl('mqttTopicTip')" />
        </template>
      </el-table-column>
      <el-table-column prop="partition_number" :label="tl('partitionNum')" min-width="140px" />
      <el-table-column prop="retention_time" :label="tl('retention')" min-width="140px">
        <template #default="{ row }">{{ transMsNumToSimpleStr(row.retention_time) }}</template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')" min-width="90px">
        <template #default="{ row }">
          <el-button
            plain
            size="small"
            :disabled="!$hasPermission('delete')"
            @click="handleDel(row)"
          >
            {{ t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <StreamDialog v-model="isDialogShow" @submitted="getStreams" />
</template>

<script lang="ts" setup>
import { deleteStream, getStreams as requestStreams } from '@/api/streaming'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useDurationStr from '@/hooks/useDurationStr'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { Stream } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { useLocale } from '@emqx/shared-ui-utils'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import StreamDialog from './components/StreamDialog.vue'

const { locale, t } = useI18n()
const { t: sharedT } = useLocale(locale.value)
const tl = (key: string) => sharedT(`streaming.${key}`)

const streamList = ref<Array<Stream>>([])
const isLoading = ref(false)

const getStreams = async () => {
  try {
    isLoading.value = true
    const { streams } = await requestStreams()
    streamList.value = streams || []
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getStreams()

const { transMsNumToSimpleStr } = useDurationStr()

const isDialogShow = ref(false)
const addStream = () => {
  isDialogShow.value = true
}

const { confirmDel } = useOperationConfirm()
const handleDel = async ({ stream_name: name }: Stream) => {
  try {
    if (!name) {
      return
    }
    await confirmDel()
    await deleteStream(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getStreams()
  } catch (error) {
    //
  }
}
</script>
