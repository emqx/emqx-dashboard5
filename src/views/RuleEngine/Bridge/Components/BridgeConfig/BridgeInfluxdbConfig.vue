<template>
  <el-form
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
    class="bridge-influxdb-config bridge-config"
    :rules="formRules"
    :model="formData"
    :disabled="disabled"
    :validate-on-rule-change="false"
  >
    <el-row :gutter="26">
      <el-col :span="colSpan" v-if="!hideName">
        <CustomFormItem :label="tl('name')" prop="name" :readonly="readonly">
          <el-input v-model="formData.name" :disabled="edit" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem :label="t('components.connector')" prop="connector" :readonly="readonly">
          <ConnectorSelect
            v-model="formData.connector"
            :type="formData.type"
            @change="handleConnectorChange"
          />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem :label="t('Flow.description')" prop="description" :readonly="readonly">
          <el-input v-model="formData.description" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="26" v-if="!isSQL">
      <el-col :span="colSpan">
        <el-form-item prop="parameters.precision">
          <template #label>
            <span>{{ getLabel('precision') }}</span>
            <InfoTooltip :content="getDesc('precision')" />
          </template>
          <el-select v-model="formData.parameters.precision" v-if="!readonly">
            <el-option
              v-for="{ value, label } in getPrecisionOpts()"
              :value="value"
              :key="value"
              :label="label"
            />
          </el-select>
          <p class="value" v-else>
            {{
              t(
                `General.${
                  formData.parameters.precision === 's' ? 'sec' : formData.parameters.precision
                }`,
              )
            }}
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="24"><el-divider /></el-col>

      <el-col :span="24">
        <el-form-item label-width="0px">
          <InfluxdbWriteSyntaxInput
            v-model="formData.parameters.write_syntax"
            ref="writeSyntaxInputCom"
            :readonly="readonly"
            :disabled="disabled"
            :type="formData.type"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="26" v-else>
      <el-col :span="24">
        <el-form-item label="SQL">
          <div class="monaco-container">
            <Monaco
              :id="createRandomString()"
              v-model="formData.parameters.sql"
              lang="sql"
              :disabled="readonly || disabled"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="26">
      <el-col :span="24" class="col-fallback-actions">
        <el-form-item :label="tl('fallbackActions')">
          <FallbackActionsEditor
            v-model="formData.fallback_actions"
            :action-key="modelValue?.id"
            :readonly="readonly"
            :is-fallback="isFallback"
            :namespace="modelValue?.namespace"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <AdvancedSettingContainer>
      <el-row :gutter="26">
        <BridgeResourceOpt
          v-model="formData.resource_opts"
          with-batch-config
          :with-start-timeout-config="false"
          :readonly="readonly"
          :colSpan="colSpan"
        />
      </el-row>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import { BridgeType } from '@/types/enum'
import { BridgeItem, Connector, OtherBridge } from '@/types/rule'
import { Property } from '@/types/schemaForm'
import ConnectorSelect from '../ConnectorSelect.vue'
import FallbackActionsEditor from '../FallbackActionsEditor.vue'
import BridgeResourceOpt from './BridgeResourceOpt.vue'
import InfluxdbWriteSyntaxInput from './InfluxdbWriteSyntaxInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
  },
  type: {
    type: String,
  },
  edit: {
    type: Boolean,
  },
  copy: {
    type: Boolean,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
  },
  /**
   * for rule
   */
  hideName: {
    type: Boolean,
    default: false,
  },
  isUsingInFlow: {
    type: Boolean,
  },
})
const isFallback = inject('isFallback', false)

const emit = defineEmits(['update:modelValue', 'init'])

const { tl, t } = useI18nTl('RuleEngine')
const getLabel = (key: string) => t(`BridgeSchema.common.${key}.label`)
const getDesc = (key: string) =>
  t(`BridgeSchema.${props.modelValue?.type ?? 'influxdb'}.${key}.desc`)

const { components } = useSchemaForm('/schemas/actions', {
  ref: '#/components/schemas/bridge_influxdb.post_bridge_v2',
})
const { getPropItem } = useGetInfoFromComponents(components)

const { createRawInfluxDBForm } = useBridgeFormCreator()
const createDefaultValue = () => {
  return { ...createRawInfluxDBForm(), type: props.type ?? BridgeType.InfluxDB }
}

const formData: Ref<OtherBridge> = ref(createDefaultValue())
const formCom = ref()
const writeSyntaxInputCom = ref()

const { createRequiredRule, createCommonIdRule } = useFormRules()
const formRules = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  connector: createRequiredRule(t('components.connector'), 'select'),
  'parameters.write_syntax': createRequiredRule(getLabel('write_syntax')),
}

const colSpan = computed(() => (props.isUsingInFlow ? 24 : 12))

const initFormData = async () => {
  if (!props.modelValue) {
    return
  }
  if (props.edit || props.copy) {
    formData.value = fillEmptyValueToUndefinedField(
      cloneDeep(props.modelValue),
      createDefaultValue(),
    ) as BridgeItem
    emit('init', formData.value)
  } else {
    formData.value = { ...formData.value, ...props.modelValue }
  }
}

const selectedConnector = ref<Connector | undefined>(undefined)
const isArrowFlightConnector = (connector?: Connector) =>
  /arrow_flight/i.test(connector?.parameters?.driver_type ?? '')

const isSelectedArrowFlightConnector = computed(() => {
  if (props.type !== BridgeType.Datalayers || !selectedConnector.value) {
    return false
  }
  return isArrowFlightConnector(selectedConnector.value)
})
const isSQL = computed(() => {
  if (props.type !== BridgeType.Datalayers) {
    return false
  }
  return isSelectedArrowFlightConnector.value
})

const defaultSQL =
  'insert into t_mqtt_msg(time, msgid, sender, topic, qos, payload, arrived) values (${timestamp}, ${id}, ${clientid}, ${topic}, ${qos}, ${payload}, ${timestamp})'

const handleConnectorChange = (val?: Connector) => {
  if (props.type !== BridgeType.Datalayers) {
    return
  }
  const preV = isArrowFlightConnector(selectedConnector.value)
  const curV = isArrowFlightConnector(val)
  if (preV !== curV) {
    if (curV) {
      delete formData.value.parameters.precision
      delete formData.value.parameters.write_syntax
      if (!selectedConnector.value) {
        formData.value.parameters.sql = formData.value.parameters.sql ?? defaultSQL
      } else {
        formData.value.parameters.sql = formData.value.parameters.sql ?? ''
      }
    } else {
      delete formData.value.parameters.sql
      formData.value.parameters.precision = formData.value.parameters.precision ?? 'ms'
      formData.value.parameters.write_syntax = formData.value.parameters.write_syntax ?? ''
    }
  }
  selectedConnector.value = val
}
const { getConnectorList } = useConnectorList()
const initConnector = async () => {
  if (!formData.value.connector || selectedConnector.value) {
    return
  }
  const list = await getConnectorList()
  const connector = list.find(({ name }) => name === formData.value.connector)
  if (connector) {
    handleConnectorChange(connector as Connector)
  }
}
initConnector()

watch(
  () => formData.value.connector,
  async () => {
    initConnector()
  },
)

watch(
  () => formData.value,
  () => {
    emit('update:modelValue', formData.value)
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, formData.value)) {
      initFormData()
    }
  },
)

const getPrecisionOpts = () => {
  const rawPrecisionOpts: Property['symbols'] = getPropItem('parameters.precision').symbols || []
  return rawPrecisionOpts.map((item) => ({
    value: item,
    label: t(`General.${item === 's' ? 'sec' : item}`),
  }))
}

const validate = () => {
  return Promise.all([
    formCom.value.validate(),
    isSQL.value ? Promise.resolve() : writeSyntaxInputCom.value.validate(),
  ])
}

const clearValidate = () => {
  formCom.value?.clearValidate()
  writeSyntaxInputCom.value?.clearValidate()
  return
}

initFormData()

defineExpose({ validate, clearValidate })
</script>

<style lang="scss" scoped>
.label-desc {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
}
</style>
