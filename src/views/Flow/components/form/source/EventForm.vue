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
    @submit.prevent
  >
    <el-form-item :label="tl('event')" prop="event">
      <RuleInputEventSelect
        v-if="!readonly"
        v-model="record.event"
        :is-event-disabled="isEventDisabled"
      />
      <p v-else class="tip value">{{ getLabelByVal(record.event) }}</p>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'

import { RuleEvent } from '@/types/rule'
import RuleInputEventSelect from '@/views/RuleEngine/components/RuleInputEventSelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  selectedEvents: {
    type: Array as PropType<Array<string>>,
  },
  readonly: {
    type: Boolean,
    default: false,
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

const { getEventLabel } = useRuleSourceEvents()
const { getEventList } = useRuleEvents()
const eventList: Ref<Array<RuleEvent>> = ref([])

const isEventDisabled = (event: string) => {
  if (!props.selectedEvents || !props.selectedEvents.length || record.value.event === event) {
    return false
  }
  return props.selectedEvents.includes(event)
}

const getLabelByVal = (val: string) => {
  const item = eventList.value.find((item) => item.event === val)
  return item ? startCase(getEventLabel(item.title)) : ''
}

const saveConfig = () => {
  emit('save', record.value)
}

const getEventOpt = async () => {
  try {
    eventList.value = await getEventList()
  } catch (error) {
    //
  }
}

const validate = () => FormCom.value.validate()

getEventOpt()

defineExpose({ validate })
</script>

<style lang="scss"></style>
