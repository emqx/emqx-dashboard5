<template>
  <div class="influxdb-write-syntax-input">
    <div>
      <el-radio-group v-model="activeTab">
        <el-radio :label="Tab.JSON" border> JSON </el-radio>
        <el-radio :label="Tab.Raw" border> LINE PROTOCOL </el-radio>
      </el-radio-group>
    </div>
    <el-card class="app-card" shadow="never">
      <div class="monaco-container" v-if="activeTab === Tab.Raw">
        <Monaco :id="createRandomString()" v-model="lineProtocol" lang="sql" />
      </div>
      <InfluxdbLineProtocolForm v-else v-model="lineProtocol" ref="protocolFormCom" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import Monaco from '@/components/Monaco.vue'
import { computed, defineEmits, defineProps, ref, defineExpose } from 'vue'
import InfluxdbLineProtocolForm from './InfluxdbLineProtocolForm.vue'

enum Tab {
  Raw = 'raw',
  JSON = 'JSON',
}

const props = defineProps({
  modelValue: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

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
  return protocolFormCom.value.validate()
}

const clearValidate = () => {
  return protocolFormCom.value.clearValidate()
}

defineExpose({ validate, clearValidate })
</script>

<style lang="scss">
.influxdb-write-syntax-input {
  width: 100%;
  .el-card {
    margin-top: 12px;
    border: 1px solid var(--el-card-border-color);
  }
}
</style>
