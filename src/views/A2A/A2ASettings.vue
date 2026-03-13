<template>
  <div class="a2a-settings app-wrapper">
    <detail-header :item="{ name: t('Base.settings'), routeName: 'a2a-registry' }" />
    <el-card class="app-card allow-overflow">
      <schema-form
        ref="SchemaFormCom"
        type="a2a_registry"
        :form-props="{ labelWidth: state.lang === 'zh' ? 172 : 192 }"
        :according-to="accordingTo"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getA2ARegistryConfig, updateA2ARegistryConfig, type A2ARegistryConfig } from '@/api/a2a'

const { state } = useStore()
const { t, tl } = useI18nTl('A2A')

const configs = ref<A2ARegistryConfig>({})
const saveLoading = ref(false)
const configLoading = ref(false)

const SchemaFormRef = useTemplateRef<any>('SchemaFormCom')
const checkDataIsChanged = () => !isEqual(SchemaFormRef.value?.configForm, rawData)

useDataNotSaveConfirm(checkDataIsChanged)

let rawData: any = undefined

const accordingTo = { ref: '#/components/schemas/a2a_registry.a2a_registry' }

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getA2ARegistryConfig()
    configs.value = res
    rawData = cloneDeep(configs.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const handleSave = async (val: A2ARegistryConfig) => {
  try {
    await customValidate(SchemaFormRef.value)
    saveLoading.value = true
    await updateA2ARegistryConfig(val)
    ElMessage.success(t('Base.updateSuccess'))
    loadData()
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}

loadData()
</script>
