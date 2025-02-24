<template>
  <el-select
    class="action-select"
    popper-class="action-opt-popper"
    v-model="selected"
    @change="handleSelectedChange"
  >
    <el-option :value="newTargetValue" :label="newTargetLabel" />
    <el-option
      v-for="action in actionOpts"
      :key="action.id"
      :value="action.id"
      :label="action.name"
      :disabled="isItemDisabled(action)"
    >
      <div class="action-opt-item space-between">
        <p class="action-name">{{ action.name }}</p>
        <div class="action-status vertical-align-center">
          <i class="node-status-dot" :class="`is-${getStatusClass(action.status)}`"></i>
          <span class="text-status" :class="getStatusClass(action.status)">
            {{ getStatusLabel(action.status) }}
          </span>
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { BridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

/**
 * do not selecting exiting one, create a new one
 */
const newTargetValue = createRandomString()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    type: string
    /**
     * for disabled added item
     */
    disableList?: Array<string>
    direction?: BridgeDirection
    /**
     * Actions related to webhook are not
     * allowed to be used elsewhere by default.
     */
    webhookActionDisabled?: boolean
  }>(),
  {
    direction: BridgeDirection.Egress,
    webhookActionDisabled: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value?: BridgeItem): void
}>()

const selected = computed({
  get() {
    if (!props.modelValue) {
      return newTargetValue
    }
    return props.modelValue || ''
  },
  set(val) {
    if (val === newTargetValue) {
      emit('update:modelValue', '')
    } else {
      emit('update:modelValue', val)
    }
  },
})

const totalList = ref<Array<BridgeItem>>([])
const { getActionList } = useActionList()
const { getSourceList } = useSourceList()
const getTotalList = async () => {
  try {
    if (props.direction === BridgeDirection.Ingress) {
      totalList.value = await getSourceList()
    } else {
      totalList.value = await getActionList()
    }
  } catch (error) {
    //
  }
}
getTotalList()

const { judgeIsWebhookAction } = useWebhookUtils()
const isItemDisabled = (action: BridgeItem) => {
  if (!props.disableList && !props.webhookActionDisabled) {
    return false
  }
  const { id } = action
  let ret = false
  if (props.webhookActionDisabled) {
    ret = judgeIsWebhookAction(action)
  }
  if (props.disableList) {
    ret = ret || (props.disableList.includes(id) && id !== props.modelValue)
  }
  return ret
}

const { getBridgeGeneralType } = useBridgeTypeValue()
const actionOpts = computed(() => {
  if (!props.type) {
    return []
  }
  return totalList.value.filter((item) => {
    return getBridgeGeneralType(item.type) === props.type
  })
})

const { tl } = useI18nTl('RuleEngine')

const newTargetLabel = computed(() =>
  props.direction === BridgeDirection.Egress ? tl('createAction') : tl('createSource'),
)

const { getStatusLabel, getStatusClass } = useCommonConnectionStatus()

const handleSelectedChange = (id: string) => {
  if (!id) {
    return
  }
  if (id === newTargetValue) {
    emit('change')
    return
  }
  const action = actionOpts.value.find((item) => item.id === id)
  if (action) {
    emit('change', action)
  }
}
</script>

<style lang="scss">
.action-opt-popper {
  p {
    margin: 0;
  }
  .node-status-dot {
    margin-right: 4px;
  }
}
</style>
