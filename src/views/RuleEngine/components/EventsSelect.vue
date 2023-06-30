<template>
  <div class="events-select">
    <p class="sub-block-desc">{{ tl('eventsDesc') }}</p>
    <el-collapse class="events-select collapse-border">
      <el-collapse-item v-for="item in eventOptList" :key="item.event" :name="item.event">
        <template #title>
          <div class="custom-collapse-item-hd">
            <div class="event-name-container">
              <p>{{ capitalize(getEventLabel(item.title)) }}</p>
              <span class="event-name">{{ getEventForShow(item.event) }}</span>
            </div>
          </div>
        </template>
        <div class="collapse-item-bd">
          <p class="event-desc">{{ getEventDesc(item.event) }}</p>
          <div>
            <div class="space-between">
              <label>{{ tl('sqlExample') }}</label>
              <div>
                <el-button class="btn-doc" plain size="small">
                  <a :href="getEventDocLink(item.event)" target="_blank">
                    {{ t('Base.documentation') }}
                  </a>
                </el-button>
                <el-button
                  v-if="!isMsgPubEvent(item.event)"
                  class="btn-use"
                  type="primary"
                  size="small"
                  text
                  @click.prevent="useEvent(item.event)"
                >
                  {{ tl('useEvent') }}
                </el-button>
              </div>
            </div>
            <div class="code-container">
              <CodeView :code="formatSQL(item.sql_example)" lang="sql" />
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="bridges" :title="tl('dataBridge')">
        <template #title>
          <div class="custom-collapse-item-hd">
            <p>{{ tl('dataBridge') }}</p>
          </div>
        </template>
        <div class="collapse-item-bd">
          <div class="space-between">
            <p class="event-desc">{{ tl('bridgeForInputDesc') }}</p>
            <el-button class="btn-doc" plain size="small">
              <a :href="docMap.bridgeAsFrom" target="_blank">
                {{ t('Base.documentation') }}
              </a>
            </el-button>
          </div>
          <ul class="bridge-list">
            <li class="bridge-item" v-for="item in ingressBridgeList" :key="item.idForRuleFrom">
              <div class="bridge-item-hd">
                <p>{{ item.name }}</p>
                <p class="id">{{ item.idForRuleFrom }}</p>
              </div>
              <el-button
                class="btn-use"
                type="primary"
                size="small"
                text
                @click.prevent="useEvent(item.idForRuleFrom)"
              >
                {{ tl('useBridge') }}
              </el-button>
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { formatSQL } from '@/common/tools'
import CodeView from '@/components/CodeView.vue'
import useRuleSourceEvents from '@/hooks/Rule/rule/useRuleSourceEvents'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { capitalize } from 'lodash'
import { computed, defineEmits, defineProps, PropType } from 'vue'

const props = defineProps({
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    default: () => [],
  },
})

const emit = defineEmits(['use-event'])

const { tl, t } = useI18nTl('RuleEngine')
const { docMap } = useDocLink()

const { eventDoNotNeedShow, getEventLabel, getEventDesc, getEventDocLink } = useRuleSourceEvents()
const eventOptList = computed(() =>
  props.eventList.filter(({ event }) => !eventDoNotNeedShow.includes(event)),
)

const { isMsgPubEvent, getEventForShow } = useRuleUtils()

const useEvent = (event: string) => {
  emit('use-event', event)
}
</script>

<style lang="scss">
.events-select {
  p {
    margin: 0;
  }

  .custom-collapse-item-hd {
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-right: 8px;
    line-height: 1;
    font-weight: normal;
  }
  .el-button {
    font-weight: normal;
  }
  a {
    color: unset;
    transition: none;
  }
  .btn-use {
    margin-left: 12px;
  }
  .event-name-container {
    display: flex;
    align-items: center;
  }
  .event-name {
    margin-left: 8px;
    color: var(--color-text-secondary);
    font-weight: normal;
    opacity: 0.8;
  }
  .el-collapse-item {
    .el-collapse-item__header {
      padding-right: 8px;
    }
    .el-collapse-item__content {
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: var(--color-bg-split);
    }
  }
  .event-desc {
    color: var(--color-text-secondary);
    margin-bottom: 16px;
  }
  .code-container {
    position: relative;
  }
  .icon-copy {
    position: absolute;
    top: 8px;
    right: 8px;
    color: white;
    cursor: pointer;
  }
  .btn-doc {
    padding: 0;
    a {
      display: block;
      padding: 4px 9px;
    }
  }
  .bridge-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
  }
  .bridge-item {
    display: flex;
    align-items: center;
  }
  .bridge-item {
    padding: 8px 0;
    justify-content: space-between;
    &:not(:last-child) {
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .bridge-item-hd {
    min-width: calc(100% - 120px);
    p {
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .id {
      color: var(--color-text-secondary);
      opacity: 0.8;
    }
  }
}
</style>
