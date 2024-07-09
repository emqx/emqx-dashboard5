<template>
  <el-dialog
    v-model="showDialog"
    class="common-dialog delete-second-confirm"
    :width="400"
    :z-index="2000"
  >
    <div>
      <div class="el-message-box__container">
        <i class="el-icon el-message-box__status el-message-box-icon--warning">
          <WarningFilled />
        </i>
        <div class="el-message-box__message">
          {{ tl('deleteRuleConfirm') }}
        </div>
      </div>
      <el-checkbox v-if="withSourceOrAction" v-model="deleteSourceAndActionSameTime">
        {{ tl('deleteActionAndSourceSameTime') }}
      </el-checkbox>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="danger" plain @click="submit" :loading="isSubmitting">
          {{ $t('Base.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { deleteRules } from '@/api/ruleengine'
import useActionList from '@/hooks/Rule/action/useActionList'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import { useRuleOutputs, useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleInputType, RuleOutput } from '@/types/enum'
import { RuleEvent, RuleItem } from '@/types/rule'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElDialog, ElMessage } from 'element-plus'
import { lowerCase } from 'lodash'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean; rule?: RuleItem }>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('RuleEngine')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (val) {
    deleteSourceAndActionSameTime.value = true
  }
})

/**
 * all created action list
 */
const actionList = ref<Array<any>>([])
const { getActionList } = useActionList()
;(async () => (actionList.value = await getActionList()))()

const ruleEvent = ref<Array<RuleEvent>>([])
const { getEventList } = useRuleEvents()
;(async () => (ruleEvent.value = await getEventList()))()

const sourceList = ref<Array<any>>([])
const { getSourceList } = useSourceList()
;(async () => (sourceList.value = await getSourceList()))()

const { findInputTypeNTarget } = useRuleUtils()
const { judgeOutputType } = useRuleOutputs()
const actions = computed(() => {
  const allActions = props.rule?.actions || []
  const actionIdList = allActions.filter(
    (action) => judgeOutputType(action) === RuleOutput.DataBridge,
  )
  return actionIdList.reduce((arr: Array<any>, id) => {
    const item = actionList.value.find((action) => action.id === id)
    if (item) {
      arr.push(item)
    }
    return arr
  }, [])
})

const sources = computed(() => {
  const allSources = props.rule?.from || []
  const sourceIdList = allSources.filter((source) => {
    const { type } = findInputTypeNTarget(source, actionList.value, ruleEvent.value)
    return type === RuleInputType.Bridge
  })
  return sourceIdList.reduce((arr: Array<any>, id) => {
    const item = sourceList.value.find((source) => source.id === id)
    if (item) {
      arr.push(item)
    }
    return arr
  }, [])
})

/**
 * Here we also need to determine if the source/action is the only rule being used by the current rule,
 * if it is not (there are multiple rules), skip it.
 */
const withSourceOrAction = computed(() =>
  // TODO:TODO:TODO:TODO:TODO:TODO:
  [...sources.value, ...actions.value].every((item) => item.rules === 1),
)
const deleteSourceAndActionSameTime = ref(true)

const { deleteAction } = useHandleActionItem()
const { deleteSource } = useHandleSourceItem()

const isSubmitting = ref(false)
const submit = async () => {
  if (!props.rule) {
    return
  }
  await deleteRules(props.rule.id)
  if (withSourceOrAction.value && deleteSourceAndActionSameTime.value) {
    try {
      await Promise.all(actions.value.map(({ id }) => deleteAction(id)))
    } catch (error) {
      ElMessage.error(t('RuleEngine.deleteError', { target: lowerCase(tl('action')) }))
    }
    try {
      await Promise.all(sources.value.map(({ id }) => deleteSource(id)))
    } catch (error) {
      ElMessage.error(t('RuleEngine.deleteError', { target: 'source' }))
    }
  }
  ElMessage.success(t('Base.deleteSuccess'))
  emit('submitted')
  showDialog.value = false
}
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>
