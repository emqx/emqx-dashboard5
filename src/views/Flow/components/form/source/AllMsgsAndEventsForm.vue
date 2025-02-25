<template>
  <div class="all-msgs-and-events-form">
    <p>{{ tl('webhookAllEventsAndMsgDesc') }}</p>
    <div class="list-wrap">
      <ul>
        <li v-for="item in list" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleEvent } from '@/types/rule'

const { tl } = useI18nTl('Flow')

const { getEventList } = useRuleEvents()
const { allMsgsAndEvents } = useRuleUtils()
const { getEventLabel } = useRuleSourceEvents()

const EVENT_SORT: Array<string> = [
  '$events/client_connected',
  '$events/client_disconnected',
  '$events/client_connack',
  '$events/client_check_authz_complete',
  '$events/session_subscribed',
  '$events/session_unsubscribed',
  '$events/message_dropped',
  '$events/message_delivered',
  '$events/delivery_dropped',
  '$events/message_acked',
]

const eventList = ref<Array<RuleEvent>>([])
;(async () => (eventList.value = await getEventList()))()
const sortedEventList = computed<Array<string>>(() => {
  const list = allMsgsAndEvents.value
  return list.sort((a, b) => EVENT_SORT.indexOf(a) - EVENT_SORT.indexOf(b))
})
const list = computed(() => {
  return sortedEventList.value.reduce((arr: Array<string>, item): Array<string> => {
    if (item === MULTI_LEVEL_WILDCARD) {
      return arr
    }
    const targetEvent = eventList.value.find(({ event }) => event === item)
    const current = targetEvent ? getEventLabel(targetEvent.title) : undefined
    return current ? arr.concat(current) : arr
  }, [])
})
</script>

<style lang="scss">
.all-msgs-and-events-form {
  .list-wrap {
    padding: 2px 0;
    border-radius: 8px;
    background-color: var(--color-bg-main);
  }
  ul {
    list-style: none;
    padding-left: 8px;
  }
  li {
    padding: 8px;
  }
}
</style>
