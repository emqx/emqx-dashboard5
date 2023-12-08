<template>
  <el-select class="action-select" popper-class="action-opt-popper" v-model="selected">
    <el-option :value="newActionValue" :label="tl('createAction')" />
    <el-option
      v-for="{ name, id, status } in actionOpts"
      :key="id"
      :value="id"
      :label="name"
      :disabled="isItemDisabled(id)"
    >
      <div class="action-opt-item space-between">
        <p class="action-name">{{ name }}</p>
        <div class="action-status vertical-align-center">
          <i class="node-status-dot" :class="`is-${getStatusClass(status)}`"></i>
          <span class="text-status" :class="getStatusClass(status)">
            {{ getStatusLabel(status) }}
          </span>
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import useMixedActionList from '@/hooks/Rule/action/useMixedActionList'
import useBridgeTypeValue, { useBridgeDirection } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { computed, defineEmits, defineProps, ref, withDefaults } from 'vue'

const newActionValue = createRandomString()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    type: string
    /**
     * for disabled added item
     */
    disableList: Array<string>
    direction?: BridgeDirection
  }>(),
  {
    direction: BridgeDirection.Egress,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selected = computed({
  get() {
    if (!props.modelValue) {
      return newActionValue
    }
    return props.modelValue || ''
  },
  set(val) {
    if (val === newActionValue) {
      emit('update:modelValue', '')
    } else {
      emit('update:modelValue', val)
    }
  },
})

const totalActionList = ref<Array<BridgeItem>>([])
const { getMixedActionListForRule } = useMixedActionList()
const getTotalList = async () => {
  try {
    totalActionList.value = await getMixedActionListForRule()
  } catch (error) {
    //
  }
}
getTotalList()

const isItemDisabled = (value: string) => {
  if (!props.disableList) {
    return false
  }
  return props.disableList.includes(value) && value !== props.modelValue
}

const { getBridgeGeneralType } = useBridgeTypeValue()
const { judgeBridgeDirection } = useBridgeDirection()
const actionOpts = computed(() => {
  if (!props.type) {
    return []
  }
  return totalActionList.value.filter((item) => {
    const direction = judgeBridgeDirection(item)
    return (
      getBridgeGeneralType(item.type) === props.type &&
      (direction === props.direction || direction === BridgeDirection.Both)
    )
  })
})

const { tl } = useI18nTl('RuleEngine')

const { getStatusLabel, getStatusClass } = useCommonConnectionStatus()
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
