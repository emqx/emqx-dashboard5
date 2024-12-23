<template>
  <div class="log app-wrapper with-padding-top">
    <el-card class="app-card allow-overflow no-padding-bottom">
      <schema-form
        ref="SchemaFormCom"
        :according-to="{ path: '/configs/log' }"
        need-rules
        type="log"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :props-order-map="propsOrderMap"
        :data-handler="handleFileSchema"
        :form-props="{ labelWidth: state.lang === 'zh' ? 284 : 336 }"
        :default-tab="tab"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { getLogConfigs, updateLogConfigs } from '@/api/config'
import { customValidate } from '@/common/tools'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import SchemaForm from '@/components/SchemaForm'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { Log } from '@/types/config'
import { Properties } from '@/types/schemaForm'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { ComputedRef, computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
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

    const route = useRoute()
    const tab: ComputedRef<string | undefined> = computed(() => route.query.tab?.toString())

    const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
    useDataNotSaveConfirm(checkDataIsChanged)

    const handleFileSchema = (data: { components: Properties; rules: SchemaRules }) => {
      const { components } = data
      const { file } = components
      const targetProp = (file?.oneOf as Array<any>)?.find(
        (item) => item.$handler_name,
      )?.$handler_name
      if (targetProp && file && (!file.properties || isEmptyObj(file.properties))) {
        file.properties = {
          default: {
            ...targetProp,
            key: 'default',
            path: 'file.default',
          },
        }
        if (file.type === 'oneof') {
          file.type = 'object'
        }
        delete file.oneOf
      }
      return { components, rules: data.rules }
    }

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
      tab,
      handleFileSchema,
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
