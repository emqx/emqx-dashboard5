<template>
  <div class="connectors">
    <div class="app-wrapper">
      <el-table :data="tableData" ref="TableCom" row-key="id" v-loading.lock="isLoading">
        <el-table-column :label="tl('name')" :min-width="120">
          <template #default="{ row }">
            <router-link :to="getDetailPageRoute(row.id)" class="first-column-with-icon-type">
              <img v-if="row.type" class="icon-type" :src="getBridgeIcon(row.type)" />
              <div class="name-type-block">
                <span class="name-data">
                  {{ row.name }}
                </span>
                <span class="type-data">{{ getTypeStr(row) }}</span>
              </div>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConnectors } from '@/api/connector'
import { useBridgeTypeIcon, useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useI18nTl from '@/hooks/useI18nTl'
import { Connector } from '@/types/rule'
import { ref } from 'vue'

const isLoading = ref<boolean>(false)
const tableData = ref<Array<Connector>>([])

const { tl } = useI18nTl('RuleEngine')

const getList = async () => {
  try {
    isLoading.value = true
    tableData.value = await getConnectors()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const { getBridgeIcon } = useBridgeTypeIcon()
const { getTypeStr } = useBridgeTypeOptions()

const getDetailPageRoute = (id: string, tab?: string) => ({
  name: 'bridge-detail',
  params: { id },
  query: { tab },
})

getList()
</script>

<style lang="scss"></style>
