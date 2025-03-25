<template>
  <div class="app-wrapper cluster with-padding-top">
    <el-card class="app-card" v-loading="isLoading">
      <el-form
        ref="delayedForm"
        label-position="right"
        :label-width="120"
        class="configuration-form schema-form"
      >
        <el-row>
          <el-col :span="21">
            <el-form-item prop="name" :label="tl('clusterName')">
              <span>{{ clusterInfo.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item prop="nodes" :label="tl('clusterNodes')">
              <el-table class="nodes-table shadow-none" :data="clusterInfo.nodes">
                <el-table-column :label="t('Dashboard.nodeName')" prop="nodeName">
                  <template #default="{ row }">
                    <router-link :to="`/dashboard/nodes/${row}`">
                      <CommonOverflowTooltip
                        :content="`${row}${row === clusterInfo.self ? ' (' + tl('currentNode') + ')' : ''}`"
                      />
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column width="120">
                  <template #header>
                    <el-button
                      size="small"
                      type="primary"
                      plain
                      :disabled="!$hasPermission('put')"
                      @click="openInviteDialog"
                    >
                      {{ t('BasicConfig.invite') }}
                    </el-button>
                  </template>
                  <template #default="{ row }">
                    <el-button
                      v-if="row !== clusterInfo.self"
                      size="small"
                      type="danger"
                      plain
                      :disabled="!$hasPermission('delete')"
                      @click="removeNode(row)"
                    >
                      {{ t('Base.remove') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
  <el-dialog :title="t('BasicConfig.invite')" width="420px" v-model="isInviteDialogShow">
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
</template>

<script setup lang="ts">
import { ClusterInfo } from '@/types/typeAlias'
import { forceLeaveNode, getClusterNodes, inviteNode } from '@/api/common'
import { toLower } from 'lodash'

const { t, tl } = useI18nTl('BasicConfig')

const clusterInfo = ref<ClusterInfo>({ name: '', nodes: [], self: '' })

const isLoading = ref(false)
const getClusterInfo = async () => {
  try {
    isLoading.value = true
    clusterInfo.value = await getClusterNodes()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getClusterInfo()

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
    width: 600px;
  }
  .current-node-label {
    font-size: 14px;
    color: var(--color-primary);
  }
}
</style>
