<template>
  <div class="rule-inputs rule-io">
    <div class="sub-block-desc">
      <span>{{ tl('dataInputDesc') }}</span>
    </div>
    <el-row>
      <el-col :span="24">
        <template v-for="(item, $index) in inputList" :key="item">
          <component
            class="io-item"
            :is="isBridgeType(item.type) ? 'router-link' : 'div'"
            :to="{ name: 'source-detail', params: { id: getBridgeIdFromInput(item.value) } }"
            target="_blank"
          >
            <img class="img-io-item" :src="item.icon" />
            <div class="io-item-bd">
              <div>{{ item.title }}</div>
              <div class="io-desc">{{ item.info }}</div>
            </div>
            <span class="io-op">
              <el-button size="small" :disabled="disabled" @click.prevent="editInput($index)">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button
                size="small"
                plain
                :disabled="disabled"
                @click.prevent="deleteInput($index)"
              >
                {{ $t('Base.delete') }}
              </el-button>
            </span>
          </component>
        </template>
        <CreateButton class="btn-add" :disabled="disabled" @click="addInput()">
          {{ tl('addInput') }}
        </CreateButton>
      </el-col>
    </el-row>
  </div>
  <RuleInputsDrawer
    v-model="showInputDrawer"
    :input="currentEditInput"
    :added-list="addedInputList"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { getKeywordsFromSQL, getTypeAndNameFromKey } from '@/common/tools'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { RuleSourceType, useRuleInputs, useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { RuleSQLKeyword } from '@/types/enum'
import { BridgeItem, RuleEvent } from '@/types/rule'
import RuleInputsDrawer from './RuleInputsDrawer.vue'

interface InputItem {
  value: string
  type: string
  title: string
  info: string
  icon: string
}

const props = defineProps<{
  /**
   * rule SQL
   */
  modelValue: string
  /**
   * ingress bridge list
   */
  sourceList: Array<BridgeItem>
  disabled: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t, tl } = useI18nTl('RuleEngine')
const { state } = useStore()
const lang = computed<'en' | 'zh'>(() => (state.lang === 'zh' ? 'zh' : 'en'))

const keyParts = computed(() => getKeywordsFromSQL(props.modelValue))

// to avoid endless loops
let sqlCache = ''

const inputList = ref<Array<InputItem>>([])

const addedInputList = computed(() => inputList.value.map(({ value }) => value))

/* Event List */
const eventList = ref<Array<RuleEvent>>([])
const { getEventList } = useRuleEvents()
const initEventList = async () => {
  eventList.value = await getEventList()
}
initEventList()
const getEventLabel = (event: string) => {
  const item = eventList.value.find((item) => item.event === event)
  return startCase(item?.title[lang.value])
}

/* Process Input String to Input Item */
const { getBridgeIdFromInput, detectInputType, getRuleSourceIcon, isBridgeType } = useRuleInputs()
const { getGeneralTypeLabel } = useBridgeTypeValue()
const processToInputItem = (input: string): InputItem => {
  const type = detectInputType(input)
  let title = ''
  let info = ''

  switch (type) {
    case RuleSourceType.Message: {
      title = tl('message')
      info = `${t('Base.topic')}: ${input}`
      break
    }
    case RuleSourceType.Event: {
      title = tl('event')
      const eventLabel = getEventLabel(input)
      info = eventLabel ? `${t('RuleEngine.event')}: ${eventLabel}` : ''
      break
    }
    // default is bridge
    default: {
      const { name, type } = getTypeAndNameFromKey(getBridgeIdFromInput(input))
      title = getGeneralTypeLabel(type)
      info = `${t('Base.name')}: ${name}`
      break
    }
  }
  return { value: input, type, title, info, icon: getRuleSourceIcon(type) }
}

/* SQL ↔ Input List */
const { transFromStrToFromArr, transFromDataArrToStr, replaceTargetPartInSQL } = useRuleUtils()
const updateInputListBySql = () => {
  sqlCache = props.modelValue
  const { fromStr } = keyParts.value
  inputList.value = !fromStr
    ? []
    : transFromStrToFromArr(fromStr).filter(Boolean).map(processToInputItem)
}
const handleInputListChanged = (val: Array<InputItem>) => {
  const fromStrArr = val.map(({ value }) => value)
  const newFromStr = transFromDataArrToStr(fromStrArr)
  const sql = replaceTargetPartInSQL(props.modelValue, RuleSQLKeyword.From, newFromStr)
  sqlCache = sql
  emit('update:modelValue', sql)
}

/* Handle CUD */
const showInputDrawer = ref(false)
/**
 * If it is -1, it means adding input
 */
const currentEditIndex = ref(-1)
const currentEditInput: ComputedRef<undefined | string> = computed(() =>
  currentEditIndex.value < 0 ? undefined : inputList.value[currentEditIndex.value]?.value,
)

const editInput = (index: number) => {
  currentEditIndex.value = index
  showInputDrawer.value = true
}

const { confirmDel } = useOperationConfirm()
const deleteInput = (index: number) => {
  confirmDel(
    () => {
      inputList.value.splice(index, 1)
      handleInputListChanged(inputList.value)
      return Promise.resolve()
    },
    undefined,
    undefined,
  )
}

const addInput = () => {
  currentEditIndex.value = -1
  showInputDrawer.value = true
}

const handleSubmit = (data: string) => {
  if (currentEditIndex.value < 0) {
    inputList.value.push(processToInputItem(data))
  } else {
    inputList.value[currentEditIndex.value] = processToInputItem(data)
  }
  handleInputListChanged(inputList.value)
}

watch(
  () => props.modelValue,
  (val) => {
    if (val !== sqlCache) {
      updateInputListBySql()
    }
  },
)
updateInputListBySql()
</script>

<style lang="scss" scoped>
@use '@/style/rule.scss';
.rule-inputs {
  .img-io-item {
    border: 8px solid transparent;
  }
}
</style>
