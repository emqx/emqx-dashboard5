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
          <!-- FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: -->
          <!-- FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: -->
          <!-- FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: -->
          <!-- FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: -->
          {{ row.stream_type ? $t(`streaming.streamTypeLabel.${row.stream_type}`) : '' }}
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
            <i class="iconfont icon-delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <StreamDialog v-model="isDialogShow" />
</template>

<script lang="ts" setup>
import { deleteStream, getStreams as requestStreams } from '@/api/streaming'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useDurationStr from '@/hooks/useDurationStr'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import StreamDialog from './components/StreamDialog.vue'

enum StreamType {
  Default = 'default',
  Free = 'free',
}

interface Stream {
  stream_name: string
  stream_type: StreamType
  mqtt_topic_filter: string
  partition_number: number
  retention_time: string
}

const { tl, t } = useI18nTl('streaming')

const streamList = ref<Array<Stream>>([])
const isLoading = ref(false)

const getStreams = async () => {
  try {
    isLoading.value = true
    streamList.value = await requestStreams()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const { transMsNumToSimpleStr } = useDurationStr()

const isDialogShow = ref(false)
const addStream = () => {
  isDialogShow.value = true
}

const handleDel = async (name: string) => {
  try {
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO: 删除确认
    await deleteStream(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getStreams()
  } catch (error) {
    //
  }
}

onMounted(() => {
  getStreams()
})
</script>
