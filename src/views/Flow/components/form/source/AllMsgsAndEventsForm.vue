<template>
  <div class="all-msgs-and-events-form">
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { MULTI_LEVEL_WILDCARD } from '@/common/constants'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'
import { EventForRule } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import { computed, ref } from 'vue'

const { getEventList } = useRuleEvents()
const { allMsgsAndEvents } = useRuleUtils()
const { getEventLabel } = useRuleSourceEvents()

const eventList = ref<Array<RuleEvent>>([])
;(async () => (eventList.value = await getEventList()))()
const list = computed(() => {
  return allMsgsAndEvents.value.map((item) => {
    const eventValue = item === MULTI_LEVEL_WILDCARD ? EventForRule.MessagePublish : item
    const targetEvent = eventList.value.find(({ event }) => event === eventValue)
    return targetEvent ? getEventLabel(targetEvent.title) : ''
  })
})
</script>

<style lang="scss">
.all-msgs-and-events-form {
  ul {
    list-style: none;
    padding-left: 8px;
  }
  li {
    padding: 8px;
  }
}
</style>
