<template>
  <div class="streams app-wrapper">
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
          <!-- TODO:TODO:TODO:TODO:TODO:TODO: -->
          <!-- TODO:TODO:TODO:TODO:TODO:TODO: -->
          <!-- TODO:TODO:TODO:TODO:TODO:TODO: -->
          <!-- TODO:TODO:TODO:TODO:TODO:TODO: -->
          {{ row.state }}
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
import { Ref, onMounted, ref } from 'vue'

interface ConsumerGroup {
  state: string
  protocol_name: string
  group_id: string
  generation_id: number
  leader_member_id: string
  topic_number: number
  member_number: number
}

const { tl, t } = useI18nTl('streaming')

const groupList: Ref<Array<ConsumerGroup>> = ref([])
const isLoading = ref(false)

const getGroups = async () => {
  try {
    isLoading.value = true
    groupList.value = await getConsumerGroups()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getGroups()
})
</script>
