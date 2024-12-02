<template>
  <div class="stream-detail app-wrapper">
    <div class="block-header">
      <DetailHeader :item="{ name: streamName, routeName: 'stream' }" />
    </div>
    <el-row :gutter="26">
      <el-col :span="12">
        <el-card class="basic-info top-border">
          <el-descriptions :title="t('Dashboard.basic')" border :column="1" size="large">
            <el-descriptions-item :label="tl('streamName')">
              {{ streamInfo.overview?.stream_name }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('streamType')">
              {{ tl(`streamTypeLabel.${streamInfo.overview?.stream_type}`) }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('partitionNum')">
              {{ streamInfo.overview?.partition_number }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('mqttTopic')">
              {{ streamInfo.overview?.mqtt_topic_filter }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('retention')">
              {{ transMsNumToSimpleStr(streamInfo.overview?.retention_time) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <div>
      <div class="section-header">
        <p>{{ tl('partitions') }}</p>
      </div>
      <el-table :data="streamInfo.partitions || []">
        <el-table-column prop="partition_index" :label="tl('partition')" />
        <el-table-column prop="start_offset" :label="tl('startOffset')" />
        <el-table-column prop="end_offset" :label="tl('endOffset')" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStreamDetail } from '@/api/streaming'
import DetailHeader from '@/components/DetailHeader.vue'
import useDurationStr from '@/hooks/useDurationStr'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

interface Overview {
  mqtt_topic_filter: string
  partition_number: number
  retention_time: string
  stream_name: string
  stream_type: string
}

interface Partition {
  partition_index: number
  end_offset: number
  start_offset: number
}

interface StreamDetail {
  partitions: Partition[]
  overview: Overview
}

const route = useRoute()
const streamName = computed(() => route.params.name.toString())

const { t, tl } = useI18nTl('streaming')

const streamInfo = ref<StreamDetail>({} as StreamDetail)

const isLoading = ref(false)
const getStreamInfo = async () => {
  try {
    isLoading.value = true
    streamInfo.value = await getStreamDetail(streamName.value)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getStreamInfo()

const { transMsNumToSimpleStr } = useDurationStr()
</script>

<style lang="scss">
.stream-detail {
  padding-bottom: 32px;
  .basic-info:before {
    background: linear-gradient(135deg, #00b173 0%, #009580 100%);
  }
}
</style>
