<template>
  <div class="no-tab-wrapper zone">
    <schema-form
      path="/configs/zones"
      :form="configs"
      :btn-loading="saveLoading"
      @save="handleSave"
    ></schema-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import { getZoneConfigs, updateZoneConfigs } from '@/api/config'
import { Zone } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Zone',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()
    const loadData = async () => {
      const res = await getZoneConfigs()
      if (res) {
        configs.value = res
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Zone) => {
      saveLoading.value = true
      const data = {
        ...val,
      }
      try {
        await updateZoneConfigs(data)
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
