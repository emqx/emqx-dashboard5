<template>
  <div class="API-key app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        :disabled="!$hasPermission('post')"
        type="primary"
        @click="createLink"
        :icon="Plus"
      >
        {{ t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="name" :label="tl('clusterName')" />
      <el-table-column prop="server" :label="tl('serverAddress')" />
      <el-table-column :label="t('components.topics')">
        <template #default="{ row }">
          {{ row.topics?.join(', ') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch
            v-model="row.enable"
            :disabled="!$hasPermission('put')"
            @change="toggleEnable(row)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('Base.operation')">
        <template #default="{ $index }">
          <el-button size="small" @click="editLink($index)">
            {{ $t('Base.setting') }}
          </el-button>
          <el-button
            size="small"
            :disabled="!$hasPermission('delete')"
            plain
            @click="handleDelete($index)"
          >
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ClusterLinkDialog v-model="showDialog" :edit-data="currentLink" @submitted="loadLinks" />
</template>

<script lang="ts" setup>
import { getClusterLinks } from '@/api/cluster'
import useClusterLink from '@/hooks/Config/useClusterLink'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { ClusterLink } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import ClusterLinkDialog from './components/ClusterLinkDialog.vue'

const { t, tl } = useI18nTl('BasicConfig')

const tableData = ref<Array<ClusterLink>>([])
const lockTable = ref(true)

const loadLinks = async () => {
  lockTable.value = true
  try {
    const data = await getClusterLinks()
    tableData.value = data
  } catch (error) {
    tableData.value = []
  } finally {
    lockTable.value = false
  }
}

const { deleteLink } = useClusterLink()

const showDialog = ref(false)
const currentLinkIndex = ref<number>(-1)
const currentLink = computed(() =>
  currentLinkIndex.value > -1 ? tableData.value[currentLinkIndex.value] : undefined,
)
const createLink = () => {
  currentLinkIndex.value = -1
  showDialog.value = true
}

const editLink = (index: number) => {
  currentLinkIndex.value = index
  showDialog.value = true
}

const { confirmDel } = useOperationConfirm()

const toggleEnable = (data: ClusterLink) => {
  try {
    // TODO:TODO:TODO:TODO:TODO:TODO:
    ElMessage.success(t(data.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    data.enable = !data.enable
  }
}

const handleDelete = async (index: number) => {
  try {
    await confirmDel(() => deleteLink(index), undefined, undefined)
    loadLinks()
  } catch (error) {
    //
  }
}

loadLinks()
</script>

<style lang="scss">
@import '~@/style/management.scss';
.topics {
  .search-wrapper {
    margin-top: -12px;
  }
}
</style>
