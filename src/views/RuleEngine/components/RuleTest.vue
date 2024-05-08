<template>
  <div class="rule-test">
    <div class="vertical-align-center radio-group-container">
      <label>{{ tl('inputData') }}</label>
      <el-radio-group v-model="inputData" @change="handleTestMethodChanged">
        <el-radio-button :label="InputData.Mock">{{ tl('mockData') }}</el-radio-button>
        <el-radio-button :label="InputData.Real">{{ tl('realData') }}</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <el-row class="input-output-row" :gutter="26">
      <el-col :span="12" v-if="!isMockInput">
        <label class="test-label">{{ tl('testingWithRealData') }}</label>
        <el-card shadow="never" class="test-card with-border tip-card">
          <p class="tip" v-if="!isTestStarted">{{ tl('pleaseClickStartTest') }}</p>
          <p class="tip" v-else>{{ tl('waitingRealData') }}</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <label class="test-label" shadow="none">
          {{ tl('outputResult') }}
          <InfoTooltip :content="tl('outputResultDesc')" />
        </label>
        <el-card class="test-result rule-result">
          <el-scrollbar :max-height="490" ref="ScrollbarCom">
            <div class="collapse-wrap">
              <LogDataDisplay :log-data="logData" />
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row> -->
    <LogDataDisplay :log-data="logData" />

    <div class="buttons-bar">
      <div class="btn-start-container" v-if="!isTestStarted" :key="createRandomString()">
        <el-button
          v-if="!isMockInput"
          type="primary"
          plain
          @click="startTest"
          :icon="CaretRight"
          :disabled="!savedAfterRuleChange"
        >
          {{ tl('startTest') }}
        </el-button>
        <el-button
          v-else
          type="primary"
          plain
          @click="openMockDataDrawer"
          :disabled="!savedAfterRuleChange"
        >
          {{ tl('inputSimulatedData') }}
        </el-button>
        <p class="tip" v-if="!savedAfterRuleChange">{{ tl('pleaseSaveFirst') }}</p>
      </div>
      <div v-if="isTestStarted" :key="createRandomString()">
        <el-button v-if="isMockInput" type="primary" plain @click="submitTestRule">
          {{ tl('submitTest') }}
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
      :is-test-started="isTestStarted"
      @submit="handleSubmitMockData"
    />
  </div>
</template>

<script setup lang="ts">
import { createRandomString, waitAMoment } from '@/common/tools'
import useDebugRule, { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { TestRuleTarget } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { CaretRight } from '@element-plus/icons-vue'
import { PropType, computed, defineProps, ref, watch } from 'vue'
import LogDataDisplay from './LogDataDisplay.vue'
import MockDataDrawer from './MockDataDrawer.vue'

const enum InputData {
  Mock = 'mock',
  Real = 'real',
}

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

const { tl, t } = useI18nTl('RuleEngine')

const inputData = ref<InputData>(InputData.Mock)
const isMockInput = computed(
  () => testTarget.value === TestRuleTarget.SQL || inputData.value === InputData.Mock,
)

const { isTesting, savedAfterRuleChange, testTarget } = useStatusController()

const showMockDataDrawer = ref(false)

const {
  logData,
  emptyLogArr,
  handleStopTest,
  startTestRuleUseMockData,
  submitMockDataForTestRule,
  startTestRuleUseRealData,
  setCbAfterPolling,
} = useDebugRule()

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
    if (!isTestStarted.value) {
      await startTestRuleUseMockData(props.ruleData.id)
      isTestStarted.value = true
      await waitAMoment(1500)
    }
    await submitMockDataForTestRule(props.ruleData.id, context)
    setCbAfterPolling(scrollLogToBottom)
    showMockDataDrawer.value = false
  } catch (error) {
    //
  }
}
const submitTestRule = async () => {
  try {
    // TODO:TODO:TODO:TODO:TODO:
  } catch (error) {
    //
  }
}
const handleTestMethodChanged = () => {
  emptyLogArr()
  stopTest()
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
}
</style>
