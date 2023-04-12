<template>
  <div class="log app-wrapper">
    <el-card class="config-card">
      <schema-form
        ref="SchemaFormCom"
        :according-to="{ path: '/configs/log' }"
        type="log"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :props-order-map="propsOrderMap"
        :label-width="state.lang === 'zh' ? 284 : 336"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { getLogConfigs, updateLogConfigs } from '@/api/config'
import { customValidate } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { Log } from '@/types/config'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Log',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const configLoading = ref(false)
    const { t } = useI18n()
    const { state } = useStore()

    let rawData: any = undefined
    const SchemaFormCom = ref()
    const propsOrderMap = { enable: 0 }

    const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
    useDataNotSaveConfirm(checkDataIsChanged)

    const loadData = async () => {
      try {
        configLoading.value = true
        configs.value = await getLogConfigs()
        rawData = cloneDeep(configs.value)
      } catch (error) {
        //
      } finally {
        configLoading.value = false
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Log) => {
      try {
        await customValidate(SchemaFormCom.value)
        saveLoading.value = true
        const data = { ...val }
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
      state,
      SchemaFormCom,
      handleSave,
      configs,
      propsOrderMap,
      reloading,
      saveLoading,
      configLoading,
    }
  },
})
</script>

<style lang="scss" scoped></style>
