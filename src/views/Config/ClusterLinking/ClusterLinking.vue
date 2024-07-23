<template>
  <div class="cluster-linking app-wrapper">
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
          <div class="topic-list">
            <el-tag class="input-item" type="info" v-for="item in row.topics || []" :key="item">
              <CommonOverflowTooltip :content="item" />
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.isEnabled')">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enable"
            :disabled="!$hasPermission('put')"
            @update:modelValue="toggleEnable(row)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button size="small" @click="editLink($index)">
            {{ $t('Base.setting') }}
          </el-button>
          <el-button
            size="small"
            :disabled="!$hasPermission('delete')"
            plain
            @click="handleDelete(row.name)"
          >
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ClusterLinkingDialog v-model="showDialog" :edit-data="currentLink" @submitted="loadLinks" />
</template>

<script lang="ts" setup>
import { deleteClusterLinking, getClusterLinking } from '@/api/cluster'
import useClusterLinking from '@/hooks/Config/useClusterLinking'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { CreatedClusterLinking } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import ClusterLinkingDialog from './components/ClusterLinkingDialog.vue'
import CommonOverflowTooltip from '@/components/CommonOverflowTooltip.vue'

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

const { toggleClusterLinkingEnable } = useClusterLinking()

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

const { confirmDel, operationWarning } = useOperationConfirm()

const toggleEnable = async (data: CreatedClusterLinking) => {
  try {
    const { enable } = data
    if (enable) {
      await operationWarning(t('Base.confirmDisabled'))
    }
    await toggleClusterLinkingEnable({ ...data, enable: !enable })
    data.enable = !data.enable
    ElMessage.success(t(data.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    //
  }
}

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

<style lang="scss">
@import '~@/style/management.scss';
.cluster-linking {
  .topic-list {
    .el-tag {
      max-width: 100%;
      margin-right: 4px;
      margin-bottom: 4px;
    }
    .el-tag__content {
      display: block;
      max-width: 100%;
    }
  }
}
</style>
