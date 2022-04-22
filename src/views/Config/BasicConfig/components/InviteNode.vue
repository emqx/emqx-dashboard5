<template>
  <div class="invite-node">
    <el-table class="nodes-table shadow-none" :data="nodes">
      <el-table-column :label="$t('Dashboard.nodeName')" prop="nodeName">
        <template #default="{ row }">
          <router-link :to="`/dashboard/nodes/${row.nodeName}`">{{ row.nodeName }}</router-link>
        </template>
      </el-table-column>
      <el-table-column width="120">
        <template #header>
          <el-button size="small" type="primary" plain @click="inviteDialog = true">
            {{ $t('BasicConfig.invite') }}
          </el-button>
        </template>
        <template #default="{ row, $index }">
          <el-button v-if="$index !== 0" size="small" type="danger" plain @click="removeNode(row)">
            {{ $t('Base.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="$t('BasicConfig.invite')" width="420px" v-model="inviteDialog">
      <label>{{ $t('Dashboard.nodeName') }}</label>
      <el-input v-model="nodeConfig.nodeName"></el-input>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="inviteDialog = false">{{ $t('Base.cancel') }}</el-button>
          <el-button type="primary" :loading="saveLoading" @click="save()">{{
            $t('Base.confirm')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { forceLeaveNode, getClusterNodes, inviteNode } from '@/api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface ClusterNode {
  name: string
  nodes: string[]
}

interface Node {
  nodeName: string
}

export default defineComponent({
  name: 'InviteNode',
  setup() {
    const nodes = ref<Node[]>([])
    const inviteDialog = ref(false)
    const saveLoading = ref(false)
    const nodeConfig = ref<Node>({
      nodeName: '',
    })
    const { t } = useI18n()
    const loadData = async () => {
      const res: ClusterNode = await getClusterNodes()
      if (res) {
        nodes.value = res.nodes.map((node) => ({ nodeName: node }))
      }
    }
    loadData()
    const removeNode = (row: Node) => {
      ElMessageBox.confirm(t('BasicConfig.removeNodeConfirm'), {
        type: 'warning',
      })
        .then(async () => {
          await forceLeaveNode(row.nodeName)
          ElMessage.success(t('Base.removeSuccess'))
        })
        .catch(() => {
          // ignore
        })
    }
    const save = async () => {
      const { nodeName } = nodeConfig.value
      if (!nodeName) {
        ElMessage.warning(t('BasicConfig.nodeRequired'))
        return
      }
      saveLoading.value = true
      try {
        await inviteNode(nodeName)
        ElMessage.success(t('BasicConfig.inviteSuccess'))
        nodeConfig.value = {
          nodeName: '',
        }
        inviteDialog.value = false
        loadData()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    return {
      nodes,
      nodeConfig,
      inviteDialog,
      saveLoading,
      removeNode,
      save,
    }
  },
})
</script>

<style lang="scss">
.invite-node {
  width: 100%;
  .nodes-table {
    &.el-table th.el-table__cell > .cell {
      padding-top: 2px;
      padding-bottom: 2px;
    }
  }
}
</style>
