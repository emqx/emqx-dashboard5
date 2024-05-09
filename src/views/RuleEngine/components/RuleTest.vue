<template>
  <div class="rule-test">
    <LogDataDisplay
      :log-data="logData"
      :is-test-started="isTestStarted"
      @start-test="startTest"
      @input-simulated-data="openMockDataDrawer"
    />
    <div class="buttons-bar">
      <div class="btn-start-container" v-if="!isTestStarted && !showStartTestInChild">
        <el-button
          type="primary"
          plain
          @click="startTest"
          :icon="CaretRight"
          :disabled="!savedAfterRuleChange"
        >
          {{ tl('startTest') }}
        </el-button>
        <p class="tip" v-if="!savedAfterRuleChange">
          {{ tl('pleaseSaveFirst') }}
        </p>
      </div>
      <div v-if="isTestStarted">
        <el-button type="primary" plain @click="openMockDataDrawer">
          {{ tl('inputSimulatedData') }}
        </el-button>
        <el-button plain @click="stopTest">
          {{ tl('stopTest') }}
        </el-button>
      </div>
    </div>
    <MockDataDrawer
      v-model="showMockDataDrawer"
      :rule-data="ruleData"
      :ingress-bridge-list="ingressBridgeList"
      @submit="handleSubmitMockData"
    />
  </div>
</template>

<script setup lang="ts">
import { waitAMoment } from '@/common/tools'
import useDebugRule, { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem } from '@/types/rule'
import { CaretRight } from '@element-plus/icons-vue'
import { PropType, computed, defineProps, ref, watch } from 'vue'
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
})

const { tl } = useI18nTl('RuleEngine')

const { savedAfterRuleChange } = useStatusController()

const showMockDataDrawer = ref(false)

const {
  logData,
  handleStopTest,
  submitMockDataForTestRule,
  startTestRuleUseRealData,
  setCbAfterPolling,
} = useDebugRule()

const showStartTestInChild = computed(() => Object.keys(logData.value).length === 0)

const ScrollbarCom = ref()
const scrollLogToBottom = async (log: string) => {
  if (log) {
    let isScrollToBottom = false
    const scrollWrap = ScrollbarCom.value?.wrapRef
    const scrollContent = scrollWrap?.firstChild
    if (scrollWrap && scrollContent) {
      isScrollToBottom =
        Math.abs(scrollWrap.clientHeight + scrollWrap.scrollTop - scrollContent.clientHeight) < 5
    }
    await waitAMoment()
    if (isScrollToBottom) {
      ScrollbarCom.value.scrollTo({
        top: scrollContent.clientHeight - scrollWrap.clientHeight,
        behavior: 'smooth',
      })
    }
  }
}

const isTestStarted = ref(false)
const startTest = async () => {
  isTestStarted.value = true
  try {
    await startTestRuleUseRealData(props.ruleData.id)
    setCbAfterPolling(scrollLogToBottom)
  } catch (error) {
    //
  }
}

const openMockDataDrawer = () => {
  showMockDataDrawer.value = true
}
const handleSubmitMockData = async (context: Record<string, any>) => {
  try {
    await submitMockDataForTestRule(props.ruleData.id, context)
    setCbAfterPolling(scrollLogToBottom)
    showMockDataDrawer.value = false
  } catch (error) {
    //
  }
}

const stopTest = () => {
  handleStopTest()
  isTestStarted.value = false
}

const judgeNeedRemindUser = () => isTestStarted.value
useDataNotSaveConfirm(judgeNeedRemindUser, 'RuleEngine.debugLeaveConfirm')

watch(() => props.ruleData, stopTest)
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
}
</style>
