<template>
  <div class="influxdb-write-syntax-input">
    <div class="type-select">
      <el-form-item :label="tl('dataFormat')">
        <template #label>
          <span>{{ tl('dataFormat') }}</span>
          <InfoTooltip>
            <template #content>
              <MarkdownContent :content="`${tl('dataDefinition')} ${tl('dataDefinitionDesc')}`" />
            </template>
          </InfoTooltip>
        </template>
        <el-radio-group v-model="activeTab">
          <el-radio-button :label="Tab.JSON" border> JSON </el-radio-button>
          <el-radio-button :label="Tab.Raw" border> Line Protocol </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item prop="parameters.write_syntax" v-if="activeTab === Tab.Raw">
      <template #label>
        <span>{{ getText('write_syntax.label') }}</span>
        <InfoTooltip popper-class="is-wider">
          <template #content>
            <MarkdownContent :content="getText('write_syntax.desc')" />
          </template>
        </InfoTooltip>
      </template>
      <div class="monaco-container">
        <Monaco
          :id="createRandomString()"
          v-model="lineProtocol"
          lang="sql"
          :disabled="readonly || disabled"
        />
      </div>
    </el-form-item>
    <el-card class="app-card json-form-card" shadow="never" v-else>
      <InfluxdbLineProtocolForm
        v-model="lineProtocol"
        ref="protocolFormCom"
        :readonly="readonly"
        :disabled="disabled"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import Monaco from '@/components/Monaco.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineExpose, defineProps, ref } from 'vue'
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
})

const emit = defineEmits(['update:modelValue'])

const { tl, t } = useI18nTl('RuleEngine')
const getText = (key: string) => t(`BridgeSchema.influxdb.${key}`)
const activeTab = ref(Tab.JSON)

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
