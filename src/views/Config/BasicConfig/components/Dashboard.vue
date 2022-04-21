<template>
  <div class="dashboard">
    <schema-form
      path="/configs/dashboard"
      :form="configs"
      :btn-loading="saveLoading"
      @save="handleSave"
    ></schema-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import { getDashboardConfigs, updateDashboardConfigs } from '@/api/config'
import { Dashboard } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Dashboard',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()
    const loadData = async () => {
      const res = await getDashboardConfigs()
      if (res) {
        configs.value = res
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Dashboard) => {
      saveLoading.value = true
      const data = {
        ...val,
      }
      try {
        await updateDashboardConfigs(data)
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
