<template>
  <div class="rule-inputs rule-io">
    <div class="sub-block-desc">
      <span>{{ tl('actionDesc') }}</span>
    </div>
    <el-row>
      <el-col :span="24">
        <template v-for="(item, $index) in inputList" :key="item">
          <div class="io-item">
            <img class="img-io-item" :src="item.icon" />
            <div class="io-item-bd">
              <div>{{ item.title }}</div>
              <div class="io-desc">{{ item.info }}</div>
            </div>
            <span class="io-op">
              <el-button size="small" @click="editInput($index)">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button size="small" plain @click="deleteInput($index)">
                {{ $t('Base.delete') }}
              </el-button>
            </span>
          </div>
        </template>
        <el-button class="btn-add" type="primary" @click="addInput()">
          <el-icon><plus /></el-icon>
          <span>{{ tl('addAction') }}</span>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getKeywordsFromSQL, getTypeAndNameFromKey } from '@/common/tools'
import useFlowNode, { SourceType } from '@/hooks/Flow/useFlowNode'
import useGenerateFlowDataUtils from '@/hooks/Flow/useGenerateFlowDataUtils'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { Plus } from '@element-plus/icons-vue'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useStore } from 'vuex'

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

/* Event List */
const eventList = ref<Array<RuleEvent>>([])
const { getEventList } = useRuleEvents()
const initEventList = async () => {
  eventList.value = await getEventList()
}
initEventList()
const getEventLabel = (event: string) => {
  const item = eventList.value.find((item) => item.event === event)
  return item?.title[lang.value]
}

/* Process Input String to Input Item */
const { getBridgeIdFromInput, detectInputType } = useGenerateFlowDataUtils()
const { getNodeIcon } = useFlowNode()
const { getGeneralTypeLabel } = useBridgeTypeValue()
const processToInputItem = (input: string): InputItem => {
  const type = detectInputType(input)
  let title = ''
  let info = ''

  switch (type) {
    case SourceType.Message: {
      title = tl('message')
      info = input
      break
    }
    case SourceType.Event: {
      title = tl('event')
      info = getEventLabel(input) || ''
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
  return { value: input, type, title, info, icon: getNodeIcon(type) }
}

/* SQL ↔ Input List */
const { transFromStrToFromArr, transSQLFormDataToSQL } = useRuleUtils()
const updateInputListBySql = () => {
  sqlCache = props.modelValue
  const { fromStr } = keyParts.value
  inputList.value = transFromStrToFromArr(fromStr).map(processToInputItem)
}
const handleInputListChanged = (val: Array<InputItem>) => {
  const { fieldStr, whereStr } = keyParts.value
  const fromStrArr = val.map(({ value }) => value)
  const sql = transSQLFormDataToSQL(fieldStr, fromStrArr, whereStr)
  sqlCache = sql
  emit('update:modelValue', sql)
}

/* Handle CUD */
const editInput = (index: number) => {
  // TODO:
}

const deleteInput = (index: number) => {
  // TODO:
}

const addInput = () => {
  // TODO:
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
@import '~@/style/rule.scss';
.rule-inputs {
  .img-io-item {
    border: 8px solid transparent;
  }
}
</style>