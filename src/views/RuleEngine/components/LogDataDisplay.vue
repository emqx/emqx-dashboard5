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
            <CodeView :code="stringifyObjSafely(targetLogData.info, 2)" />
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
import type { FormattedLog, TargetLog } from '@/hooks/Rule/rule/useFormatDebugLog'
import { LogTargetType } from '@/hooks/Rule/rule/useFormatDebugLog'
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
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import { escapeRegExp } from 'lodash'
import { defineProps } from 'vue'

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
</script>

<style lang="scss">
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
}
</style>
