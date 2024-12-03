<template>
  <div class="streams app-wrapper with-padding-top">
    <el-table :data="groupList" v-loading="isLoading">
      <el-table-column :label="tl('groupID')">
        <template #default="{ row }">
          <router-link :to="{ name: 'consumer-group-detail', params: { id: row.group_id } }">
            {{ row.group_id }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.status')">
        <template #default="{ row }">
          <ConsumerGroupStatus :group="row" />
        </template>
      </el-table-column>
      <el-table-column prop="topic_number" :label="tl('streamNum')" />
      <el-table-column prop="member_number" :label="tl('consumerNum')" />
      <el-table-column prop="protocol_name" :label="tl('protocol')" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { getConsumerGroups } from '@/api/streaming'
import useI18nTl from '@/hooks/useI18nTl'
import { StreamingConsumerGroup } from '@/types/typeAlias'
import { ref } from 'vue'
import ConsumerGroupStatus from './components/ConsumerGroupStatus.vue'

const { tl, t } = useI18nTl('streaming')

const groupList = ref<Array<StreamingConsumerGroup>>([])
const isLoading = ref(false)

const getGroups = async () => {
  try {
    isLoading.value = true
    const { groups } = await getConsumerGroups()
    groupList.value = groups
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getGroups()
</script>
