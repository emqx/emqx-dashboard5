<template>
  <el-tabs v-model="activeTab" class="influxdb-write-syntax-input">
    <el-tab-pane label="LINE PROTOCOL" :name="Tab.Raw">
      <div class="monaco-container">
        <Monaco :id="createRandomString()" v-model="lineProtocol" lang="sql" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="JSON" :name="Tab.JSON">
      <InfluxdbLineProtocolForm v-model="lineProtocol" ref="protocolFormCom" />
    </el-tab-pane>
  </el-tabs>
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
}
</style>
