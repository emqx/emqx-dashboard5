<template>
  <div class="streaming-authn app-wrapper">
    <div class="section-header">
      <div />
      <el-button :disabled="!$hasPermission('post')" type="primary" @click="addAuthn" :icon="Plus">
        {{ t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="streamList" v-loading="isLoading">
      <el-table-column
        prop="user_name"
        :label="t('Base.username')"
        show-overflow-tooltip
        min-width="320px"
      />
      <el-table-column prop="mechanism" :label="tl('authType')" min-width="180px" />
      <el-table-column :label="t('Base.operation')" min-width="80px">
        <template #default="{ row }">
          <el-button size="small" :disabled="!$hasPermission('put')" @click="handleEdit(row)">
            {{ t('Base.edit') }}
          </el-button>
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
  <StreamingAuthnDialog v-model="isDialogShow" :data="currentAuthn" @submitted="getAuthnList" />
</template>

<script lang="ts" setup>
import { deleteStreamingAuthn, getStreamingAuthnList } from '@/api/streaming'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { StreamingAuthn } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import StreamingAuthnDialog from './components/StreamingAuthnDialog.vue'

const { tl, t } = useI18nTl('streaming')

const streamList = ref<Array<StreamingAuthn>>([])
const isLoading = ref(false)

const getAuthnList = async () => {
  try {
    isLoading.value = true
    streamList.value = await getStreamingAuthnList()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getAuthnList()

const isDialogShow = ref(false)
const currentAuthn = ref<StreamingAuthn | undefined>(undefined)
const addAuthn = () => {
  currentAuthn.value = undefined
  isDialogShow.value = true
}

const handleEdit = (data: StreamingAuthn) => {
  currentAuthn.value = data
  isDialogShow.value = true
}

const { confirmDel } = useOperationConfirm()
const handleDel = async ({ mechanism, user_name }: StreamingAuthn) => {
  try {
    await confirmDel()
    await deleteStreamingAuthn({ mechanism, user_name })
    ElMessage.success(t('Base.deleteSuccess'))
    getAuthnList()
  } catch (error) {
    //
  }
}
</script>
