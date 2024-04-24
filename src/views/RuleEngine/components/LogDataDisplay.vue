<template>
  <el-collapse class="log-data-display">
    <el-card class="card-execution-item" v-for="(item, timestamp) in logData" :key="timestamp">
      <el-collapse-item :name="timestamp" class="execution-item">
        <template #title>
          <div class="space-between">
            <div class="execution-item-base vertical-align-center">
              <el-icon class="icon-status" :size="16">
                <CircleCheckFilled v-if="item.result === LogResult.OK" class="icon-suc" />
                <CircleCloseFilled v-else class="icon-fail" />
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
                <CircleCheckFilled v-if="targetLogData.result === LogResult.OK" class="icon-suc" />
                <CircleCloseFilled v-else class="icon-fail" />
              </el-icon>
              {{ getLogTargetTitle(logTarget as string) }}
            </template>
            <pre>{{ targetLogData.info }}</pre>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-card>
  </el-collapse>
</template>

<script setup lang="ts">
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { dateFormat, getTypeAndNameFromKey } from '@/common/tools'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import type { FormattedLog } from '@/hooks/Rule/rule/useFormatDebugLog'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { LogResult, RuleOutput } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { escapeRegExp } from 'lodash'
import { defineProps } from 'vue'

const props = defineProps<{
  logData: FormattedLog
  ruleId: string
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

const getLogTargetTitle = (target: string) => {
  if (target === props.ruleId) {
    return tl('ruleExec')
  }
  if (target === RuleOutput.Console) {
    return tl('consoleOutput')
  }
  try {
    const { type } = getTypeAndNameFromKey(target) as any
    if (type === RuleOutput.Republish) {
      return tl('republish')
    }
    return getGeneralTypeLabel(type)
  } catch (error) {
    return target
  }
}
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
}
</style>
