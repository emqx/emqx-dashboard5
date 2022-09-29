<template>
  <div class="events-select">
    <p class="sub-block-desc">{{ tl('eventsDesc') }}</p>
    <el-collapse class="events-select collapse-border">
      <el-collapse-item v-for="item in eventOptList" :key="item.event" :name="item.event">
        <template #title>
          <div class="custom-collapse-item-hd">
            <div class="event-name-container">
              <p>{{ capitalize(getTargetText(item.title)) }}</p>
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
              <el-icon class="icon-copy" @click="copyText(formatSQL(item.sql_example))">
                <copy-document />
              </el-icon>
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
                <span>{{ item.idForRuleFrom }}</span>
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
import useCopy from '@/hooks/useCopy'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { EventForRule } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { camelCase, capitalize } from 'lodash'
import { computed, defineEmits, defineProps, PropType } from 'vue'
import { useStore } from 'vuex'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'

const props = defineProps({
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
    required: true,
  },
  ingressBridgeList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['use-event'])

const { state } = useStore()
const { tl, t } = useI18nTl('RuleEngine')
const isZh = computed(() => state.lang === 'zh')
const { docMap } = useDocLink()

const eventDoNotNeedShow = ['$bridges/mqtt:*']
const eventOptList = computed(() =>
  props.eventList.filter(({ event }) => !eventDoNotNeedShow.includes(event)),
)

const getTargetText = ({ zh, en }: { zh: string; en: string }) => (isZh.value ? zh : en)

const { isMsgPubEvent, getEventForShow } = useRuleUtils()
const getEventDesc = (event: string) => tl(`${camelCase(event.slice(8))}Desc`)

const zhHookMap: Record<string, string> = {
  [EventForRule.MessageDelivered]: '消息投递事件',
  [EventForRule.MessageAcked]: '消息确认事件',
  [EventForRule.MessageDropped]: '消息在转发的过程中被丢弃事件',
  [EventForRule.ClientConnected]: '终端连接成功事件',
  [EventForRule.ClientDisconnected]: '终端连接断开事件',
  [EventForRule.ClientConnack]: '连接确认事件',
  [EventForRule.ClientCheckAuthzComplete]: '鉴权完成事件',
  [EventForRule.SessionSubscribed]: '终端订阅成功事件',
  [EventForRule.SessionUnsubscribed]: '取消终端订阅成功事件',
  [EventForRule.DeliveryDropped]: '消息在投递的过程中被丢弃事件',
}
const getEventDocLink = (event: string) => {
  if (isMsgPubEvent(event)) {
    return docMap.ruleEventMsgPub
  }
  let hook = event.slice(1).replace(/(\/|_)/g, '-')
  if (isZh.value) {
    hook = `${zhHookMap[event] || ''}-${hook}`
  }
  return `${docMap.ruleEvent}#${hook}`
}

const { copyText: execCopy } = useCopy()
const copyText = async (text: string) => {
  try {
    execCopy(text)
  } catch (error) {
    ElMessage.error(t('Base.opErr'))
  }
}

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
  .bridge-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
  }
  .bridge-item,
  .bridge-item-hd {
    display: flex;
  }
  .bridge-item {
    padding: 8px 0;
    justify-content: space-between;
    &:not(:last-child) {
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .bridge-item-hd {
    span {
      margin-left: 8px;
      color: var(--color-text-secondary);
      opacity: 0.8;
    }
  }
}
</style>
