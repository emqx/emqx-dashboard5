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
  <StreamingAuthnDialog v-model="isDialogShow" />
</template>

<script lang="ts" setup>
import { deleteStreamingAuthn, getStreamingAuthnList } from '@/api/streaming'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import StreamingAuthnDialog from './components/StreamingAuthnDialog.vue'

type StreamingAuthn = any

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

const isDialogShow = ref(false)
const addAuthn = () => {
  isDialogShow.value = true
}

const handleDel = async (name: string) => {
  try {
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO: 删除确认
    await deleteStreamingAuthn(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getAuthnList()
  } catch (error) {
    //
  }
}

onMounted(() => {
  getAuthnList()
})
</script>
