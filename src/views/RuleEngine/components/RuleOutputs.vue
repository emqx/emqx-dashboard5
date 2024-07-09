<template>
  <div class="rule-outputs rule-io">
    <div class="sub-block-desc">
      <span>{{ tl('actionDesc') }}</span>
    </div>
    <el-row>
      <el-col :span="24">
        <template v-for="(item, index) in ruleValue.actions" :key="item">
          <div class="io-item">
            <img :src="getOutputImage(item)" />
            <div class="io-item-bd">
              <div v-if="judgeOutputType(item) === RuleOutput.DataBridge">
                {{ (item as string).split(ACTION_TYPE_NAME_CONNECTOR)[1] }}
              </div>
              <div class="io-desc">
                {{ getOutputTypeLabel(item) }}
              </div>
            </div>

            <span class="io-op">
              <el-button size="small" :disabled="disabled" @click="openOutputDrawer(true, index)">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button size="small" plain :disabled="disabled" @click="deleteOutput(index)">
                {{ $t('Base.delete') }}
              </el-button>
            </span>
          </div>
        </template>
        <el-button
          class="btn-add"
          type="primary"
          :icon="Plus"
          :disabled="disabled"
          @click="openOutputDrawer(false)"
        >
          {{ tl('addAction') }}
        </el-button>
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleOutputs',
})
</script>

<script setup lang="ts">
import { useBridgeTypeIcon, useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useRuleOutputs } from '@/hooks/Rule/rule/useRule'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType, RuleOutput } from '@/types/enum'
import { BasicRule, OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox as MB } from 'element-plus'
import { computed, defineEmits, defineProps, PropType, ref, Ref, WritableComputedRef } from 'vue'
import RuleOutputsDrawer from './RuleOutputsDrawer.vue'

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

const { tl, t } = useI18nTl('RuleEngine')
const showOutputDrawer = ref(false)
const outputDisableList: Ref<Array<string>> = ref([])
const isEdit = ref(false)
const editIndex: Ref<number | undefined> = ref(undefined)
const currentOutputItem: Ref<OutputItem | undefined> = ref(undefined)

const { getBridgeIconKey } = useBridgeTypeIcon()
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
  calcDisableList()
}

const { judgeOutputType } = useRuleOutputs()

const getOutputImage = (item: OutputItem) => {
  if (!item) {
    return ''
  }
  const itemType = judgeOutputType(item)
  let keyForIcon = ''
  switch (itemType) {
    case RuleOutput.DataBridge:
      keyForIcon = getBridgeIconKey((item as string).split(ACTION_TYPE_NAME_CONNECTOR)[0])
      break
    case RuleOutput.Console:
      keyForIcon = (item as OutputItemObj).function
      break
    case RuleOutput.Republish:
      keyForIcon = (item as OutputItemObj).function
      break
  }
  try {
    return require(`@/assets/img/${keyForIcon}.png`)
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
</script>

<style lang="scss" scoped>
@import '~@/style/rule.scss';
</style>
