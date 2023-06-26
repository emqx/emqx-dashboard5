<template>
  <div class="webhook-trigger">
    <el-radio-group v-model="selectedType" class="ml-4">
      <el-radio :label="TriggerType.Messages">{{ tl('messages') }}</el-radio>
      <div class="sub-selector" v-if="selectedType === TriggerType.Messages">
        <el-checkbox-group v-model="selectedMsgEventList">
          <el-checkbox v-for="{ event, title } in msgEventOpts" :key="event" :label="event">
            {{ getEventLabel(title) }}
          </el-checkbox>
        </el-checkbox-group>
        <div class="topic-block">
          <div class="list-container">
            <label class="list-label">{{ tl('topicFilter') }}</label>
            <ul class="topic-list">
              <li class="topic-item" v-for="(topic, $index) in topicList" :key="$index">
                <el-input
                  :model-value="topicList[$index]"
                  @update:model-value="handleTopicItemChanged($event, $index)"
                />
                <el-button class="btn-del" link @click="delTopic($index)">
                  <el-icon :size="16"><Delete /></el-icon>
                </el-button>
              </li>
              <el-button link type="primary" :icon="Plus" @click="addTopic">
                {{ tl('addTopic') }}
              </el-button>
            </ul>
          </div>
        </div>
      </div>
      <el-radio :label="TriggerType.Events">{{ tl('events') }}</el-radio>
      <div class="sub-selector" v-if="selectedType === TriggerType.Events">
        <el-checkbox-group v-model="selectedOtherEventList">
          <el-checkbox v-for="{ event, title } in otherEventOpts" :key="event" :label="event">
            {{ getEventLabel(title) }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <el-radio :label="TriggerType.All">{{ tl('allMsgsAndEvents') }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { getRuleEvents as queryRuleEvents } from '@/api/ruleengine'
import {
  MULTI_LEVEL_WILDCARD,
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
} from '@/common/constants'
import { getKeywordsFromSQL } from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleEvent } from '@/types/rule'
import { Delete, Plus } from '@element-plus/icons-vue'
import { escapeRegExp, startCase } from 'lodash'
import { Ref, WritableComputedRef, computed, defineEmits, defineProps, nextTick, ref } from 'vue'
import { useStore } from 'vuex'

const enum TriggerType {
  Messages,
  Events,
  All,
}

const SELECT_FIELD = '*'

const props = defineProps({
  /**
   * rule SQL
   */
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

// To prevent infinite loops
let nowSQL = ''

const { state } = useStore()
const { tl } = useI18nTl('RuleEngine')
const { TOPIC_EVENT, transFromStrToFromArr, transSQLFormDataToSQL, isMsgPubEvent } = useRuleUtils()

const ruleInputEventReg = new RegExp(`^${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}`)
const ruleInputBridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)

const ruleEvents: Ref<Array<RuleEvent>> = ref([])

const msgEventOpts = computed(() =>
  ruleEvents.value.filter(({ event }) => event.indexOf('message') > -1),
)

const otherEventOpts = computed(() => {
  return ruleEvents.value.filter(({ event }) => event.indexOf('message') === -1)
})

const isZh = computed(() => state.lang === 'zh')
const getEventLabel = ({ zh, en }: { zh: string; en: string }) => startCase(isZh.value ? zh : en)

const updateSQL = (sql: string) => {
  if (sql !== nowSQL) {
    nowSQL = sql
    emit('update:modelValue', sql)
  }
}

const allMsgsAndEvents = computed(() => {
  return ruleEvents.value.reduce((arr: Array<string>, { event }) => {
    if (isMsgPubEvent(event)) {
      return [...arr, MULTI_LEVEL_WILDCARD]
    }
    return [...arr, event]
  }, [])
})

const SQLKeywords = computed(() => {
  let ret = getKeywordsFromSQL(props.modelValue)
  return ret
})
const fromDataArr = computed(() => {
  let { fromStr } = SQLKeywords.value
  return fromStr ? transFromStrToFromArr(SQLKeywords.value.fromStr) : []
})

const checkIsTopic = (str: string) => !ruleInputBridgeReg.test(str) && !ruleInputEventReg.test(str)

const refreshSQLForMsgEvent = (events: Array<string>, topics: Array<string>) => {
  // If the event includes events that are not msg events, we need to add `where`
  const needWhere = events.length && events.some((item) => !isMsgPubEvent(item))
  const needTopic = events.length && events.some((item) => isMsgPubEvent(item))

  const whereStr = needWhere ? topics.map((item) => `topic =~ '${item}'`).join(' or ') : undefined

  let fromArr: Array<string> = []
  if (needTopic) {
    fromArr = topics.length === 0 ? [MULTI_LEVEL_WILDCARD] : topics
  }

  const fromMsgEvents = events.filter((item) => !isMsgPubEvent(item))
  if (fromMsgEvents.length) {
    fromArr.push(...fromMsgEvents)
  }

  const sql = transSQLFormDataToSQL(SELECT_FIELD, fromArr, whereStr)
  updateSQL(sql)
}

const selectedMsgEventList = computed({
  get() {
    // is msg event
    // does not match the bridge regex and does not match the event regex -> topic
    return fromDataArr.value.reduce((arr: Array<string>, currentItem) => {
      const isMsgEvent = msgEventOpts.value.some(({ event }) => event === currentItem)
      if (isMsgEvent) {
        return Array.from(new Set([...arr, currentItem]))
      }
      const isTopic = checkIsTopic(currentItem)
      if (isTopic) {
        return Array.from(new Set([...arr, TOPIC_EVENT]))
      }
      return arr
    }, [])
  },
  set(val) {
    refreshSQLForMsgEvent(val, topicList.value)
  },
})

const selectedOtherEventList: WritableComputedRef<Array<string>> = computed({
  get() {
    // is msg event
    // does not match the bridge regex and does not match the event regex -> topic
    return fromDataArr.value.filter((item) =>
      otherEventOpts.value.some(({ event }) => event === item),
    )
  },
  set(val) {
    const { whereStr } = SQLKeywords.value
    const sql = transSQLFormDataToSQL(SELECT_FIELD, val, whereStr)
    updateSQL(sql)
  },
})

/*
  - If there is a msg pub event and no topic filtering
  Has #
  - If there is no msg pub event and no topic filtering
  No #
  - If there is a msg pub event and the topic has been filtered
  No #
  - If there is no msg pub event and the topic has been filtered
  No #
 */
const topicList = computed({
  get() {
    return fromDataArr.value.filter((item) => {
      const isTopic = checkIsTopic(item)
      return isTopic && item !== MULTI_LEVEL_WILDCARD
    })
  },
  set(val) {
    refreshSQLForMsgEvent(selectedMsgEventList.value, val)
  },
})

const addTopic = () => {
  topicList.value = [...topicList.value, '']
}
const delTopic = (index: number) => {
  topicList.value = [...topicList.value.slice(0, index), ...topicList.value.slice(index + 1)]
}
const handleTopicItemChanged = (val: string, index: number) => {
  topicList.value = [...topicList.value.slice(0, index), val, ...topicList.value.slice(index + 1)]
}

const isSelectedEvent = ref(false)
const selectedType = computed({
  get() {
    if (!fromDataArr.value.length && isSelectedEvent.value) {
      return TriggerType.Events
    }
    let msgEventNum = topicList.value.length
      ? selectedMsgEventList.value.length - 1 + topicList.value.length
      : selectedMsgEventList.value.length
    const isAllMsgEvent = msgEventNum === fromDataArr.value.length
    if (isAllMsgEvent) {
      return TriggerType.Messages
    }
    const isAllOtherEvent = selectedOtherEventList.value.length === fromDataArr.value.length
    if (isAllOtherEvent) {
      return TriggerType.Events
    }
    // TODO:Determine if an error has occurred
    return TriggerType.All
  },
  async set(val) {
    isSelectedEvent.value = false
    if (val === TriggerType.Messages) {
      selectedMsgEventList.value = []
      // Waiting for SQL processing to complete.
      await nextTick()
      topicList.value = []
    } else if (val === TriggerType.Events) {
      isSelectedEvent.value = true
      selectedOtherEventList.value = []
    } else if (val === TriggerType.All) {
      const sql = transSQLFormDataToSQL(SELECT_FIELD, allMsgsAndEvents.value)
      updateSQL(sql)
    }
  },
})

const getRuleEvents = async () => {
  try {
    const list: Array<RuleEvent> = await queryRuleEvents()
    const bridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
    ruleEvents.value = list.filter(({ event }) => !bridgeReg.test(event))
  } catch (error) {
    //
  }
}

getRuleEvents()
</script>

<style lang="scss">
.webhook-trigger {
  .sub-selector {
    padding-left: 24px;
  }
  .el-radio-group {
    display: block;
  }
  .el-radio {
    display: flex;
    &:not(:last-child) {
      margin-bottom: 8px;
      &.is-checked {
        margin-bottom: 4px;
      }
    }
  }
  .el-checkbox-group {
    margin-bottom: 8px;
  }
  .topic-block {
    padding: 16px 24px;
    margin-bottom: 16px;
    background-color: var(--color-bg-split);
  }
  .list-container {
    display: flex;
    width: 52%;
    .list-label {
      flex-grow: 0;
      font-size: 14px;
    }
  }
  .topic-list {
    flex-grow: 1;
  }
  .topic-item {
    display: flex;
    margin-bottom: 8px;
  }
  .btn-del {
    margin-left: 16px;
  }
}
</style>
