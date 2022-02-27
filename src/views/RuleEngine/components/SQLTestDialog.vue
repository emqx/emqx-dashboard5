<template>
  <el-dialog :title="tl('testsql')" v-model="showDialog" :width="1000">
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item>
            <template #label>
              <div class="label-container">
                <label>{{ tl('testData') }}</label>
                <div class="context-handlers">
                  <el-tooltip effect="dark" :content="tl('doc')" placement="top-start">
                    <el-icon @click="goDoc"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="tl('resetData')" placement="top-start">
                    <el-icon @click="resetContext"><Refresh /></el-icon>
                  </el-tooltip>
                  <el-icon><MagicStick /></el-icon>
                  <el-tooltip effect="dark" :content="tooltipForToggleBtn" placement="top-start">
                    <el-icon @click="toggleInputContextType"><EditPen /></el-icon>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <div v-if="inputContextBy === InputContextType.JSON" class="monaco-container">
              <!-- <el-input type="textarea" rows="5" v-model="testParams.context" /> -->
              <Monaco :id="createRandomString()" v-model="contextObjStr" lang="json" />
            </div>
            <TestSQLContextForm v-else v-model="testParams.context" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('testsql')">
            <el-input type="textarea" rows="5" v-model="testParams.sql" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('outputResult')">
            <el-input type="textarea" rows="5" v-model="testParams.output" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small" :loading="testLoading" @click="submitTest()">
        {{ $t('Base.test') }}
      </el-button>
      <el-button size="small" @click="cancel">
        {{ $t('Base.cancel') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'SQLTestDialog',
})
</script>

<script setup lang="ts">
import { defineProps, computed, defineEmits, WritableComputedRef, ref, Ref, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { testsql } from '@/api/ruleengine'
import Monaco from '@/components/Monaco.vue'
import { createRandomString } from '@/common/tools'
import { QuestionFilled, Refresh, MagicStick, EditPen } from '@element-plus/icons-vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'

interface TestParams {
  context: Record<string, string>
  sql: string
  output: string
}

enum InputContextType {
  JSON,
  Form,
}

const { t } = useI18n()
const { tl } = useI18nTl('RuleEngine')

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  testData: {
    type: Object as PropType<Omit<TestParams, 'output'>>,
    required: true,
  },
  chosenEvent: {
    type: Object,
  },
})

const emit = defineEmits(['update:modelValue'])

const testParams: Ref<TestParams> = ref({
  context: {},
  sql: '',
  output: '',
})
const contextObjStr: Ref<string> = ref('')
const testLoading = ref(false)
const inputContextBy = ref(InputContextType.JSON)

const showDialog: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const tooltipForToggleBtn = computed(() =>
  tl(
    inputContextBy.value === InputContextType.JSON ? 'switchToFormEditing' : 'switchToJSONEditing',
  ),
)

const setContextObjStr = () => {
  try {
    contextObjStr.value = JSON.stringify(testParams.value.context, null, 2)
    return Promise.resolve()
  } catch (error: any) {
    ElMessage.error(error?.toString())
    return Promise.reject()
  }
}

const setObjByStr = async () => {
  try {
    testParams.value.context = JSON.parse(contextObjStr.value)
    return Promise.resolve()
  } catch (error: any) {
    ElMessage.error(error?.toString())
    return Promise.reject()
  }
}

const goDoc = () => {
  // TODO:
  window.open('https://www.emqx.io', '_blank')
}

const resetContext = () => {
  testParams.value.context = { ...props.testData.context }
  debugger
  if (inputContextBy.value === InputContextType.JSON) {
    setContextObjStr()
  }
}

const toggleInputContextType = async () => {
  if (inputContextBy.value === InputContextType.JSON) {
    await setObjByStr()
    inputContextBy.value = InputContextType.Form
  } else {
    await setContextObjStr()
    inputContextBy.value = InputContextType.JSON
  }
}

const submitTest = async () => {
  testLoading.value = true
  const eventType = props.chosenEvent?.event || ''
  const context = {
    ...testParams.value.context,
    event_type: eventType.match(/(\$events\/)([\w]+)/)?.[2],
  }

  const res = await testsql({
    context,
    sql: testParams.value.sql,
  }).catch((e) => {
    testParams.value.output = e
  })

  if (res) {
    try {
      const text = JSON.stringify(res)
      testParams.value.output = text
    } catch (e) {
      console.log(e)
      testParams.value.output = res
    }
  }
  testLoading.value = false
}

const cancel = () => {
  showDialog.value = false
}

watch(showDialog, (val) => {
  if (val) {
    testParams.value = { ...cloneDeep(props.testData), output: '' }
    setContextObjStr()
  }
})
</script>

<style lang="scss" scoped>
.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.context-handlers {
  .el-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #f1f1f1;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}
</style>
