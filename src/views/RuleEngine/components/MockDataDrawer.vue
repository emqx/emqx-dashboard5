<template>
  <el-drawer
    v-model="showDrawer"
    destroy-on-close
    class="mock-data-drawer"
    :size="660"
    :title="tl('mockData')"
  >
    <div class="test-header">
      <label class="test-label">
        {{ tl('dataSource') }}
        <InfoTooltip :content="tl('dataSourceDesc')" />
      </label>
      <el-row :gutter="26">
        <el-col :span="12">
          <FromSelect
            v-model="dataType"
            :ingress-bridge-list="ingressBridgeList"
            :event-list="eventList"
            for-test
          />
        </el-col>
        <el-col :span="12" v-if="isDataTypeNoMatchSQL">
          <p class="no-match-tip">
            {{ tl('dataTypeSQLNoMatch') }}
          </p>
        </el-col>
      </el-row>
    </div>
    <div>
      <label class="test-label">
        {{ tl('testData') }}
        <InfoTooltip :content="tl('testDataDesc')" />
      </label>
      <TestSQLContextForm v-model="testParams.context" />
    </div>
    <template #footer>
      <el-button v-if="isFormModified" plain :icon="RefreshLeft" @click="resetContext">
        {{ t('Base.reset') }}
      </el-button>
      <el-button @click="showDrawer = false" :disabled="isSubmitting">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button type="primary" plain :icon="CaretRight" :loading="isSubmitting" @click="submit">
        {{ tl('submitTest') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import InfoTooltip from '@/components/InfoTooltip.vue'
import { useMockData } from '@/hooks/Rule/rule/useDebugRule'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem } from '@/types/rule'
import { CaretRight, RefreshLeft } from '@element-plus/icons-vue'
import type { PropType, WritableComputedRef } from 'vue'
import { computed, defineEmits, defineProps, watch } from 'vue'
import FromSelect from '../components/FromSelect.vue'
import TestSQLContextForm from './TestSQLContextForm.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  ruleData: {
    type: Object,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('RuleEngine')

const {
  dataType,
  testParams,
  isDataTypeNoMatchSQL,
  eventList,
  isFormModified,
  resetContext,
  getMockContext,
  setDataTypeNContext,
} = useMockData(props)

watch(showDrawer, (val) => {
  if (val) {
    setDataTypeNContext()
  }
})

const submit = () => {
  const context = getMockContext()
  emit('submit', context)
}
</script>

<style lang="scss">
.mock-data-drawer {
  .test-sql-context-form {
    margin-top: 12px;
  }
  .test-header {
    .from-select {
      width: 100%;
    }
    .no-match-tip {
      position: static;
    }
  }
}
</style>
