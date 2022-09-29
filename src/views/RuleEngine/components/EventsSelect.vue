<template>
  <el-collapse class="events-select collapse-border">
    <el-collapse-item v-for="item in eventOptList" :key="item.event" :name="item.event">
      <template #title>
        <div class="custom-collapse-item-hd">
          <div class="event-name-container">
            <p>{{ capitalize(getTargetText(item.title)) }}</p>
            <span class="event-name">{{ item.event }}</span>
          </div>
          <el-button
            class="btn-use"
            type="primary"
            plain
            size="small"
            text
            @click.prevent="useEvent(item.event)"
          >
            {{ tl('useEvent') }}
          </el-button>
        </div>
      </template>
      <div class="collapse-item-bd">
        <div class="event-desc-bar">
          <p class="event-desc">{{ capitalize(getTargetText(item.description)) }}</p>
          <a :href="getEventDocLink(item.event)" target="_blank">{{ t('Base.documentation') }}</a>
        </div>
        <div>
          <label>{{ tl('sqlExample') }}</label>
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
        <div class="event-desc-bar">
          <p class="event-desc">{{ tl('bridgeForInputDesc') }}</p>
          <a :href="docMap.bridgeAsFrom" target="_blank">
            {{ t('Base.documentation') }}
          </a>
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
              plain
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
</template>

<script setup lang="ts">
import { formatSQL } from '@/common/tools'
import CodeView from '@/components/CodeView.vue'
import useCopy from '@/hooks/useCopy'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleEvent } from '@/types/rule'
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { capitalize } from 'lodash'
import { computed, defineProps, PropType, defineEmits } from 'vue'
import { useStore } from 'vuex'

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

const eventDoNotNeedShow = ['$events/message_publish', '$bridges/mqtt:*']
const eventOptList = computed(() =>
  props.eventList.filter(({ event }) => !eventDoNotNeedShow.includes(event)),
)

const getTargetText = ({ zh, en }: { zh: string; en: string }) => (isZh.value ? zh : en)

const zhHookMap: Record<string, string> = {
  '$events/message_delivered': '消息投递事件',
  '$events/message_acked': '消息确认事件',
  '$events/message_dropped': '消息在转发的过程中被丢弃事件',
  '$events/client_connected': '终端连接成功事件',
  '$events/client_disconnected': '终端连接断开事件',
  '$events/client_connack': '连接确认事件',
  '$events/client_check_authz_complete': '鉴权完成事件',
  '$events/session_subscribed': '终端订阅成功事件',
  '$events/session_unsubscribed': '取消终端订阅成功事件',
  '$events/delivery_dropped': '消息在投递的过程中被丢弃事件',
}
const getEventDocLink = (event: string) => {
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
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    margin-right: 8px;
    line-height: 1;
    font-weight: normal;
  }
  .btn-use {
    margin-left: 12px;
    font-weight: normal;
  }
  .el-button.is-text:not(.is-disabled):hover,
  .el-button.is-text:not(.is-disabled):focus,
  .el-button.el-button--primary.is-plain {
    box-shadow: none;
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
    }
  }
  .event-desc {
    color: var(--color-text-secondary);
  }
  .event-desc-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    .btn-use {
      margin-right: -10px;
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
