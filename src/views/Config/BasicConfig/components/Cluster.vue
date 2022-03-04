<template>
  <div class="no-tab-wrapper cluster">
    <schema-form
      path="/configs/cluster"
      :form="configs"
      :btn-loading="saveLoading"
      @save="handleSave"
    ></schema-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import { getClusterConfigs, updateClusterConfigs } from '@/api/config'
import { Cluster } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Cluster',
  components: {
    SchemaForm,
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
      console.log(data)
      console.log(configs.value)
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
