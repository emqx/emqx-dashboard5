<template>
  <div class="consumer-group-detail app-wrapper">
    <div class="block-header">
      <DetailHeader :item="{ name: groupId, routeName: 'consumer-group' }" />
    </div>
    <div>
      <div class="section-header is-first">
        <p>{{ t('Dashboard.basic') }}</p>
      </div>
      <el-card class="basic-info no-border" v-loading="isLoading">
        <el-descriptions :column="2" size="large">
          <el-descriptions-item :label="tl('groupID')" width="50%">
            {{ groupInfo.overview?.group_id }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('Base.status')" width="50%">
            <ConsumerGroupStatus :group="groupInfo.overview" />
          </el-descriptions-item>
          <el-descriptions-item :label="tl('protocol')">
            {{ groupInfo.overview?.protocol_name }}
          </el-descriptions-item>
          <el-descriptions-item :label="tl('consumerNum')">
            {{ groupInfo.overview?.member_number }}
          </el-descriptions-item>
          <el-descriptions-item :label="tl('streamNum')">
            {{ groupInfo.overview?.topic_number }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <el-tabs v-model="activeTab" class="mt-16" v-loading="isLoading">
      <el-tab-pane :name="Tab.Consumers" :label="tl('consumers')">
        <el-table :data="groupInfo.members || []">
          <el-table-column prop="client_id" :label="t('Base.clientid')" />
          <el-table-column prop="client_host" :label="t('Base.ip')" />
          <el-table-column prop="member_id" :label="tl('consumerID')" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane :name="Tab.Streams" :label="tl('streams')">
        <el-table :data="groupInfo.streams || []">
          <el-table-column prop="stream" :label="tl('streamName')" />
          <el-table-column prop="partition" :label="tl('partition')" />
          <el-table-column prop="consumer_id" :label="tl('consumerID')" />
          <el-table-column prop="lag" label="Lag" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { getConsumerGroupDetail } from '@/api/streaming'
import DetailHeader from '@/components/DetailHeader.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { useLocale } from '@emqx/shared-ui-utils'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ConsumerGroupStatus from './components/ConsumerGroupStatus.vue'

interface Group {
  members: Member[]
  overview: Overview
  streams: Stream[]
}

interface Stream {
  consumer_id: string
  lag: number
  partition: number
  stream: string
}

interface Overview {
  generation_id: number
  group_id: string
  leader_member_id: string
  member_number: number
  protocol_name: string
  state: string
  topic_number: number
}

interface Member {
  client_host: string
  client_id: string
  member_id: string
  rebalance_timeout_ms: number
  session_timeout_ms: number
}

enum Tab {
  Consumers,
  Streams,
}
const activeTab = ref(Tab.Consumers)

const route = useRoute()
const groupId = computed(() => route.params.id.toString())

const { t } = useI18nTl('streaming')
const { t: sharedT } = useLocale(useStore().state.lang)
const tl = (key: string) => sharedT(`streaming.${key}`)

const groupInfo = ref<Group>({} as Group)

const isLoading = ref(false)
const getGroupInfo = async () => {
  try {
    isLoading.value = true
    groupInfo.value = await getConsumerGroupDetail(groupId.value)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getGroupInfo()
</script>

<style lang="scss">
.consumer-group-detail {
  padding-bottom: 32px;
  .section-header.is-first {
    margin-top: 8px;
  }
  .basic-info {
    margin-bottom: 32px;
  }
  .el-tabs__header {
    margin-bottom: 24px;
  }
}
</style>
