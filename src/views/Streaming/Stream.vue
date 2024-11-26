<template>
  <div class="streams app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button :disabled="!$hasPermission('post')" type="primary" @click="addStream" :icon="Plus">
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="streamList" v-loading="isLoading">
      <el-table-column prop="name" :label="t('Base.name')" />
      <el-table-column prop="type" :label="tl('type')">
        <template #default="{ row }">
          {{ getLabelByValue(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" :label="t('Base.note')" />
      <el-table-column :label="$t('Base.operation')">
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
  <StreamDialog v-model="isDialogShow" />
</template>

<script lang="ts" setup>
import { deleteStream, getStreams as requestStreams } from '@/api/streaming'
import useSchemaType from '@/hooks/Rule/schema/useSchemaType'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Ref, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StreamDialog from './components/StreamDialog.vue'

const router = useRouter()
const { tl, t } = useI18nTl('RuleEngine')

const streamList: Ref<Array<unknown>> = ref([])
const isLoading = ref(false)

const { getLabelByValue } = useSchemaType()

const getStreams = async () => {
  try {
    isLoading.value = true
    streamList.value = await requestStreams()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goSchemaDetail = (name: string) =>
  router.push({ name: 'internal-schema-detail', params: { schemaName: name } })

const isDialogShow = ref(false)
const addStream = () => {
  isDialogShow.value = true
}

const handleDel = async (name: string) => {
  try {
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO: 删除确认
    await deleteStream(name)
    ElMessage.success(t('Base.deleteSuccess'))
    getStreams()
  } catch (error) {
    //
  }
}

onMounted(() => {
  getStreams()
})
</script>
