<template>
  <div class="durable-sessions app-wrapper">
    <el-card class="app-card allow-overflow">
      <schema-form
        ref="SchemaFormCom"
        type="durable_sessions"
        :according-to="accordingTo"
        :form="configs"
        :btn-loading="saveLoading"
        :form-props="{ labelWidth: state.lang === 'zh' ? 160 : 250 }"
        :record-loading="configLoading"
        :data-handler="handleSchema"
        :props-order-map="propsOrder"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { DurableSessions, Zone } from '@/types/config'
import { Properties } from '@/types/schemaForm'

const configs = ref<DurableSessions>({} as DurableSessions)
const saveLoading = ref(false)
const configLoading = ref(false)
const { state } = useStore()
const { t } = useI18n()

let rawData: any = undefined
const SchemaFormCom = ref()
const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const accordingTo = { ref: `#/components/schemas/emqx.durable_sessions` }

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getDefaultZoneConfigs()
    configs.value = res.durable_sessions
    rawData = cloneDeep(configs.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const propsOrder = createOrderObj(
  ['enable', 'message_retention_period', 'batch_size', 'checkpoint_interval'],
  0,
)

interface SchemaData {
  components: Properties
  rules: SchemaRules
}

const handleSchema = (data: SchemaData) => {
  const { components, rules } = data
  const { enable, message_retention_period } = components
  if (enable) {
    enable.componentProps = { disabled: true }
  }
  if (message_retention_period) {
    message_retention_period.componentProps = { enabledUnits: ['ms', 's', 'm', 'h', 'd'] }
  }
  return { components, rules }
}

const handleSave = async (val: DurableSessions) => {
  try {
    await customValidate(SchemaFormCom.value)
    const zoneData: Zone = await getDefaultZoneConfigs()
    zoneData.durable_sessions = val
    saveLoading.value = true
    await updateDefaultZoneConfigs(zoneData)
    ElMessage.success(t('Base.updateSuccess'))
    loadData()
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}
loadData()
</script>
