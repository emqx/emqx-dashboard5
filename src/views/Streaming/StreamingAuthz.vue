<template>
  <div class="streaming-authn app-wrapper">
    <div class="section-header">
      <div />
      <el-button :disabled="!$hasPermission('post')" type="primary" @click="addAuthn" :icon="Plus">
        {{ t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="authzList" v-loading="isLoading">
      <el-table-column prop="principal_name" :label="t('Base.username')" min-width="160" />
      <el-table-column prop="host" :label="tl('host')" min-width="180" />
      <el-table-column :label="tl('aclResourceType')" min-width="140">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.resource_type, resourceTypeOptions) }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('aclResourceName')" min-width="180">
        <template #default="{ row }">
          <span
            v-if="row.pattern_type === StreamPatternType.Prefixed"
            class="text-size12 text-tip-color mr-1"
          >
            {{ tl('prefixed') }}
          </span>
          {{ row.resource_name }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('aclOperation')" min-width="120">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.operation, operationOptions) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Auth.permission')" min-width="120">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.permission, permissionOptions) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Base.operation')" min-width="80px">
        <template #default="{ row }">
          <el-button
            plain
            size="small"
            :disabled="!$hasPermission('delete')"
            @click="handleDel(row)"
          >
            {{ t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <StreamingAuthzDialog v-model="isDialogShow" />
</template>

<script lang="ts" setup>
import { deleteStreamingAuthz, getStreamingAuthzList } from '@/api/streaming'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import StreamingAuthzDialog from './components/StreamingAuthzDialog.vue'

enum StreamPatternType {
  Literal = 'LITERAL',
  Prefixed = 'PREFIXED',
  // just for UX, API doesn't have this value
  All = 'ALL',
}

type StreamingAuthz = any

// TODO:TODO:TODO:TODO:TODO:TODO:
const resourceTypeOptions: Array<any> = []
const operationOptions: Array<any> = []
const permissionOptions: Array<any> = []

const { tl, t } = useI18nTl('streaming')

const authzList = ref<Array<StreamingAuthz>>([])
const isLoading = ref(false)

const getAuthzList = async () => {
  try {
    isLoading.value = true
    authzList.value = await getStreamingAuthzList()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getAuthzList()

const isDialogShow = ref(false)
const addAuthn = () => {
  isDialogShow.value = true
}

const handleDel = async (name: string) => {
  try {
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO: 删除确认
    await deleteStreamingAuthz(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getAuthzList()
  } catch (error) {
    //
  }
}
</script>
