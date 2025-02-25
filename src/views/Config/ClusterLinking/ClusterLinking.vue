<template>
  <div class="cluster-linking app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="createLink" />
    </div>
    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="name" :label="tl('clusterName')">
        <template #default="{ row }">
          <router-link :to="getDetailRoute(row.name)" class="table-data-without-break">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="server" :label="t('Base.server')" />
      <el-table-column :label="t('components.topics')">
        <template #default="{ row }">
          <div class="topic-list">
            <span class="topic-item" v-for="item in row.topics || []" :key="item">
              <CommonOverflowTooltip :content="item" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enable"
            :disabled="!$hasPermission('put')"
            @update:modelValue="handleTogglerEnable(row)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <TableButton @click="editLink(row.name)">
            {{ $t('Base.setting') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row.name)">
            {{ $t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { deleteClusterLinking, getClusterLinking } from '@/api/cluster'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'
import useClusterLinking from '@/hooks/Config/useClusterLinking'

import { DetailTab } from '@/types/enum'
import { CreatedClusterLinking } from '@/types/typeAlias'

const { t, tl } = useI18nTl('BasicConfig')

const tableData = ref<Array<CreatedClusterLinking>>([])
const lockTable = ref(true)

const loadLinks = async () => {
  lockTable.value = true
  try {
    const data = await getClusterLinking()
    tableData.value = data
  } catch (error) {
    tableData.value = []
  } finally {
    lockTable.value = false
  }
}

const { handleTogglerEnable } = useClusterLinking()

const router = useRouter()
const createLink = () => {
  router.push({ name: 'cluster-linking-create' })
}

const getDetailRoute = (name: string, query?: Record<string, any>) => {
  return {
    name: 'cluster-linking-detail',
    params: { linkingName: name },
    query,
  }
}

const editLink = (name: string) => {
  router.push(getDetailRoute(name, { tab: DetailTab.Setting }))
}

const { confirmDel } = useOperationConfirm()

const handleDelete = async (name: string) => {
  try {
    await confirmDel(() => deleteClusterLinking(name))
    loadLinks()
  } catch (error) {
    //
  }
}

loadLinks()
</script>
