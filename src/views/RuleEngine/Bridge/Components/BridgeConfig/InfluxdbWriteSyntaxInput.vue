<template>
  <el-card class="influxdb-write-syntax-input app-card" shadow="never">
    <div class="type-select">
      <el-form-item :label="tl('dataFormat')">
        <el-radio-group v-model="activeTab">
          <el-radio :label="Tab.JSON" border> JSON </el-radio>
          <el-radio :label="Tab.Raw" border> LINE PROTOCOL </el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item prop="write_syntax" v-if="activeTab === Tab.Raw">
      <template #label>
        <span>{{ writeSyntaxPropItem?.label }}</span>
        <InfoTooltip popper-class="is-wider">
          <template #content>
            <MarkdownContent :content="writeSyntaxPropItem?.description" />
          </template>
        </InfoTooltip>
      </template>
      <div class="monaco-container">
        <Monaco :id="createRandomString()" v-model="lineProtocol" lang="sql" />
      </div>
    </el-form-item>
    <InfluxdbLineProtocolForm v-else v-model="lineProtocol" ref="protocolFormCom" />
  </el-card>
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import Monaco from '@/components/Monaco.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { Property } from '@/types/schemaForm'
import { computed, defineEmits, defineExpose, defineProps, PropType, ref } from 'vue'
import InfluxdbLineProtocolForm from './InfluxdbLineProtocolForm.vue'

enum Tab {
  Raw = 'raw',
  JSON = 'JSON',
}

const props = defineProps({
  modelValue: {
    type: String,
  },
  writeSyntaxPropItem: {
    type: Object as PropType<Property>,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('RuleEngine')
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
.influxdb-write-syntax-input.el-card {
  width: 100%;
  margin-top: 12px;
  border: 1px solid var(--el-card-border-color);
  .type-select {
    margin-bottom: 16px;
  }
}
</style>
