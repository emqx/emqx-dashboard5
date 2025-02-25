<template>
  <div class="influxdb-write-syntax-input">
    <div class="type-select">
      <el-form-item :label="tl('dataFormat')">
        <template #label>
          <FormItemLabel
            :label="tl('dataFormat')"
            :desc="`${tl('dataDefinition')} ${tl('dataDefinitionDesc', { database })}`"
            desc-marked
          />
        </template>
        <el-radio-group v-model="activeTab">
          <el-radio-button :value="Tab.JSON" border> JSON </el-radio-button>
          <el-radio-button :value="Tab.Raw" border> Line Protocol </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item prop="parameters.write_syntax" v-if="activeTab === Tab.Raw">
      <template #label>
        <FormItemLabel
          :label="getLabel('write_syntax')"
          :desc="getDesc('write_syntax')"
          desc-marked
        />
      </template>
      <div class="monaco-container">
        <Monaco
          :id="createRandomString()"
          v-model="lineProtocol"
          lang="sql"
          :disabled="readonly || disabled"
          :completion-provider="completionProvider"
        />
      </div>
    </el-form-item>
    <el-card class="app-card json-form-card" shadow="never" v-else>
      <InfluxdbLineProtocolForm
        v-model="lineProtocol"
        ref="protocolFormCom"
        :readonly="readonly"
        :disabled="disabled"
        :type="type"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import FormItemLabel from '@/components/FormItemLabel.vue'
import Monaco from '@/components/Monaco.vue'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useAvailableProviders } from '@/hooks/Rule/useProvidersForMonaco'

import { BridgeType } from '@/types/enum'

import InfluxdbLineProtocolForm from './InfluxdbLineProtocolForm.vue'

enum Tab {
  Raw = 'raw',
  JSON = 'JSON',
}

const props = defineProps({
  modelValue: {
    type: String,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
  },
  type: {
    type: String as PropType<BridgeType>,
    default: BridgeType.InfluxDB,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl, t } = useI18nTl('RuleEngine')
const getLabel = (key: string) => t(`BridgeSchema.common.${key}.label`)
const getDesc = (key: string) => t(`BridgeSchema.${props.type}.${key}.desc`)
const activeTab = ref(Tab.JSON)

const { getBridgeLabelByTypeValue } = useBridgeTypeValue()
const database = computed(() => getBridgeLabelByTypeValue(props.type) ?? '')

const { completionProvider } = useAvailableProviders()

const lineProtocol = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const protocolFormCom = ref()

const validate = () => {
  if (activeTab.value === Tab.JSON) {
    return protocolFormCom.value.validate()
  }
  return Promise.resolve()
}

const clearValidate = () => {
  return protocolFormCom.value.clearValidate()
}

defineExpose({ validate, clearValidate })
</script>

<style lang="scss">
.influxdb-write-syntax-input {
  width: 100%;
  .json-form-card {
    margin-top: 12px;
    border: 1px solid var(--el-card-border-color);
  }
  .el-radio-group {
    margin: 8px 0 12px 0;
  }
  .type-select {
    margin-bottom: 16px;
  }
  .el-card {
    margin-bottom: 0;
  }
}
</style>
