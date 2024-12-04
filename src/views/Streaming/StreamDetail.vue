<template>
  <div class="stream-detail app-wrapper">
    <div class="block-header">
      <DetailHeader :item="{ name: streamName, routeName: 'stream' }" />
    </div>
    <div>
      <div class="section-header is-first">
        <p>{{ t('Dashboard.basic') }}</p>
      </div>
      <el-card class="basic-info no-border" v-loading="isLoading">
        <el-descriptions :column="2" size="large">
          <el-descriptions-item :label="tl('streamName')" width="50%">
            {{ streamInfo.overview?.stream_name }}
          </el-descriptions-item>
          <el-descriptions-item :label="tl('streamType')" width="50%">
            {{ tl(`streamTypeLabel.${streamInfo.overview?.stream_type}`) }}
          </el-descriptions-item>
          <el-descriptions-item :label="tl('partitionNum')">
            {{ streamInfo.overview?.partition_number }}
          </el-descriptions-item>
          <el-descriptions-item :label="tl('mqttTopic')">
            {{ streamInfo.overview?.mqtt_topic_filter }}
          </el-descriptions-item>
          <el-descriptions-item :label="tl('retention')">
            {{
              streamInfo.overview?.retention_time &&
              transMsNumToSimpleStr(streamInfo.overview?.retention_time)
            }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <div>
      <div class="section-header">
        <p>{{ tl('partitions') }}</p>
      </div>
      <el-table :data="streamInfo.partitions || []" v-loading="isLoading">
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
import { StreamDetails } from '@/types/typeAlias'
import { useLocale } from '@emqx/shared-ui-utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const streamName = computed(() => route.params.name.toString())

const { t, locale } = useI18n()
const { t: sharedT } = useLocale(locale.value)
const tl = (key: string) => sharedT(`streaming.${key}`)

const streamInfo = ref<StreamDetails>({})

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
  .section-header.is-first {
    margin-top: 8px;
  }
}
</style>
