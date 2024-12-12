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
          <div class="block-gray" v-if="topicList.length > 0">
            <div class="list-container">
              <label class="list-label">{{ tl('topicFilter') }}</label>
              <div class="list-wrap">
                <ul class="topic-list">
                  <li class="topic-item" v-for="(topic, $index) in topicList" :key="$index">
                    <el-form-item :error="topicErrorMsg[$index]">
                      <el-input
                        v-model="topicList[$index]"
                        @blur="clearErrorMsg($index), validateTopicArr()"
                        @input="handleTopicsUpdated"
                      />
                    </el-form-item>
                    <el-button class="btn-del" link @click="delTopic($index)">
                      <el-icon :size="16"><Delete /></el-icon>
                    </el-button>
                  </li>
                </ul>
                <el-button link type="primary" :icon="Plus" @click="addTopic">
                  {{ tl('addTopic') }}
                </el-button>
              </div>
            </div>
          </div>
          <el-button v-else plain type="primary" :icon="Plus" @click="addTopic">
            {{ tl('addTopic') }}
          </el-button>
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
import {
  MULTI_LEVEL_WILDCARD,
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
} from '@/common/constants'
import { arraysAreEqual, getKeyPartsFromSQL } from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { EventForRule } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import { Delete, Plus } from '@element-plus/icons-vue'
import { escapeRegExp, startCase } from 'lodash'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { computed, defineEmits, defineExpose, defineProps, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'

const enum TriggerType {
  Messages,
  Events,
  All,
}

const SELECT_FIELD = '*'

const CONDITION_PREFIX = 'topic =~ '
const CONDITION_JOINER = ' or '

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
let nowSQL = ref('')

const { state } = useStore()
const { t, tl } = useI18nTl('RuleEngine')
const {
  TOPIC_EVENT,
  allMsgsAndEvents,
  transFromStrToFromArr,
  transSQLFormDataToSQL,
  isMsgPubEvent,
} = useRuleUtils()

const ruleInputEventReg = new RegExp(`^${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}`)
const ruleInputBridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)

const ruleEvents: Ref<Array<RuleEvent>> = ref([])

const msgEventReg = /message|delivery_dropped/i
const checkIsMsgEvent = (str: string) => ruleInputEventReg.test(str) && msgEventReg.test(str)

const msgEventOpts = computed(() => ruleEvents.value.filter(({ event }) => msgEventReg.test(event)))

const otherEventOpts = computed(() => {
  return ruleEvents.value.filter(({ event }) => !msgEventReg.test(event))
})

const isZh = computed(() => state.lang === 'zh')
const getEventLabel = ({ zh, en }: { zh: string; en: string }) => startCase(isZh.value ? zh : en)

const updateSQL = (sql: string) => {
  if (sql !== nowSQL.value) {
    nowSQL.value = sql
    emit('update:modelValue', sql)
  }
}

const SQLKeywords = computed(() => getKeyPartsFromSQL(props.modelValue))
const fromDataArr = computed(() => {
  return SQLKeywords.value.fromStr !== undefined
    ? transFromStrToFromArr(SQLKeywords.value.fromStr)
    : []
})

const checkIsTopic = (str: string) => !ruleInputBridgeReg.test(str) && !ruleInputEventReg.test(str)

const refreshSQLForMsgEvent = (events: Array<string>, topics: Array<string>) => {
  // If the event includes events that are not msg events, we need to add `where`
  const needWhere = events.length && events.some((item) => !isMsgPubEvent(item))
  const needTopic = events.length && events.some((item) => isMsgPubEvent(item))
  const validTopics = topics.filter(Boolean)

  const whereStr = needWhere
    ? validTopics.map((item) => `${CONDITION_PREFIX}'${item}'`).join(CONDITION_JOINER)
    : undefined

  let fromArr: Array<string> = []
  if (needTopic) {
    fromArr = validTopics.length === 0 ? [MULTI_LEVEL_WILDCARD] : validTopics
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
    const resultSet = new Set<string>()

    // is msg event
    // does not match the bridge regex and does not match the event regex -> topic
    for (const currentItem of fromDataArr.value) {
      if (!currentItem) continue

      if (msgEventOpts.value.some(({ event }) => event === currentItem)) {
        resultSet.add(currentItem)
      } else if (checkIsTopic(currentItem)) {
        resultSet.add(TOPIC_EVENT)
      }
    }
    return [...resultSet]
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
    const sql = transSQLFormDataToSQL(SELECT_FIELD, val, '')
    updateSQL(sql)
  },
})

const topicListFromSelect: ComputedRef<Array<string>> = computed(() => {
  return fromDataArr.value.reduce((arr: Array<string>, item) => {
    const isTopic = checkIsTopic(item)
    if (isTopic && item !== MULTI_LEVEL_WILDCARD && !arr.includes(item)) {
      arr.push(item)
    }
    return arr
  }, [])
})

const conditionReg = new RegExp(`${CONDITION_PREFIX}'(.+)'`)
const topicListFromWhere: ComputedRef<Array<string>> = computed(() => {
  const { whereStr } = SQLKeywords.value
  const whereArr = whereStr?.split(CONDITION_JOINER) || []
  return whereArr.reduce((arr: Array<string>, item) => {
    const matchRet = item.match(conditionReg)
    if (matchRet && matchRet[1] && !arr.includes(matchRet[1])) {
      arr.push(matchRet[1])
    }
    return arr
  }, [])
})

/**
 * form `select` and `where`
 */
const topicListFromRule: ComputedRef<Array<string>> = computed(() => [
  ...new Set([...topicListFromSelect.value, ...topicListFromWhere.value]),
])

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
const topicList: Ref<Array<string>> = ref([])

const handleTopicsUpdated = () => {
  refreshSQLForMsgEvent(selectedMsgEventList.value, topicList.value)
}

const addTopic = async () => {
  topicList.value.push('')
  await nextTick()
  validateTopicArr()
}
const delTopic = async (index: number) => {
  topicList.value.splice(index, 1)
  await nextTick()
  validateTopicArr()
  handleTopicsUpdated()
}

const topicErrorMsg: Ref<Array<string>> = ref([])
const validateTopicArr = () => {
  topicErrorMsg.value = []
  for (let i = 0; i < topicList.value.length; i++) {
    const currentTopic = topicList.value[i]
    topicErrorMsg.value[i] = ''
    if (currentTopic) {
      for (let j = i - 1; j >= 0; j--) {
        if (topicList.value[j] && topicList.value[j] === currentTopic) {
          topicErrorMsg.value[i] = tl('repeatedTopic')
          break
        }
      }
    }
  }
  return topicErrorMsg.value.some((item) => !!item) ? Promise.reject() : Promise.resolve()
}
// check when submit
const checkTopicAllFilled = () => {
  for (let i = 0; i < topicList.value.length; i++) {
    const currentTopic = topicList.value[i]
    if (!currentTopic) {
      topicErrorMsg.value[i] = t('Rule.inputFieldRequiredError', { name: t('Base.topic') })
    }
  }
  return topicErrorMsg.value.some((item) => !!item) ? Promise.reject() : Promise.resolve()
}
// just for clear error msg
const clearErrorMsg = (index: number) => {
  if (topicList.value[index]) {
    topicErrorMsg.value[index] = ''
  }
}

const validate = () => {
  return Promise.all([validateTopicArr(), checkTopicAllFilled()])
}

const detectIsMsgEvent = () => {
  // 1. just msg pub
  if (fromDataArr.value.every(checkIsTopic) && topicListFromWhere.value.length === 0) {
    return true
  }
  // 2. just other msg event (except msg pub)
  const isAllMsgEvent = fromDataArr.value.every(
    (item) => ruleInputEventReg.test(item) && checkIsMsgEvent(item),
  )
  if (isAllMsgEvent) {
    return true
  }
  // 3. msg pub and other msg event
  const isFormDataAllTopicOrMsgEvent = fromDataArr.value.every(
    (item) => checkIsTopic(item) || checkIsMsgEvent(item),
  )
  const isTopicEqualWhere = arraysAreEqual(topicListFromSelect.value, topicListFromWhere.value)
  return isFormDataAllTopicOrMsgEvent && isTopicEqualWhere
}

const isSelectedEvent = ref(false)
const selectedType = computed({
  get() {
    if (!fromDataArr.value.length && isSelectedEvent.value) {
      return TriggerType.Events
    }
    const isMsgEvent = detectIsMsgEvent()
    if (isMsgEvent) {
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
    if (val === TriggerType.All) {
      const sql = transSQLFormDataToSQL(SELECT_FIELD, allMsgsAndEvents.value)
      updateSQL(sql)
      return
    }

    if (val === TriggerType.Messages) {
      selectedMsgEventList.value = []
      topicList.value = []
    } else if (val === TriggerType.Events) {
      isSelectedEvent.value = true
      selectedOtherEventList.value = []
    }
  },
})

const { getEventList: queryRuleEvents } = useRuleEvents()
const getRuleEvents = async () => {
  try {
    const list: Array<RuleEvent> = await queryRuleEvents()
    const bridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
    ruleEvents.value = list
      .sort(({ event }) => {
        // Unlike other places, here we put the message release at the top of the list
        if (event === EventForRule.MessagePublish) {
          return -1
        }
        return 0
      })
      .filter(({ event }) => !bridgeReg.test(event))
  } catch (error) {
    //
  }
}

const setTopicList = () => {
  topicList.value = topicListFromRule.value
}

setTopicList()

getRuleEvents()

defineExpose({ validate })

watch(
  () => props.modelValue,
  async (val) => {
    if (nowSQL.value !== val) {
      await nextTick()
      setTopicList()
    }
  },
)
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
    margin-bottom: 12px;
  }
  .topic-block {
    margin-bottom: 16px;
  }
  .block-gray {
    padding: 16px 24px;
    background-color: var(--color-bg-split);
  }
  .list-container {
    display: flex;
    width: 52%;
    .list-label {
      flex-grow: 0;
      font-size: 14px;
      margin-right: 16px;
    }
  }
  .list-wrap {
    flex-grow: 1;
  }
  .topic-list {
    padding-left: 0;
  }
  .topic-item {
    display: flex;
    margin-bottom: 12px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .btn-del {
    margin-left: 16px;
  }
}
</style>
