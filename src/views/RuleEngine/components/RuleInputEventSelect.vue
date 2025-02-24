<template>
  <el-select v-model="selected">
    <el-option
      v-for="item in eventOptList"
      :key="item.event"
      :value="item.event"
      :label="startCase(getEventLabel(item.title))"
      :disabled="isEventItemDisabled(item.event)"
    />
  </el-select>
</template>

<script setup lang="ts">
import { RuleEvent } from '@/types/rule'

type EventOpt = Pick<RuleEvent, 'description' | 'event' | 'sql_example' | 'title'>

const props = defineProps<{
  modelValue: string
  isEventDisabled?: (event: string) => boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selected = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const eventOptList: Ref<Array<EventOpt>> = ref([])
const { getEventList } = useRuleEvents()
const { eventDoNotNeedShow, isMsgPubEvent, getEventLabel } = useRuleSourceEvents()
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
getEventOpt()

const isEventItemDisabled = (event: string) => {
  if (!props.isEventDisabled || !isFunction(props.isEventDisabled)) {
    return false
  }
  return props.isEventDisabled(event) && event !== props.modelValue
}
</script>
