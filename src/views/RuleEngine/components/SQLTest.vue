<template>
  <div class="sql-test">
    <div class="test-header">
      <label class="bold">{{ tl('test') }}</label>
      <p class="sub-block-desc">{{ tl('testTip') }}</p>
      <el-switch v-model="isTesting" />
    </div>
    <el-collapse-transition>
      <div v-if="isTesting">
        <p class="bold">{{ tl('testTarget') }}</p>
        <!-- @tab-change="handleTestMethodChanged" -->
        <el-tabs class="target-tabs" v-model="testTarget" lazy>
          <el-tab-pane label="SQL" :name="TestRuleTarget.SQL" :key="TestRuleTarget.SQL">
            <div v-if="testTarget === TestRuleTarget.SQL">
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
              <el-row class="input-output-row" :gutter="26">
                <el-col :span="12">
                  <label class="test-label">
                    {{ tl('testData') }}
                    <InfoTooltip :content="tl('testDataDesc')" />
                  </label>
                  <el-card shadow="never" class="test-card with-border">
                    <TestSQLContextForm v-model="testParams.context" />
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <label class="test-label" shadow="none">
                    {{ tl('outputResult') }}
                    <InfoTooltip :content="tl('outputResultDesc')" />
                  </label>
                  <el-card class="test-result">
                    <div class="result-hd">
                      <el-tooltip effect="dark" placement="top" :content="t('Base.copy')">
                        <el-button type="primary" class="btn-copy" link>
                          <el-icon class="icon-copy" :size="18" @click="copyText(resultData)">
                            <copy-document />
                          </el-icon>
                        </el-button>
                      </el-tooltip>
                    </div>
                    <div class="monaco-container">
                      <Monaco
                        :id="createRandomString()"
                        v-model="resultData"
                        class="payload"
                        lang="json"
                      />
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <div class="buttons-bar">
                <el-button
                  type="primary"
                  :loading="testLoading"
                  plain
                  :icon="CaretRight"
                  @click="submitTestSQL"
                >
                  {{ tl('testsql') }}
                </el-button>
                <el-button plain :icon="RefreshLeft" @click="resetContext">
                  {{ t('Base.reset') }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="startCase(tl('rule'))"
            :key="TestRuleTarget.SQL"
            :name="TestRuleTarget.Rule"
            lazy
          >
            <RuleTest
              ref="RuleTestRef"
              :rule-data="ruleData"
              :ingress-bridge-list="ingressBridgeList"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { testsql } from '@/api/ruleengine'
import { createRandomString } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import { useMockData, useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useCopy from '@/hooks/useCopy'
import useI18nTl from '@/hooks/useI18nTl'
import { TestRuleTarget } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { CaretRight, CopyDocument, RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { startCase } from 'lodash'
import { PropType, defineExpose, defineProps, onUnmounted, ref, watch } from 'vue'
import FromSelect from '../components/FromSelect.vue'
import RuleTest from './RuleTest.vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import { jsonBigIntParse, jsonBigIntStringify } from '@emqx/shared-ui-utils'

const { tl, t } = useI18nTl('RuleEngine')

const props = defineProps({
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  ruleData: {
    type: Object,
    required: true,
  },
})

const { isTesting, testTarget } = useStatusController()

const testLoading = ref(false)
const resultData = ref<string>('')

// const showTest = ref(true)

const {
  ruleSql,
  dataType,
  testParams,
  isDataTypeNoMatchSQL,
  eventList,
  resetContext,
  getMockContext,
  setDataTypeNContext,
} = useMockData(props)

const { copyText } = useCopy()

const submitTestSQL = async () => {
  testLoading.value = true
  let res
  try {
    res = await testsql({ context: getMockContext(), sql: ruleSql.value })
    if (res) {
      resultData.value = jsonBigIntStringify(jsonBigIntParse(res))
      ElMessage.success(tl('testPassed'))
    }
  } catch (error) {
    const err = error as Error
    // don't show axios error
    if (!err.name || !/AxiosError/i.test(err.name)) {
      ElMessage.error(err.toString())
    }
  } finally {
    testLoading.value = false
  }
}

const RuleTestRef = ref()
const stopTest = () => {
  RuleTestRef.value?.stopTest?.()
}

onUnmounted(() => {
  isTesting.value = false
  testTarget.value = TestRuleTarget.SQL
})

watch(
  () => isTesting.value,
  async (val) => {
    if (val) {
      setDataTypeNContext()
    }
  },
)

setDataTypeNContext()

defineExpose({ stopTest })
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
  .test-result {
    height: 490px;
    .monaco-container {
      height: 412px;
    }
    .result-hd {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0;
    }
  }

  .buttons-bar {
    display: flex;
    align-items: flex-start;
    padding-bottom: 12px;
    > div {
      margin-right: 12px;
    }
  }

  .el-tabs.target-tabs {
    .el-tabs__header {
      padding: 0 0;
      margin-bottom: 28px;
    }
  }
}
</style>
