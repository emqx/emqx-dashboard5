<template>
  <div class="rule-outputs rule-io">
    <div class="sub-block-desc">
      <span>{{ tl('actionDesc') }}</span>
    </div>
    <el-row>
      <el-col :span="24">
        <template v-for="(item, index) in ruleValue.actions" :key="item">
          <div class="io-item">
            <component
              :is="isOutputAction(item) ? 'router-link' : 'div'"
              class="io-item-main"
              :to="{ name: 'action-detail', params: { id: item }, query: getNsParams(namespace) }"
              target="_blank"
            >
              <img :src="getOutputImage(item)" width="48" height="48" />
              <div class="io-item-bd">
                <div v-if="isOutputAction(item)">
                  {{ item.split(ACTION_TYPE_NAME_CONNECTOR)[1] }}
                </div>
                <div class="io-desc">
                  {{ getOutputTypeLabel(item) }}
                </div>
              </div>

              <span class="io-op">
                <el-button
                  size="small"
                  :disabled="disabled"
                  @click.prevent="openOutputDrawer(true, index)"
                >
                  {{ $t('Base.edit') }}
                </el-button>
                <el-button
                  size="small"
                  plain
                  :disabled="!$hasPermission('put') || disabled"
                  @click.prevent="deleteOutput(index)"
                >
                  {{ $t('Base.delete') }}
                </el-button>
              </span>
            </component>
            <template v-if="isOutputAction(item)">
              <el-divider />
              <div class="fallback-container">
                <label class="editor-label">{{ tl('fallbackActions') }}</label>
                <FallbackActionsEditor
                  :model-value="getActionFallback(item)"
                  :action-key="item"
                  :readonly="disabled"
                  :namespace="namespace"
                  in-rule-outputs
                  @update:model-value="handleFallbackActionsChange(item, $event)"
                />
              </div>
            </template>
          </div>
        </template>
        <CreateButton
          class="btn-add"
          :disabled="!$hasPermission('post') || disabled"
          @click="openOutputDrawer(false)"
        >
          {{ tl('addAction') }}
        </CreateButton>
      </el-col>
    </el-row>
  </div>
  <RuleOutputsDrawer
    v-model="showOutputDrawer"
    :output="currentOutputItem"
    :output-disable-list="outputDisableList"
    :edit="isEdit"
    @submit="submitOutput"
  />
</template>

<script lang="ts">
export default defineComponent({
  name: 'RuleOutputs',
})
</script>

<script setup lang="ts">
import { BridgeType, RuleOutput } from '@/types/enum'
import {
  Action,
  BasicRule,
  FallbackAction,
  OutputItem,
  OutputItemObj,
  RuleItem,
} from '@/types/rule'
import { ElMessageBox as MB } from 'element-plus'
import RuleOutputsDrawer from './RuleOutputsDrawer.vue'
import FallbackActionsEditor from '../Bridge/Components/FallbackActionsEditor.vue'

const ACTION_TYPE_NAME_CONNECTOR = ':'

const props = defineProps({
  modelValue: {
    type: Object as PropType<RuleItem | BasicRule>,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const ruleValue: WritableComputedRef<RuleItem | BasicRule> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const namespace = computed(() =>
  'namespace' in ruleValue.value ? ruleValue.value.namespace : undefined,
)
const { getNsParams } = useNsParams()

watch(
  () => props.modelValue?.actions?.length,
  () => {
    queryActionInfoMap()
  },
)

const { tl, t } = useI18nTl('RuleEngine')
const showOutputDrawer = ref(false)
const outputDisableList: Ref<Array<string>> = ref([])
const isEdit = ref(false)
const editIndex: Ref<number | undefined> = ref(undefined)
const currentOutputItem: Ref<OutputItem | undefined> = ref(undefined)

const { getBridgeIcon } = useBridgeTypeIcon()
const { getGeneralTypeLabel } = useBridgeTypeValue()

const calcDisableList = () => {
  outputDisableList.value = []
  if (!Array.isArray(ruleValue.value.actions)) {
    return
  }
  ruleValue.value.actions?.forEach((v: OutputItem) => {
    if (typeof v === 'string') {
      outputDisableList.value.push(v)
    } else if (typeof v === 'object') {
      //republish can be duplicated
      if (v.function === RuleOutput.Republish) return
      v.function && outputDisableList.value.push(v.function)
    }
  })
}

const openOutputDrawer: (edit: boolean, itemIndex?: number | undefined) => void = async (
  edit = false,
  itemIndex,
) => {
  showOutputDrawer.value = true
  let item: OutputItem | undefined
  editIndex.value = itemIndex
  if (itemIndex !== undefined && Array.isArray(ruleValue.value.actions)) {
    item = ruleValue.value.actions?.[itemIndex]
  }
  if (edit) {
    isEdit.value = edit
    currentOutputItem.value = item
  } else {
    isEdit.value = false
    currentOutputItem.value = undefined
  }
  calcDisableList()
}

const deleteOutput = async (itemIndex: number | undefined) => {
  try {
    await MB.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    if (itemIndex !== undefined && Array.isArray(ruleValue.value.actions)) {
      ruleValue.value.actions?.splice(itemIndex, 1)
      calcDisableList()
    }
  } catch (error) {
    //
  }
}

const submitOutput = (opObj: OutputItem, isEdit: boolean) => {
  const output = ruleValue.value.actions || []
  if (Array.isArray(output)) {
    if (!currentOutputItem.value || !isEdit) {
      output.push(opObj)
    } else {
      editIndex.value !== undefined && output.splice(editIndex.value, 1, opObj)
    }
  }
  queryActionInfoMap()
  calcDisableList()
}

const { judgeOutputType } = useRuleOutputs()
const isOutputAction = (item: OutputItem): item is string =>
  judgeOutputType(item) === RuleOutput.DataBridge

const getOutputImage = (item: OutputItem) => {
  if (!item) {
    return ''
  }
  const itemType = judgeOutputType(item)
  let keyForIcon = ''
  switch (itemType) {
    case RuleOutput.DataBridge:
      return getBridgeIcon((item as string).split(ACTION_TYPE_NAME_CONNECTOR)[0])
    case RuleOutput.Console:
      keyForIcon = (item as OutputItemObj).function
      break
    case RuleOutput.Republish:
      keyForIcon = (item as OutputItemObj).function
      break
  }
  try {
    return getImg(`img/${keyForIcon}.png`)
  } catch (e) {
    //May it be a user defined module
    console.log('ImgErr:', e)
  }
}

const getOutputTypeLabel = (item: OutputItem) => {
  // bridge - string; console - string; re pub - object
  if (!item) {
    return ''
  }
  const itemType = judgeOutputType(item)
  switch (itemType) {
    case RuleOutput.DataBridge:
      return getGeneralTypeLabel(
        (item as string).split(ACTION_TYPE_NAME_CONNECTOR)[0] as BridgeType,
      )
    case RuleOutput.Console:
      return tl('consoleOutput')
    case RuleOutput.Republish:
      return tl('republish')
  }
}

const actionInfoMap = ref(new Map<string, Action>())
const { getActionDetail } = useHandleActionItem()
const queryActionInfoMap = async () => {
  props.modelValue.actions?.forEach(async (item) => {
    if (
      judgeOutputType(item) === RuleOutput.DataBridge &&
      !actionInfoMap.value.has(item as string)
    ) {
      const action = await getActionDetail(item as string, namespace.value, {
        errorsHandleCustom: [404],
      })
      actionInfoMap.value.set(item as string, action)
    }
  })
}
queryActionInfoMap()
const getActionFallback = (id: string) => {
  return actionInfoMap.value.get(id)?.fallback_actions ?? []
}

const { updateAction } = useHandleActionItem()
const handleFallbackActionsChange = async (id: string, fallbackActions: FallbackAction[]) => {
  try {
    const actionInfo = actionInfoMap.value.get(id)
    const newInfo = await updateAction({
      ...actionInfo,
      fallback_actions: fallbackActions,
    } as Action)
    actionInfoMap.value.set(getBridgeKey(newInfo), newInfo)
  } catch (error) {
    //
  }
}
</script>

<style lang="scss" scoped>
@use '@/style/rule.scss';
</style>
