<template>
  <el-drawer
    v-model="showDrawer"
    destroy-on-close
    class="mock-data-drawer"
    :size="getPopupSize()"
    :title="tl('mockData')"
  >
    <el-form-item :label-width="200" class="form-item-source">
      <template #label>
        <FormItemLabel :label="tl('dataSource')" :desc="tl('dataSourceDesc')" />
      </template>
      <FromSelect
        v-model="dataType"
        :ingress-bridge-list="ingressBridgeList"
        :event-list="eventList"
        for-test
      />
      <p class="no-match-tip" v-if="isDataTypeNoMatchSQL">
        {{ tl('dataTypeSQLNoMatch') }}
      </p>
    </el-form-item>
    <div>
      <div class="part-header-container">
        <p class="part-header">{{ tl('testData') }}</p>
        <p class="tip">{{ tl('testDataDesc') }}</p>
      </div>
      <TestSQLContextForm v-model="testParams.context" in-drawer />
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
import FormItemLabel from '@/components/FormItemLabel.vue'
import { useMockData } from '@/hooks/Rule/rule/useDebugRule'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem } from '@/types/rule'
import { CaretRight, RefreshLeft } from '@element-plus/icons-vue'
import type { PropType, WritableComputedRef } from 'vue'
import { computed, defineEmits, defineProps, watch } from 'vue'
import FromSelect from '../components/FromSelect.vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import { getPopupSize } from '@/common/tools'

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
  .part-header {
    flex-basis: 200px;
  }
  .el-form-item {
    margin-top: 0;
  }
  .form-item-source {
    display: flex;
    margin-bottom: 16px;
    .from-select {
      margin-top: 0;
      width: 400px;
    }
    .no-match-tip {
      position: static;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
</style>
