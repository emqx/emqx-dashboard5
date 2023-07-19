<template>
  <el-form
    ref="FormCom"
    class="event-form"
    label-width="100px"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter="saveConfig()"
  >
    <el-form-item :label="tl('event')" prop="event">
      <el-select v-model="record.event">
        <el-option
          v-for="item in eventOptList"
          :key="item.event"
          :value="item.event"
          :label="startCase(getEventLabel(item.title))"
          :disabled="isEventDisabled(item.event)"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleEvent } from '@/types/rule'
import { pick, startCase } from 'lodash'
import { PropType, Ref, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

type EventOpt = Pick<RuleEvent, 'description' | 'event' | 'sql_example' | 'title'>

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  selectedEvents: {
    type: Array as PropType<Array<string>>,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('RuleEngine')

const FormCom = ref()

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const rules = { event: createRequiredRule(tl('event'), 'select') }

const { eventDoNotNeedShow, isMsgPubEvent, getEventLabel } = useRuleSourceEvents()
const { getEventList } = useRuleEvents()
const eventOptList: Ref<Array<EventOpt>> = ref([])

const isEventDisabled = (event: string) => {
  if (!props.selectedEvents || !props.selectedEvents.length || record.value.event === event) {
    return false
  }
  return props.selectedEvents.includes(event)
}

const saveConfig = () => {
  emit('save', record.value)
}

const getEventOpt = async () => {
  try {
    const eventList: Array<RuleEvent> = await getEventList()
    eventOptList.value = eventList.reduce((arr: Array<EventOpt>, item) => {
      if (eventDoNotNeedShow.includes(item.event) || isMsgPubEvent(item.event)) {
        return arr
      }
      return [...arr, pick(item, ['description', 'event', 'sql_example', 'title'])]
    }, [])
  } catch (error) {
    //
  }
}

const validate = () => FormCom.value.validate()

getEventOpt()

defineExpose({ validate })
</script>

<style lang="scss"></style>
