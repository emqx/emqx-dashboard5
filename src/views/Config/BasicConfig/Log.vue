<template>
  <div class="log app-wrapper">
    <el-card class="config-card">
      <schema-form
        ref="SchemaFormCom"
        :according-to="{ path: '/configs/log' }"
        type="log"
        :form="configs"
        :btn-loading="saveLoading"
        :props-order-map="propsOrderMap"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import { getLogConfigs, updateLogConfigs } from '@/api/config'
import { Log } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { cloneDeep, isEqual } from 'lodash'

export default defineComponent({
  name: 'Log',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()

    let rawData: any = undefined
    const SchemaFormCom = ref()
    const propsOrderMap = { enable: 0 }

    const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
    useDataNotSaveConfirm(checkDataIsChanged)

    const loadData = async () => {
      try {
        configs.value = await getLogConfigs()
        rawData = cloneDeep(configs.value)
      } catch (error) {
        //
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Log) => {
      saveLoading.value = true
      const data = { ...val }
      try {
        await updateLogConfigs(data)
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
      SchemaFormCom,
      handleSave,
      configs,
      propsOrderMap,
      reloading,
      saveLoading,
    }
  },
})
</script>

<style lang="scss" scoped></style>
