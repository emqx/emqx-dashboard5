<template>
  <el-collapse class="log-data-display">
    <el-card class="card-execution-item" v-for="(item, timestamp) in logData" :key="timestamp">
      <el-collapse-item :name="timestamp" class="execution-item">
        <template #title>
          <div class="space-between">
            <div class="execution-item-base vertical-align-center">
              <el-icon class="icon-status" :size="16">
                <component
                  :is="getResultIcon(item.result)"
                  :class="getResultIconClass(item.result)"
                />
              </el-icon>
              <p>{{ getTriggerTitle(item.trigger.event || '') }}</p>
              <p v-if="item.trigger.topic">{{ t('Base.topic') }}: {{ item.trigger.topic }}</p>
            </div>
            <div class="execution-item-time">
              {{ dateFormat(Number(timestamp)) }}
            </div>
          </div>
        </template>
        <el-collapse class="execution-log-content">
          <el-collapse-item
            v-for="(targetLogData, logTarget) in item.info"
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
              <el-tabs
                v-if="needTabsShowInfo(targetLogData.info)"
                class="info-tabs"
                :modelValue="
                  getTabsModelValue(timestamp, logTarget, Object.keys(targetLogData.info))
                "
                @update:modelValue="setTabsModelValue(timestamp, logTarget, $event)"
              >
                <el-tab-pane
                  v-for="(logItem, logMsg) in targetLogData.info"
                  :key="logMsg"
                  :label="getLogItemTitle(targetLogData, logMsg as LogMsg)"
                  :name="logMsg"
                >
                  <span class="log-time">{{ dateFormat(logItem.time) }}</span>
                  <CodeView
                    :code="getLogItemContent(targetLogData, logMsg as LogMsg, logItem.logContent)"
                  />
                </el-tab-pane>
              </el-tabs>
              <template v-else>
                <template v-for="(logItem, logMsg) in targetLogData.info" :key="logMsg">
                  <div class="log-item-hd space-between">
                    <p>{{ getLogItemTitle(targetLogData, logMsg as LogMsg) }}</p>
                    <span class="log-time">{{ dateFormat(logItem.time) }}</span>
                  </div>
                  <CodeView
                    :code="getLogItemContent(targetLogData, logMsg as LogMsg, logItem.logContent)"
                  />
                </template>
              </template>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-card>
  </el-collapse>
</template>

<script setup lang="ts">
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { dateFormat, getTypeAndNameFromKey } from '@/common/tools'
import CodeView from '@/components/CodeView.vue'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import type { FormattedLog, TargetLog, TargetLogInfo } from '@/hooks/Rule/rule/useFormatDebugLog'
import { LogTargetType, useShowLog, LogMsg } from '@/hooks/Rule/rule/useFormatDebugLog'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { LogResult } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Loading,
  WarningFilled,
} from '@element-plus/icons-vue'
import { escapeRegExp, get, set } from 'lodash'
import { defineProps, ref } from 'vue'

defineProps<{
  logData: FormattedLog
}>()

const { t, tl } = useI18nTl('RuleEngine')

const { getGeneralTypeLabel } = useBridgeTypeValue()
const { getEventList } = useRuleEvents()

let eventInfoMap: Map<string, RuleEvent> = new Map()
const reg = /^\$events\/(\w+)_/
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

const tabsActiveData = ref({})
const getTabsKey = (timestamp: string | number, logTarget: string | number) =>
  `${timestamp}.${logTarget}`
const getTabsModelValue = (
  timestamp: string | number,
  logTarget: string | number,
  infoKeys: Array<string>,
) => {
  const ret = get(tabsActiveData.value, getTabsKey(timestamp, logTarget))
  if (ret) {
    return ret
  } else {
    const defaultValue = infoKeys[0]
    setTabsModelValue(timestamp, logTarget, defaultValue)
    return defaultValue
  }
}
const setTabsModelValue = (
  timestamp: string | number,
  logTarget: string | number,
  value: string,
) => {
  set(tabsActiveData, getTabsKey(timestamp, logTarget), value)
}

const { getLogItemTitle, getLogItemContent } = useShowLog()
</script>

<style lang="scss">
@use 'sass:math';

.log-data-display {
  border-top: none;
  border-bottom: none;
  .card-execution-item {
    .el-card__body {
      padding: 0 12px;
    }
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  .el-collapse-item__header {
    .space-between {
      flex-grow: 1;
      padding-right: 20px;
    }
  }
  .execution-item-base {
    p {
      margin-top: 0;
      margin-bottom: 0;
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
  .execution-log-content {
    padding: 8px 16px;
    border-bottom: none;
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

  .info-wrap {
    position: relative;
    border-radius: 10px;
    .el-tabs .el-tabs__header {
      padding: 0;
    }
    $line-height: 40px;
    $tab-height: 40px;
    .log-item-hd p,
    .log-time {
      height: $line-height;
      line-height: $line-height;
      margin-top: 0;
      margin-bottom: 0;
    }

    .info-tabs {
      .log-time {
        position: absolute;
        right: 0;
        // 24 is tab header margin bottom
        top: -24px - $tab-height + math.div($tab-height -$line-height, 2);
      }
    }
  }

  .el-tabs__item {
    padding: 0 12px;
  }
  .el-tabs.el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top::before,
  .el-tabs.el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top::after {
    width: 12px;
  }
  .code-view {
    margin-top: 0;
  }
}
</style>
