<template>
  <el-dialog :title="tl('testsql')" v-model="showDialog" width="80%">
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('messages')">
            <el-input type="textarea" rows="5" v-model="testParams.msg" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'Metadata'">
            <KeyAndValueEditor v-model="testParams.metadata" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'SQL'">
            <el-input type="textarea" rows="5" v-model="testParams.sql" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'Output'">
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
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import { testsql } from '@/api/ruleengine'

interface TestParams {
  msg: string
  metadata: Record<string, unknown>
  sql: string
  output: string
}

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

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
  msg: '',
  metadata: {},
  sql: '',
  output: '',
})
const testLoading = ref(false)

const showDialog: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const submitTest = async () => {
  testLoading.value = true
  const eventType = props.chosenEvent?.event || ''
  const context = {
    ...testParams.value.metadata,
    payload: testParams.value.msg,
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
    testParams.value = { ...props.testData, output: '' }
  }
})
</script>
