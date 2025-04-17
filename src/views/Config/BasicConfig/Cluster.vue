<template>
  <div class="app-wrapper cluster with-padding-top">
    <el-card class="app-card" v-loading="isLoading">
      <el-form
        ref="delayedForm"
        label-position="right"
        :label-width="state.lang === 'zh' ? 106 : 159"
        class="configuration-form schema-form"
      >
        <el-row>
          <el-col :span="21">
            <el-form-item prop="name" :label="tl('clusterName')">
              <span>{{ clusterInfo.name }}</span>
            </el-form-item>
          </el-col>

          <!-- Core Nodes Section -->
          <el-col :span="21">
            <el-form-item>
              <template #label>
                <span>{{ tl('coreNodes') }}</span>
              </template>
              <el-table class="nodes-table shadow-none" :data="coreNodes">
                <el-table-column :label="t('Dashboard.nodeName')" prop="node">
                  <template #default="{ row }">
                    <router-link :to="`/dashboard/nodes/${row.node}`">
                      <CommonOverflowTooltip
                        :class="{ 'stopped-node': row.node_status === NodeStatus.Stopped }"
                        :content="`${row.node}${row.is_self ? ' (' + tl('currentNode') + ')' : ''}`"
                      />
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="t('Dashboard.status')" prop="node_status" width="100">
                  <template #default="{ row }">
                    <span
                      :class="[
                        row.node_status === NodeStatus.Running ? 'running-status' : 'stop-status',
                      ]"
                    >
                      {{
                        row.node_status === NodeStatus.Running
                          ? t('Dashboard.running')
                          : t('Dashboard.stopped')
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column :label="t('Dashboard.version')" prop="version" width="200" />
                <el-table-column width="120">
                  <template #header>
                    <!-- Invite Button -->
                    <el-tooltip
                      effect="dark"
                      :content="tl('licenseTypeInviteForbidden')"
                      :disabled="!isCommunityLicense"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        plain
                        :disabled="!$hasPermission('put') || isCommunityLicense"
                        @click="openInviteDialog"
                      >
                        {{ t('BasicConfig.invite') }}
                      </el-button>
                    </el-tooltip>
                  </template>
                  <template #default="{ row }">
                    <template v-if="!row.is_self">
                      <el-button
                        size="small"
                        type="danger"
                        plain
                        :disabled="!$hasPermission('delete')"
                        @click="removeNode(row.node)"
                      >
                        {{ t('Base.remove') }}
                      </el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>

          <!-- Replicant Nodes Section -->
          <el-col :span="21">
            <el-form-item>
              <template #label>
                <span>{{ tl('replicantNodes') }}</span>
                <InfoTooltip :content="t('BasicConfig.replicantNodeTooltip')" />
              </template>
              <el-table class="nodes-table shadow-none" :data="replicantNodes">
                <el-table-column :label="t('Dashboard.nodeName')" prop="node">
                  <template #default="{ row }">
                    <router-link :to="`/dashboard/nodes/${row.node}`">
                      <CommonOverflowTooltip
                        :class="{ 'stopped-node': row.node_status === NodeStatus.Stopped }"
                        :content="`${row.node}${row.is_self ? ' (' + tl('currentNode') + ')' : ''}`"
                      />
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="t('Dashboard.status')" prop="node_status" width="100">
                  <template #default="{ row }">
                    <span
                      :class="[
                        row.node_status === NodeStatus.Running ? 'running-status' : 'stop-status',
                      ]"
                    >
                      {{
                        row.node_status === NodeStatus.Running
                          ? t('Dashboard.running')
                          : t('Dashboard.stopped')
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column :label="t('Dashboard.version')" prop="version" width="200" />
                <el-table-column width="120" />
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- Invite Dialog -->
    <el-dialog :title="tl('invite')" width="420px" v-model="isInviteDialogShow">
      <el-form :model="inviteForm" :rules="rules" label-position="top">
        <el-form-item :label="t('Dashboard.nodeName')">
          <el-input v-model="inviteForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button :disabled="isSaving" @click="isInviteDialogShow = false">
            {{ t('Base.cancel') }}
          </el-button>
          <el-button type="primary" :loading="isSaving" @click="save()">
            {{ t('Base.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ClusterInfo } from '@/types/typeAlias'
import { NodeInfo } from '@/types/dashboard'
import { NodeStatus } from '@/types/enum'
import { forceLeaveNode, getClusterNodes, inviteNode, loadNodes } from '@/api/common'
import { toLower } from 'lodash'
import InfoTooltip from '@/components/InfoTooltip.vue'

const { t, tl } = useI18nTl('BasicConfig')

const { getters, state } = useStore()
const isCommunityLicense = computed(() => getters.isCommunityLicense)

const clusterInfo = ref<ClusterInfo>({ name: '', nodes: [], self: '' })
const isLoading = ref(false)

const coreNodes = computed(() => {
  return Array.isArray(clusterInfo.value?.nodes)
    ? clusterInfo.value.nodes.filter((node) => node && node.role === 'core')
    : []
})

const replicantNodes = computed(() => {
  return Array.isArray(clusterInfo.value?.nodes)
    ? clusterInfo.value.nodes.filter((node) => node && node.role === 'replicant')
    : []
})

const getClusterInfo = async () => {
  isLoading.value = true
  try {
    const [basicInfo, detailedNodes]: [ClusterInfo, NodeInfo[]] = await Promise.all([
      getClusterNodes(),
      loadNodes(),
    ])

    const selfNodeIdentifier = basicInfo.self || ''
    const clusterName = basicInfo.name || ''

    const mergedNodesData = (Array.isArray(detailedNodes) ? detailedNodes : []).map((nodeInfo) => {
      return {
        ...nodeInfo,
        is_self: nodeInfo.node === selfNodeIdentifier,
      }
    })

    clusterInfo.value = {
      name: clusterName,
      self: selfNodeIdentifier,
      nodes: mergedNodesData as NodeInfo[],
    }
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getClusterInfo()
})

const { operationWarning } = useOperationConfirm()
const removeNode = async (node: string) => {
  try {
    await operationWarning(tl('removeNodeConfirm'))
    await forceLeaveNode(node)
    ElMessage.success(t('Base.removeSuccess'))
    getClusterInfo()
  } catch (error) {
    //
  }
}

const inviteForm = reactive({ name: '' })
const isInviteDialogShow = ref(false)
const isSaving = ref(false)
const { createRequiredRule } = useFormRules()
const rules = { name: createRequiredRule(toLower(t('Dashboard.nodeName'))) }

const openInviteDialog = () => {
  isInviteDialogShow.value = true
  inviteForm.name = ''
}

const save = async () => {
  try {
    isSaving.value = true
    await inviteNode(inviteForm.name)
    ElMessage.success(t('BasicConfig.inviteSuccess'))
    isInviteDialogShow.value = false
    getClusterInfo()
  } catch (error) {
    //
  } finally {
    isSaving.value = false
  }
}
</script>

<style lang="scss">
.cluster {
  padding: 20px;
  .el-form-item__label {
    color: var(--color-text-secondary);
  }
  .el-form-item__content {
    font-size: 16px;
  }
  .nodes-table {
    max-width: 70%;
  }
  .current-node-label {
    font-size: 14px;
    color: var(--color-primary);
  }
  .stopped-node {
    color: var(--el-text-color-disabled);
    font-style: italic;
  }
}
</style>
