<template>
  <div class="rule-test">
    <LogDataDisplay
      :is-flow="isFlow"
      :log-data="logData"
      :is-test-started="isTestStarted"
      @start-test="handleStartTest"
      @input-simulated-data="openMockDataDrawer"
    />
    <div class="buttons-bar">
      <div class="btn-start-container" v-if="!isTestStarted && !showStartTestInChild">
        <template v-if="!isFlow">
          <el-button
            type="primary"
            plain
            @click="handleStartTest"
            :icon="CaretRight"
            :disabled="!savedAfterDataChange"
          >
            {{ tl('startTest') }}
          </el-button>
          <p class="tip" v-if="!savedAfterDataChange">
            {{ tl('pleaseSaveFirst') }}
          </p>
        </template>
        <el-button plain @click="handleCloseTest">
          {{ tl('closeTest') }}
        </el-button>
      </div>
      <div class="btn-testing-container" v-if="isTestStarted">
        <el-button type="primary" plain @click="openMockDataDrawer">
          {{ tl('inputSimulatedData') }}
        </el-button>
        <el-button plain @click="stopTest">
          {{ tl('stopTest') }}
        </el-button>
        <p class="tip" v-if="!showStartTestInChild">{{ tl('tipForTesting') }}</p>
      </div>
    </div>
    <MockDataDrawer
      v-model="showMockDataDrawer"
      :rule-data="ruleData"
      :ingress-bridge-list="ingressBridgeList"
      :is-submitting="isSubmittingMockData"
      @submit="handleSubmitMockData"
    />
  </div>
</template>

<script setup lang="ts">
import useDebugRule, { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem } from '@/types/rule'
import { CaretRight } from '@element-plus/icons-vue'
import type { PropType } from 'vue'
import { computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'
import LogDataDisplay from './LogDataDisplay.vue'
import MockDataDrawer from './MockDataDrawer.vue'

const props = defineProps({
  ruleData: {
    type: Object,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  /**
   * diff interaction for flow and rule
   */
  isFlow: {
    type: Boolean,
  },
})
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'testing-status-change', data: boolean): void
}>()

const { tl } = useI18nTl('RuleEngine')

const { savedAfterDataChange } = useStatusController()

const showMockDataDrawer = ref(false)
const isSubmittingMockData = ref(false)

const { logData, handleStopTest, submitMockDataForTestRule, startTest } = useDebugRule()

const showStartTestInChild = computed(
  () => Object.keys(logData.value).length === 0 && !props.isFlow,
)

const isTestStarted = ref(false)
const handleStartTest = async () => {
  isTestStarted.value = true
  try {
    await startTest(props.ruleData.id)
  } catch (error) {
    //
  }
}

const handleCloseTest = () => emit('close')

const openMockDataDrawer = () => {
  showMockDataDrawer.value = true
}
const handleSubmitMockData = async (context: Record<string, any>) => {
  try {
    isSubmittingMockData.value = true
    await submitMockDataForTestRule(props.ruleData.id, context)
    showMockDataDrawer.value = false
  } catch (error) {
    //
  } finally {
    isSubmittingMockData.value = false
  }
}

const stopTest = () => {
  handleStopTest()
  isTestStarted.value = false
}

const judgeNeedRemindUser = () => isTestStarted.value
useDataNotSaveConfirm(judgeNeedRemindUser, 'RuleEngine.debugLeaveConfirm')

watch(() => props.ruleData, stopTest)
watch(isTestStarted, (value) => {
  emit('testing-status-change', value)
})

defineExpose({ handleStartTest, stopTest })
</script>

<style lang="scss">
.rule-test {
  .log-data-display {
    margin-bottom: 16px;
  }
  .btn-start-container {
    position: relative;
    .tip {
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 200px;
      transform: translateY(100%);
      opacity: 0.7;
    }
  }
  .btn-testing-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tip {
      margin-left: 16px;
    }
  }
}
</style>
