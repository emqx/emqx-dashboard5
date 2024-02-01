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
          <ConnectorSelect v-model="formData.connector" :type="BridgeType.InfluxDB" />
        </CustomFormItem>
      </el-col>
      <el-col :span="colSpan">
        <CustomFormItem :label="t('Flow.description')" prop="description" :readonly="readonly">
          <el-input v-model="formData.description" />
        </CustomFormItem>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="26">
      <el-col :span="colSpan">
        <el-form-item prop="parameters.precision">
          <template #label>
            <span>{{ getText('precision.label') }}</span>
            <InfoTooltip :content="getText('precision.desc')" />
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
import { fillEmptyValueToUndefinedField, getAPIPath } from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomFormItem from '@/components/CustomFormItem.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useGetInfoFromComponents from '@/hooks/Rule/bridge/useGetInfoFromComponents'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { BridgeItem, OtherBridge } from '@/types/rule'
import { Property } from '@/types/schemaForm'
import { cloneDeep, isEqual } from 'lodash'
import { Ref, computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'
import ConnectorSelect from '../ConnectorSelect.vue'
import BridgeResourceOpt from './BridgeResourceOpt.vue'
import InfluxdbWriteSyntaxInput from './InfluxdbWriteSyntaxInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
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

const emit = defineEmits(['update:modelValue', 'init'])

const { tl, t } = useI18nTl('RuleEngine')
const getText = (key: string) => t(`BridgeSchema.influxdb.${key}`)

const { components } = useSchemaForm(getAPIPath(`/schemas/actions`), {
  ref: '#/components/schemas/bridge_influxdb.post_bridge_v2',
})
const { getPropItem } = useGetInfoFromComponents(components)

const { createRawInfluxDBForm: createDefaultValue } = useBridgeFormCreator()

const formData: Ref<OtherBridge> = ref(createDefaultValue())
const formCom = ref()
const writeSyntaxInputCom = ref()

const { createRequiredRule, createCommonIdRule } = useFormRules()
const formRules = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  connector: createRequiredRule(t('components.connector'), 'select'),
  'parameters.write_syntax': createRequiredRule(getText('write_syntax.label')),
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
  return Promise.all([formCom.value.validate(), writeSyntaxInputCom.value.validate()])
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
