<template>
  <el-tooltip
    effect="dark"
    placement="top"
    popper-class="rule-action-details"
    :disabled="!statusData.details.length"
  >
    <span class="rule-action-status">
      <el-icon class="text-status" :class="statusData.statusClass">
        <SuccessFilled v-if="statusData.statusClass === NodeStatusClass.Success" />
        <WarningFilled v-else-if="statusData.statusClass === NodeStatusClass.Warning" />
        <CircleCloseFilled v-else-if="statusData.statusClass === NodeStatusClass.Danger" />
      </el-icon>
    </span>
    <template #content>
      <div>
        <ul class="detail-list">
          <li
            v-for="(
              { typeLabel, type, name, statusClass, statusLabel }, $index
            ) in statusData.details"
            :key="$index"
            class="detail-item"
          >
            <router-link class="space-between gap-2" :to="getRoute(type, name)" target="_blank">
              <div class="min-w-0 vertical-align-center">
                <label class="truncate min-w-0">{{ name }}</label>
                <span class="tip shrink-0">({{ typeLabel }})</span>
              </div>
              <span class="text-status" :class="statusClass">{{ statusLabel }}</span>
            </router-link>
          </li>
          <li
            v-for="({ typeLabel, statusClass, statusLabel }, $index) in notActionOutputArr"
            :key="$index"
            class="detail-item space-between"
          >
            <div>
              <label>{{ typeLabel }}</label>
            </div>
            <span class="text-status" :class="statusClass">{{ statusLabel }}</span>
          </li>
        </ul>
      </div>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import { BridgeType, ConnectionStatus, NodeStatusClass, RuleOutput } from '@/types/enum'
import { RuleItem } from '@/types/rule'
import { CircleCloseFilled, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'

type NotActionOutputItem = {
  typeLabel: string
  statusClass: NodeStatusClass
  statusLabel: string
}

const props = defineProps<{
  rule: RuleItem
}>()
const { tl, t } = useI18nTl('RuleEngine')

const { getStatusClass, getTheWorstStatus } = useCommonConnectionStatus()
const { getActionStatusLabel } = useActionAndSourceStatus()
const { getGeneralTypeLabel } = useBridgeTypeValue()

const { judgeOutputType } = useRuleOutputs()

const getNotActionOutputArr = ({ actions }: RuleItem) => {
  return actions.reduce((arr: NotActionOutputItem[], item) => {
    const type = judgeOutputType(item)
    if (type !== RuleOutput.DataBridge) {
      const typeLabel =
        type === RuleOutput.Console
          ? tl('consoleOutput')
          : type === RuleOutput.Republish
            ? tl('republish')
            : ''
      arr.push({
        typeLabel,
        statusClass: NodeStatusClass.Success,
        statusLabel: tl('noStatus'),
      })
    }

    return arr
  }, [])
}

const getRuleActionStatusData = ({ action_details }: RuleItem) => {
  if (!action_details) {
    return { statusClass: NodeStatusClass.Success, details: [] }
  }
  const statusArr = action_details.map(({ status }) => status) as Array<ConnectionStatus>
  const worstStatus = getTheWorstStatus(statusArr)
  const statusClass = getStatusClass(worstStatus)
  const statusLabel = getActionStatusLabel(worstStatus)
  return {
    statusClass,
    statusLabel,
    details: action_details.map(({ name, status, type }) => {
      return {
        name,
        type,
        typeLabel: getGeneralTypeLabel(type as BridgeType),
        statusClass: getStatusClass(status as ConnectionStatus),
        statusLabel: getActionStatusLabel(status as ConnectionStatus),
      }
    }),
  }
}

const statusData = computed(() => getRuleActionStatusData(props.rule))
const notActionOutputArr = computed(() => getNotActionOutputArr(props.rule))

const getRoute = (type?: string, name?: string) => {
  if (!type || !name) {
    return {}
  }
  return {
    name: `action-detail`,
    params: { id: getBridgeKey({ type, name }) },
    query: { tab: 'settings' },
  }
}
</script>

<style lang="scss">
.rule-action-status {
  line-height: 1;
  margin-left: 4px;
  .el-icon {
    font-size: 16px;
    cursor: pointer;
  }
}
.rule-action-details {
  .detail-list {
    padding: 4px 0;
    margin: 0;
    list-style: none;
    width: 280px;
  }
  .tip {
    margin-left: 2px;
  }
  .detail-item:not(:last-child) {
    margin-bottom: 4px;
  }
  a {
    color: unset;
  }
}
</style>
