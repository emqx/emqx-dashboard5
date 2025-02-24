<template>
  <el-card class="log-data-display">
    <div class="log-data-left" v-if="Object.keys(logData).length">
      <ul class="execution-list">
        <li
          class="execution-item space-between"
          v-for="(item, timestamp) in logData"
          :key="timestamp"
          :class="{ 'is-selected': timestamp === activeExecutionTimestamp }"
          @click="selectExecution(timestamp)"
        >
          <div class="execution-item-base vertical-align-center">
            <el-icon class="icon-status" :size="16">
              <component
                :is="getResultIcon(item.result)"
                :class="getResultIconClass(item.result)"
              />
            </el-icon>
            <div class="base-info event">
              <p>{{ getTriggerTitle(item.trigger.event || '') }}</p>
            </div>
            <div class="base-info topic" v-if="item.trigger.topic">
              <el-tooltip class="box-item" :content="`${t('Base.topic')}: ${item.trigger.topic}`">
                <p class="topic-container">{{ t('Base.topic') }}:&nbsp;{{ item.trigger.topic }}</p>
              </el-tooltip>
            </div>
          </div>
          <div class="execution-item-time">
            {{ dateFormat(Number(timestamp)) }}
          </div>
        </li>
      </ul>
    </div>
    <el-card
      class="log-data-right"
      v-if="Object.keys(logData).length && activeExecutionInfo"
      :key="activeExecutionTimestamp"
    >
      <el-collapse class="execution-log-content">
        <el-collapse-item
          v-for="(targetLogData, logTarget) in activeExecutionInfo"
          :key="logTarget"
          :name="logTarget"
        >
          <template #title>
            <el-icon class="icon-status">
              <component
                :is="getResultIcon(targetLogData.result)"
                :class="getResultIconClass(targetLogData.result)"
              />
            </el-icon>
            {{ getLogTargetTitle(targetLogData) }}
          </template>
          <div class="info-wrap">
            <div class="loading-container" v-if="needShowLoading(targetLogData)">
              <el-icon><Loading class="icon-pending" /></el-icon>
            </div>
            <template v-else>
              <div class="space-between target-info-hd">
                <el-radio-group
                  v-if="needTabsShowInfo(targetLogData.info)"
                  :modelValue="getSelectedBlock(logTarget)"
                  size="small"
                  @update:modelValue="setSelectedBlockValue(logTarget, $event)"
                >
                  <el-radio-button
                    v-for="(logItem, logMsg) in targetLogData.info"
                    :key="logMsg"
                    :value="logMsg"
                  >
                    {{ getLogItemTitle(targetLogData, logMsg as LogMsg) }}
                  </el-radio-button>
                </el-radio-group>
                <p class="log-item-title" v-else>
                  {{ getLogItemTitle(targetLogData, getSelectedBlock(logTarget)) }}
                </p>
                <!-- <span class="log-time">
                  {{ dateFormat(targetLogData.info[getSelectedBlock(logTarget)].time) }}
                </span> -->
              </div>
              <div class="info-content">
                <CodeView :code="getTargetLogContentCode(logTarget)" />
              </div>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <div class="empty-placeholder" v-if="!Object.keys(logData).length">
      <div class="img-container">
        <img
          class="img-placeholder"
          width="520"
          src="@/assets/img/log-placeholder.png"
          alt="empty_placeholder"
        />
        <p class="tip">{{ emptyPlaceholderTip }}</p>
      </div>
      <div class="btn-wrap">
        <el-button
          v-if="!isTestStarted"
          type="primary"
          plain
          :icon="CaretRight"
          :disabled="!savedAfterDataChange"
          @click="startTest"
        >
          {{ tl('startTest') }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { dateFormat, getTypeAndNameFromKey } from '@/common/tools'
import { LogResult } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import {
  CaretRight,
  CircleCheckFilled,
  CircleCloseFilled,
  Loading,
  WarningFilled,
} from '@element-plus/icons-vue'

const props = defineProps<{
  logData: FormattedLog
  isTestStarted: boolean
}>()
const emit = defineEmits(['input-simulated-data', 'start-test'])

const { t, tl } = useI18nTl('RuleEngine')

const emptyPlaceholderTip = computed(() => {
  if (!savedAfterDataChange.value) {
    return tl('pleaseSaveFirst')
  }
  if (!props.isTestStarted) {
    return tl('noLogDataTip')
  }
  return tl('tipForTesting')
})

const { getGeneralTypeLabel } = useBridgeTypeValue()
const { getEventList } = useRuleEvents()
const { savedAfterDataChange } = useStatusController()

let eventInfoMap: Map<string, RuleEvent> = new Map()
const reg = /^\$events\/([^._]+)_/
const convertToLogEvent = (e: string) => e.replace(reg, (a1: string, a2: string) => `${a2}.`)

;(async () => {
  const eventList = await getEventList()
  eventInfoMap = eventList.reduce((map, item) => {
    const key = convertToLogEvent(item.event)
    map.set(key, item)
    return map
  }, new Map())
})()

const isBridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
const { getEventLabel } = useRuleSourceEvents()
const getTriggerTitle = (trigger: string) => {
  if (isBridgeReg.test(trigger)) {
    const bridgeId = trigger.replace(isBridgeReg, '')
    const { type } = getTypeAndNameFromKey(bridgeId) as any
    return getGeneralTypeLabel(type)
  }
  const event = eventInfoMap.get(trigger)
  return event ? getEventLabel(event.title) : trigger
}

const targetTypeMap = new Map([
  [LogTargetType.Rule, tl('ruleExec')],
  [LogTargetType.Console, tl('consoleOutput')],
  [LogTargetType.Republish, tl('republish')],
])
const getLogTargetTitle = ({ type: targetType, target }: TargetLog) => {
  const title = targetTypeMap.get(targetType)
  if (title) {
    return title
  }
  try {
    const { type } = getTypeAndNameFromKey(target) as any
    return getGeneralTypeLabel(type)
  } catch (error) {
    return target
  }
}

const iconMap = new Map([
  [LogResult.OK, CircleCheckFilled],
  [LogResult.Pending, Loading],
  [LogResult.Error, CircleCloseFilled],
  [LogResult.NoResult, WarningFilled],
])
const getResultIcon = (result: LogResult) => iconMap.get(result)
const classMap = new Map([
  [LogResult.OK, 'icon-suc'],
  [LogResult.Pending, 'icon-pending'],
  [LogResult.Error, 'icon-fail'],
  [LogResult.NoResult, 'icon-no-result'],
])
const getResultIconClass = (result: LogResult) => classMap.get(result)

const needTabsShowInfo = (info: TargetLogInfo) =>
  info && typeof info === 'object' && Object.keys(info).length > 1

const needShowLoading = (targetLog: TargetLog) => {
  return targetLog.result === LogResult.Pending && Object.keys(targetLog.info).length === 0
}

const tabsActiveData = ref({})
const getTabsKey = (timestamp: string | number, logTarget: string | number) =>
  `${timestamp}.${logTarget}`
const getSelectedBlock = (logTarget: string | number) => {
  if (!activeExecutionTimestamp.value || !activeExecutionInfo.value) {
    return
  }
  const timestamp = activeExecutionTimestamp.value
  const infoKeys = Object.keys(activeExecutionInfo.value[logTarget].info)
  const ret = get(tabsActiveData.value, getTabsKey(timestamp, logTarget))
  if (ret) {
    return ret
  } else {
    const defaultValue = infoKeys[0]
    setSelectedBlockValue(logTarget, defaultValue)
    return defaultValue
  }
}
const getTargetLogContentCode = (logTarget: string | number) => {
  if (!activeExecutionInfo.value) {
    return
  }
  const selectedBlock = getSelectedBlock(logTarget)
  const targetLog = activeExecutionInfo.value[logTarget] || {}
  return getLogItemContent(
    targetLog,
    selectedBlock as LogMsg,
    targetLog.info[selectedBlock]?.logContent,
  )
}
const setSelectedBlockValue = (logTarget: string | number, value: string) => {
  const timestamp = activeExecutionTimestamp.value
  if (!timestamp) {
    return
  }
  set(tabsActiveData.value, getTabsKey(timestamp, logTarget), value)
}

const { getLogItemTitle, getLogItemContent } = useShowLog()

const activeExecutionTimestamp = ref<string | null>(null)
const activeExecution = computed(() => {
  if (!activeExecutionTimestamp.value) {
    return null
  }
  return props.logData[activeExecutionTimestamp.value]
})
const activeExecutionInfo = computed(() => {
  if (!activeExecution.value) {
    return null
  }
  return activeExecution.value.info
})

const selectExecution = (timestamp: string | number) => {
  activeExecutionTimestamp.value = timestamp.toString()
}

const startTest = () => {
  emit('start-test')
}

watch(
  () => (typeof props.logData === 'object' ? Object.keys(props.logData).length : 0),
  (v) => {
    if (v > 0 && !activeExecutionTimestamp.value) {
      activeExecutionTimestamp.value = Object.keys(props.logData)[0]
    } else if (v === 0 && activeExecutionTimestamp.value) {
      activeExecutionTimestamp.value = null
    }
  },
)
</script>

<style lang="scss">
@use 'sass:math';
.log-data-display {
  height: 500px;
  background-color: var(--color-bg-table-hd);
  & > .el-card__body {
    display: flex;
  }
  & > .el-card__body,
  .empty-placeholder,
  .log-data-left,
  .log-data-right,
  .log-data-right > .el-card__body {
    height: 100%;
  }
  .log-data-left,
  .log-data-right > .el-card__body {
    overflow-y: scroll;
  }
  .log-data-left {
    padding-right: 6px;
  }
  .log-data-right > .el-card__body {
    padding: 16px 24px;
  }
  .empty-placeholder {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;

    .img-container {
      position: relative;
      margin-bottom: 20px;
      .tip {
        bottom: 20px;
      }
    }
    .tip {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 340px;
    }
    .el-button {
      margin-bottom: 12px;
    }
  }

  .log-data-left {
    flex-basis: 440px;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 28px;
  }
  .log-data-right {
    flex-grow: 1;
  }
  .execution-list {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .execution-item {
    align-items: center;
    padding: 12px 20px;
    border-radius: 8px;
    background: var(--color-bg-content);
    cursor: pointer;
    border: 1px solid transparent;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    &.is-selected {
      border-color: var(--color-primary);
      box-shadow: 0px 4px 6px 0px #5e4eff33;
    }
  }
  .execution-item-base {
    p {
      margin-top: 0;
      margin-bottom: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .base-info {
      overflow: hidden;
      margin-right: 16px;
    }
    .event {
      flex-shrink: 0;
    }
  }
  .execution-item-time,
  .log-time {
    color: var(--color-text-secondary);
  }
  $time-width: 130px;
  .execution-item-time {
    width: $time-width;
    text-align: right;
    flex-shrink: 0;
  }
  .execution-item-base {
    width: calc(100% - #{$time-width} - 12px);
  }

  .el-collapse {
    border-top: none;
    border-bottom: none;
  }
  .el-collapse-item__header.is-active {
    border-bottom-color: var(--el-collapse-border-color);
  }
  .info-wrap {
    padding-top: 16px;
  }
  .target-info-hd {
    align-items: center;
    margin-bottom: 12px;
    .log-item-title {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 1.4;
    }
  }
  .icon-status {
    margin-right: 8px;
  }
  .icon-suc {
    color: var(--el-color-success);
  }
  .icon-fail {
    color: var(--el-color-danger);
  }
  .icon-no-result {
    color: var(--el-color-info);
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .icon-pending {
    animation: rotate 3s linear infinite;
  }

  .code-view {
    margin-top: 0;
    margin-bottom: 0;
  }
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
  .btn-wrap {
    position: relative;
    .el-button {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
