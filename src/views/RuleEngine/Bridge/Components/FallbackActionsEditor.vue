<template>
  <div class="fallback-actions-editor" :class="{ 'no-padding': !actionList.length }">
    <div class="editor-hd">
      <CreateButton
        v-if="!inRuleOutputs && !readonly"
        class="btn-add-fallback"
        link
        @click="addAction"
        size="small"
      >
        {{ tl('addFallbackAction') }}
      </CreateButton>
    </div>
    <ul class="action-list" :class="{ 'empty-readonly': !!readonly && !actionList.length }">
      <div v-if="inRuleOutputs" class="action-list-hd">
        <CreateButton class="btn-add-fallback" link @click="addAction" size="small">
          {{ tl('addFallbackAction') }}
        </CreateButton>
      </div>
      <li
        class="action-item"
        :class="{ 'in-rule-outputs': inRuleOutputs }"
        v-for="(action, index) in actionList"
        :key="getActionKey(action)"
      >
        <component
          class="space-between"
          :is="isReference(action) ? 'router-link' : 'div'"
          :to="
            isReference(action)
              ? { name: 'action-detail', params: { id: getBridgeKey(action) } }
              : undefined
          "
          target="_blank"
        >
          <el-card class="action-item-card" shadow="never">
            <div class="vertical-align-center">
              <img :src="getActionImg(action)" />
              <div class="action-item-info">
                <p v-if="isReference(action)" class="action-item-name">
                  {{ action.name }}
                </p>
                <span class="action-item-type">{{ getActionTypeLabel(action) }}</span>
              </div>
            </div>
            <div class="action-item-op" v-if="!readonly">
              <el-button size="small" @click.prevent="editAction(index)">
                {{ t('Base.edit') }}
              </el-button>
              <el-button size="small" plain @click.prevent="deleteAction(index)">
                {{ t('Base.delete') }}
              </el-button>
            </div>
          </el-card>
        </component>
      </li>
      <p class="tip" v-if="!actionList.length">{{ t('Base.none') }}</p>
    </ul>
    <RuleOutputsDrawer
      v-model="isDrawerOpen"
      is-fallback
      :edit="!!currentAction"
      :action-key="actionKey"
      :output="outputForDrawer"
      :output-disable-list="outputDisableList"
      @submit="handleActionSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { sentenceCase } from '@/common/tools'
import { useRuleFallbackActions } from '@/hooks/Rule/rule/useRule'
import { FallbackActionKind } from '@/types/enum'
import { FallbackAction, OutputItem } from '@/types/rule'
import { defineProps } from 'vue'
import RuleOutputsDrawer from '../../components/RuleOutputsDrawer.vue'

/**
 * for adapt rules output
 */
const REPUBLISH_FUNCTION = 'republish'

type FallbackActionArr = Array<FallbackAction>

const props = defineProps<{
  modelValue?: FallbackActionArr
  inRuleOutputs?: boolean
  actionKey?: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FallbackActionArr): void
}>()

const actionList = computed<FallbackActionArr>({
  get() {
    return [...(props.modelValue ?? [])]
  },
  set(value: FallbackActionArr) {
    emit('update:modelValue', value)
  },
})

const { t, tl } = useI18nTl('RuleEngine')

const isReference = (action: FallbackAction) => action.kind === FallbackActionKind.Reference
const isRepublish = (action: FallbackAction) => action.kind === FallbackActionKind.Republish

const getActionKey = (item: FallbackAction) => {
  if (isRepublish(item)) {
    return `${item.kind}:${item.args.topic}`
  }
  return `${item.kind}:${getBridgeKey(item)}`
}

const { getBridgeIconKey } = useBridgeTypeIcon()
const getActionImg = (action: FallbackAction) => {
  const imgPath = `img/${isRepublish(action) ? REPUBLISH_FUNCTION : getBridgeIconKey(action.type)}.png`
  return getImg(imgPath)
}
const { getGeneralTypeLabel } = useBridgeTypeValue()
const getActionTypeLabel = (action: FallbackAction) => {
  if (isRepublish(action)) {
    return tl('republish')
  }
  return getGeneralTypeLabel(action.type)
}

const isDrawerOpen = ref(false)
const currentEditIndex = ref<number>(-1)
const currentAction = computed<FallbackAction | null>(() => {
  return currentEditIndex.value > -1 ? actionList.value[currentEditIndex.value] : null
})
const { convertFallbackActionToRuleOutput } = useRuleFallbackActions()
const outputForDrawer = computed<OutputItem | undefined>(() => {
  if (!currentAction.value) {
    return undefined
  }
  return convertFallbackActionToRuleOutput(currentAction.value)
})
const outputDisableList = computed<Array<string>>(() => {
  return (
    actionList.value?.reduce((arr: Array<string>, action) => {
      if (isReference(action)) {
        arr.push(getBridgeKey(action))
      }
      return arr
    }, []) ?? []
  )
})
const editAction = async (index: number) => {
  currentEditIndex.value = index
  if (props.inRuleOutputs && currentAction.value && isRepublish(currentAction.value)) {
    await operationWarning(
      tl('updateActionTip', { operation: sentenceCase(tl('editFallbackRepublish')) }),
    )
  }
  isDrawerOpen.value = true
}

const { operationWarning } = useOperationConfirm()
const deleteAction = async (index: number) => {
  try {
    if (props.inRuleOutputs) {
      await operationWarning(tl('updateActionTip', { operation: tl('deleteFallback') }))
    }
    actionList.value = actionList.value.toSpliced(index, 1)
  } catch (error) {
    //
  }
}

const addAction = async () => {
  try {
    if (props.inRuleOutputs) {
      await operationWarning(
        tl('updateActionTip', { operation: sentenceCase(tl('addFallbackAction')) }),
      )
    }
    currentEditIndex.value = -1
    isDrawerOpen.value = true
  } catch (error) {
    //
  }
}

/**
 * the action is the output item from the rule outputs drawer
 * so we need to preprocess the action before pushing it to the fallback action list
 */
const handleActionSubmitted = (action: OutputItem) => {
  let newItem: FallbackAction | undefined = undefined
  if (typeof action === 'object' && action.function && action.args) {
    newItem = { kind: FallbackActionKind.Republish, args: action.args }
  } else if (typeof action === 'string') {
    const { type, name } = getTypeAndNameFromKey(action)
    newItem = { kind: FallbackActionKind.Reference, type, name }
  }
  if (newItem) {
    actionList.value = [...actionList.value, newItem]
  }
}
</script>

<style lang="scss">
@use 'sass:math';

$list-padding: 16px;
.fallback-actions-editor {
  width: 100%;
  max-width: 600px;
  ul {
    padding-left: 0;
    margin: 0;
    list-style: none;
  }
  .action-list {
    padding: $list-padding;
    background-color: var(--color-bg-split);
    border-radius: var(--el-border-radius-base);
    &.empty-readonly {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  $button-margin-bottom: 12px;
  .action-list-hd {
    display: flex;
    justify-content: flex-end;
    margin-bottom: $button-margin-bottom;
  }
  $margin-bottom: 12px;
  .action-item {
    position: relative;
    &:not(:last-child) {
      margin-bottom: $margin-bottom;
    }
    &:hover {
      .action-item-op {
        visibility: visible;
      }
    }
    &.in-rule-outputs {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
  img {
    height: 36px;
    margin-right: 4px;
  }
  .editor-hd {
    position: relative;
    .btn-add-fallback {
      position: absolute;
      right: 0;
      bottom: $button-margin-bottom;
    }
  }
  .action-item-op {
    visibility: hidden;
  }

  .action-item-card {
    width: 100%;
    .el-card__body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px 8px 0;
    }
  }
  .in-rule-outputs {
    .action-item-card {
      border-color: transparent;
    }
  }
  .action-item-info {
    line-height: 1;
  }
  .action-item-name {
    margin-top: 0;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  .action-item-type {
    color: var(--color-text-secondary);
  }
}
</style>
