<template>
  <el-select
    ref="selectCom"
    class="from-select"
    v-model="selected"
    filterable
    @keyup.enter="handleTopicInput"
    @blur="handleTopicInput"
    @change="handleSelectedChanged"
    :class="{ 'is-mini': forTest }"
    :popper-class="`from-select-popper ${isInputTopic ? 'is-hidden' : ''}`"
    :filter-method="filterMethod"
  >
    <el-option-group :key="EMPTY_TOPIC_VALUE" :label="tl('customTopic')" v-if="!forTest">
      <el-option
        :key="topicOptionValue"
        :label="topicOptionLabel"
        :value="topicOptionValue"
        @click="inputTopic"
      >
        {{ tl('customTopic') }}
      </el-option>
    </el-option-group>
    <el-option-group
      v-if="eventOptions && eventOptions.length"
      :key="tl('clientEvent')"
      :label="tl('clientEvent')"
    >
      <el-option
        v-for="item in eventOptions"
        :key="item.event"
        :value="item.event"
        :label="item.title[locale]"
        @click="clickEvent"
      >
        <div class="option-content">
          <p>{{ item.title[locale] }}</p>
          <span class="item-id">{{ item.event }}</span>
        </div>
      </el-option>
    </el-option-group>
    <el-option-group
      v-if="bridgeOptions && bridgeOptions.length"
      :key="tl('dataBridge')"
      :label="tl('dataBridge')"
    >
      <el-option
        v-for="item in bridgeOptions"
        :key="item.idForRuleFrom"
        :value="item.idForRuleFrom"
        :label="item.name"
        @click="clickBridge"
      >
        <div class="option-content">
          <p>{{ item.name }}</p>
          <span class="item-id">{{ item.idForRuleFrom }}</span>
        </div>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FromSelect',
})
</script>

<script setup lang="ts">
import { computed, defineProps, nextTick, PropType, Ref, ref, defineEmits, watch } from 'vue'
import { RuleEvent, BridgeItem } from '@/types/rule'
import { useI18n } from 'vue-i18n'
import { BackendI18n } from '@/types/common'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleInputType } from '@/types/enum'
import { createRandomString } from '@/common/tools'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
  },
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
  },
  /**
   * hide custom topic when it is true and has special style
   */
  forTest: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'change'])

const locale: Ref<keyof BackendI18n> = useI18n().locale as Ref<keyof BackendI18n>
const { tl } = useI18nTl('RuleEngine')

const selectCom = ref()
const isTopic = ref(false)
const EMPTY_TOPIC_VALUE = createRandomString()

const selected = computed({
  get() {
    return selectedValueForProxyTopic.value === EMPTY_TOPIC_VALUE
      ? tl('customTopic')
      : props.modelValue
  },
  set(val) {
    if (val === EMPTY_TOPIC_VALUE) {
      emit('update:modelValue', '')
      selectedValueForProxyTopic.value = EMPTY_TOPIC_VALUE
      return
    }
    selectedValueForProxyTopic.value = ''
    emit('update:modelValue', val)
  },
})

const filterStr = ref('')

const bridgeEventReg = /^\$bridges\//
const eventOptions = computed(() =>
  props.eventList
    ?.filter(({ event }) => !bridgeEventReg.test(event))
    .filter(
      ({ title, event }) =>
        title[locale.value].indexOf(filterStr.value) > -1 ||
        event.lastIndexOf(filterStr.value) > -1,
    ),
)

const bridgeOptions = computed(() =>
  props.ingressBridgeList?.filter(
    ({ name, idForRuleFrom }) =>
      name.indexOf(filterStr.value) > -1 || idForRuleFrom.lastIndexOf(filterStr.value) > -1,
  ),
)

let selectedValueForProxyTopic = ref('')

const topicOptionValue = computed(() => {
  if (isTopic.value) {
    return selected.value
  }
  return EMPTY_TOPIC_VALUE
})

const topicOptionLabel = computed(() => {
  if (isTopic.value) {
    return selected.value
  }
  return tl('customTopic')
})

const isInputTopic = ref(false)
const selectedInputType = ref(RuleInputType.Topic)

watch(
  () => props.modelValue,
  (val) => {
    if (selectedValueForProxyTopic.value !== EMPTY_TOPIC_VALUE) {
      setSelected()
    }
  },
)

watch(
  () => props.ingressBridgeList,
  () => {
    setSelected()
  },
)

watch(
  () => props.eventList,
  () => {
    setSelected()
  },
)

const filterMethod = (val: string) => {
  filterStr.value = val
}

const inputTopic = async () => {
  await nextTick()
  isInputTopic.value = true
  selectCom.value.blur()
  await nextTick()
  selectCom.value.focus()
}

const handleTopicInput = async () => {
  await nextTick()
  if (selectedValueForProxyTopic.value === EMPTY_TOPIC_VALUE && isInputTopic.value) {
    const { value } = selectCom.value.$el.querySelector('input')
    selected.value = value
    selectCom.value.blur()
    isTopic.value = true
    emit('change', { value, type: RuleInputType.Topic })
    window.setTimeout(() => {
      isInputTopic.value = false
    }, 100)
    filterStr.value = ''
  }
}

const handleSelectedChanged = (val: string) => {
  if (val === topicOptionValue.value) {
    return
  }
  emit('change', { value: val, type: selectedInputType.value })
}

const clickEvent = () => {
  isTopic.value = false
  selectedInputType.value = RuleInputType.Event
}

const clickBridge = () => {
  isTopic.value = false
  selectedInputType.value = RuleInputType.Bridge
}

const setSelected = () => {
  const { ingressBridgeList, eventList, modelValue } = props
  isTopic.value = false
  if (!modelValue) {
    return
  }
  if (ingressBridgeList?.some(({ idForRuleFrom }) => idForRuleFrom === modelValue)) {
    selectedInputType.value = RuleInputType.Bridge
    return
  }
  if (eventList?.some(({ event }) => event === modelValue)) {
    selectedInputType.value = RuleInputType.Event
    return
  }
  isTopic.value = true
}

setSelected()
</script>

<style lang="scss" scoped>
.from-select {
  width: 100%;
}
.option-content {
  display: flex;
  justify-content: space-between;
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
}
.item-id {
  color: var(--el-text-color-secondary);
}
.is-mini {
  :deep(.el-input.is-focus .el-input__inner),
  :deep(.el-input .el-input__inner) {
    border-color: transparent;
  }
}
</style>

<style lang="scss">
.from-select-popper.is-hidden {
  visibility: hidden;
}
</style>
