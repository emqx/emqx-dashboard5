<template>
  <div class="sql-test">
    <div class="test-header">
      <label>{{ tl('test') }}</label>
      <InfoTooltip :content="tl('testDesc')" />
      <p class="sub-block-desc">{{ tl('testTip') }}</p>
      <el-switch v-model="showTest"></el-switch>
    </div>
    <el-collapse-transition>
      <div v-show="showTest">
        <div class="test-header">
          <label class="test-label">
            {{ tl('dataSource') }}
            <InfoTooltip :content="tl('dataSourceDesc')" />
          </label>
          <p v-if="isDataTypeNoMatchSQL" class="no-match-tip">
            {{ tl('dataTypeSQLNoMatch') }}
          </p>
          <FromSelect
            v-model="dataType"
            :ingress-bridge-list="ingressBridgeList"
            :event-list="eventList"
            for-test
          />
        </div>
        <el-divider />
        <el-row class="input-output-row" :gutter="26">
          <!-- Input data -->
          <el-col :span="12">
            <label class="test-label">
              {{ tl('testData') }}
              <InfoTooltip :content="tl('testDataDesc')" />
            </label>
            <el-card shadow="never" class="test-card with-border">
              <TestSQLContextForm v-model="testParams.context" />
            </el-card>
          </el-col>
          <!-- Output -->
          <el-col :span="12">
            <label class="test-label">
              {{ tl('outputResult') }}
              <InfoTooltip :content="tl('outputResultDesc')" />
            </label>
            <el-table
              class="shadow-none"
              :data="resultData"
              row-key="key"
              default-expand-all
              max-height="505"
            >
              <el-table-column
                :label="$t('components.field')"
                prop="key"
                min-width="100"
                show-overflow-tooltip
              >
                <template #slot="{ row }">
                  <el-input v-model="row.key" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('components.value')"
                prop="value"
                min-width="100"
                show-overflow-tooltip
              />
            </el-table>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          :loading="testLoading"
          plain
          :icon="CaretRight"
          @click="submitTest"
        >
          {{ tl('testsql') }}
        </el-button>
        <el-button plain :icon="RefreshRight" @click="resetContext">
          {{ t('Base.reset') }}
        </el-button>
      </div>
    </el-collapse-transition>
    <el-dialog v-model="showSQLDialog" class="sql-dialog" :title="tl('sqlExample')">
      <p>{{ eventDesc }}</p>
      <code-view v-if="showSQLDialog" lang="sql" :code="sqlExample" :show-copy-btn="false" />
      <template #footer>
        <el-button @click="useSQL(sqlExample)">
          {{ tl('useSQL') }}
        </el-button>
        <el-button @click="copyText(sqlExample)">
          {{ $t('Base.copy') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useCopy from '@/hooks/useCopy'

export default defineComponent({
  name: 'SQLTest',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits, ref, Ref, PropType, watch } from 'vue'
import { testsql } from '@/api/ruleengine'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { getKeywordsFromSQL } from '@/common/tools'
import { CaretRight, RefreshRight } from '@element-plus/icons-vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessageBox } from 'element-plus'
import FromSelect from '../components/FromSelect.vue'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { RuleInputType } from '@/types/enum'
import CodeView from '@/components/CodeView.vue'

interface TestParams {
  context: Record<string, string>
  output: string
}

const { tl, t } = useI18nTl('RuleEngine')

const props = defineProps({
  sql: {
    type: String,
    default: '',
  },
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  canSave: {
    type: Boolean,
    default: true,
  },
  customPayload: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const testLoading = ref(false)
const resultData = ref<{ [key: string]: any }[]>([])
const emits = defineEmits(['use-sql'])

const showTest = ref(false)
const testParams: Ref<TestParams> = ref({
  context: {},
  output: '',
})
const dataType: Ref<string> = ref('')
const isDataTypeNoMatchSQL = ref(false)
const showSQLDialog = ref(false)
const sqlExample = ref('')
const eventDesc = ref('')
const { TOPIC_EVENT, findInputTypeNTarget, getTestColumns, transFromStrToFromArr } = useRuleUtils()

const useSQL = (SQLContent: string) => {
  emits('use-sql', SQLContent)
  showSQLDialog.value = false
}

const { copyText } = useCopy()

const resetContext = () => {
  ElMessageBox.confirm(tl('confirmReset'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(() => {
      handleDataSourceChanged({ value: dataType.value })
    })
    .catch(() => {
      // ignore
    })
}

const compareTargetNFromStr = (
  targetType: RuleInputType,
  target: BridgeItem | RuleEvent | string,
  fromStr: string,
): boolean => {
  const inputs = transFromStrToFromArr(fromStr)
  const { eventList = [], ingressBridgeList = [] } = props
  const typeNeedToCompares = inputs.map((input) => {
    const { type: typeInSQL } = findInputTypeNTarget(input, eventList, ingressBridgeList)
    const typeNeedToCompare = typeInSQL === RuleInputType.Topic ? TOPIC_EVENT : input
    return typeNeedToCompare
  })
  // when comparing, if the type is topic, compare the TOPIC_EVENT;
  // if type is event, compare target.event
  // if type is bridge, compare bridge.id
  let targetStrToCompare = ''
  switch (targetType) {
    case RuleInputType.Topic:
      targetStrToCompare = target as string
      break
    case RuleInputType.Event:
      targetStrToCompare = (target as RuleEvent).event
      break
    case RuleInputType.Bridge:
      targetStrToCompare = (target as BridgeItem).idForRuleFrom
      break
  }
  return typeNeedToCompares.includes(targetStrToCompare)
}

const setContext = (obj: Record<string, string>) => {
  testParams.value.context = obj
}

const handleDataSourceChanged = ({ value }: { value: string }) => {
  // The data type switch will not change the SQL, but if the data type does not match the SQL,
  // a warning will be issued indicating that the data type does not match the SQL
  const { eventList = [], ingressBridgeList = [] } = props
  const { type, target } = findInputTypeNTarget(value, eventList, ingressBridgeList)
  const { fromStr } = getKeywordsFromSQL(props.sql)
  isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
  const { context, descMap } = getTestColumns(type, value, props.eventList || [])
  setContext(context)
}

watch(
  () => props.eventList,
  (value) => {
    handleDataSourceChanged({ value: dataType.value })
  },
)

const handleSQLChanged = (sql: string) => {
  const { eventList = [], ingressBridgeList = [] } = props
  const { type, target } = findInputTypeNTarget(dataType.value, eventList, ingressBridgeList)
  const { fromStr } = getKeywordsFromSQL(sql)
  isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
}

watch(
  () => props.sql,
  (val) => {
    handleSQLChanged(val)
  },
)

watch(dataType, (val) => {
  handleDataSourceChanged({ value: val })
})

const getEventTypeInContext = () => {
  const { eventList = [], ingressBridgeList = [] } = props
  const { type, target } = findInputTypeNTarget(dataType.value, eventList, ingressBridgeList)
  if (type === RuleInputType.Event) {
    return dataType.value.match(/(\$events\/)([\w]+)/)?.[2]
  }
  if (type === RuleInputType.Bridge) {
    return `$bridges/${(target as BridgeItem).type}:*`
  }
  return TOPIC_EVENT.match(/(\$events\/)([\w]+)/)?.[2]
}

const submitTest = async () => {
  testLoading.value = true
  const context = {
    ...testParams.value.context,
    event_type: getEventTypeInContext(),
  }
  try {
    const res = await testsql({
      context,
      sql: props.sql,
    })
    if (res) {
      const mapData = (data: Record<string, any>): any => {
        return Object.entries(data).map(([key, value]) => {
          if (typeof value === 'object') {
            return {
              key,
              children: mapData(value),
            }
          }
          return {
            key,
            value,
          }
        })
      }
      resultData.value = mapData(res)
    }
  } catch (e) {
    // ignore error
  } finally {
    testLoading.value = false
  }
}

const setDataType = (type: RuleInputType, firstInput: string) => {
  if (type === RuleInputType.Topic) {
    dataType.value = TOPIC_EVENT
  } else {
    dataType.value = firstInput
  }
}

const setDataTypeNContext = () => {
  const { sql, eventList, ingressBridgeList, customPayload: payload } = props
  const { fromStr } = getKeywordsFromSQL(sql)
  const [firstInput = ''] = transFromStrToFromArr(fromStr)
  const { type: inputType } = findInputTypeNTarget(firstInput, eventList, ingressBridgeList)
  const { context } = getTestColumns(inputType, firstInput, eventList)
  setDataType(inputType, firstInput)
  testParams.value = { context, output: '' }
}

setDataTypeNContext()
</script>

<style lang="scss">
.sql-test {
  width: 100%;
  .test-header {
    margin-bottom: 16px;
    position: relative;
  }
  .test-label {
    margin-bottom: 8px;
    display: block;
  }
  .from-select {
    width: 50%;
    margin-top: 8px;
  }
  .no-match-tip {
    color: var(--el-color-warning);
    position: absolute;
    top: -14px;
    right: 50%;
  }
  .input-output-row {
    margin-bottom: 24px;
  }
  .test-card {
    .el-card__body {
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
}
</style>
