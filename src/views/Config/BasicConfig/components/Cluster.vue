<template>
  <div class="cluster">
    <schema-form
      path="/configs/cluster"
      type="cluster"
      :form="configs"
      :btn-loading="saveLoading"
      @save="handleSave"
    >
      <template #invite-node>
        <el-form-item :label="$t('BasicConfig.invaiteNode')">
          <p class="item-desc">{{ $t('BasicConfig.inviteNodeDesc') }}</p>
          <invite-node></invite-node>
        </el-form-item>
      </template>
    </schema-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import InviteNode from './InviteNode.vue'
import { getClusterConfigs, updateClusterConfigs } from '@/api/config'
import { Cluster } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Cluster',
  components: {
    SchemaForm,
    InviteNode,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()
    const loadData = async () => {
      const res = await getClusterConfigs()
      if (res) {
        configs.value = res
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Cluster) => {
      saveLoading.value = true
      const data = {
        ...val,
      }
      try {
        await updateClusterConfigs(data)
        ElMessage.success(t('Base.updateSuccess'))
        reloading()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    loadData()
    return {
      handleSave,
      configs,
      reloading,
      saveLoading,
    }
  },
})
</script>

<style lang="scss" scoped></style>
