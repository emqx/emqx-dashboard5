<template>
  <el-drawer v-model="showDrawer" :title="tl('mockData')" class="mock-data-drawer" :size="660">
    <div class="test-header">
      <label class="test-label">
        {{ tl('dataSource') }}
        <InfoTooltip :content="tl('dataSourceDesc')" />
      </label>
      <p v-if="isDataTypeNoMatchSQL" class="no-match-tip">
        {{ tl('dataTypeSQLNoMatch') }}
      </p>
      <FromSelect
        v-model="dataType"
        :ingress-bridge-list="ingressBridgeList"
        :event-list="eventList"
        for-test
      />
    </div>
    <div>
      <label class="test-label">
        {{ tl('testData') }}
        <InfoTooltip :content="tl('testDataDesc')" />
      </label>
      <el-card shadow="never" class="test-card with-border">
        <TestSQLContextForm v-model="testParams.context" />
      </el-card>
    </div>
    <template #footer>
      <el-button
        v-if="!isTestStarted"
        type="primary"
        plain
        @click="submit"
        :icon="CaretRight"
        :loading="isSubmitting"
      >
        {{ !isTestStarted ? tl('startTest') : tl('submitTest') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import InfoTooltip from '@/components/InfoTooltip.vue'
import { useMockData, useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem } from '@/types/rule'
import { PropType, WritableComputedRef, computed, defineEmits, defineProps, ref, watch } from 'vue'
import FromSelect from '../components/FromSelect.vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import { CaretRight } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  ruleData: {
    type: Object,
    required: true,
  },
  isTestStarted: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { tl } = useI18nTl('RuleEngine')

const { isTesting, testTarget } = useStatusController()

const {
  dataType,
  testParams,
  isDataTypeNoMatchSQL,
  eventList,
  resetContext,
  getMockContext,
  setDataTypeNContext,
} = useMockData(props)

watch(showDrawer, (val) => {
  if (val) {
    setDataTypeNContext()
  } else {
    isSubmitting.value = false
  }
})

const isSubmitting = ref(false)
const submit = () => {
  const context = getMockContext()
  emit('submit', context)
}
</script>

<style lang="scss"></style>
