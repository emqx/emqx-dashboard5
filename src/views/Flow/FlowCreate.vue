<template>
  <div class="flow-create">
    <div class="flow-create-hd space-between">
      <div class="basic-info">
        <p>TODO:</p>
        <p class="tip">TODO:</p>
      </div>
      <div class="vertical-align-center">
        <el-radio-group v-model="editingMethod">
          <el-radio-button :label="EditingMethod.Flow">Flow</el-radio-button>
          <el-radio-button :label="EditingMethod.SQL">SQL</el-radio-button>
        </el-radio-group>
        <el-button type="primary" :loading="isSubmitting">
          {{ t('Base.create') }}
        </el-button>
      </div>
    </div>
    <div class="flow-create-db">
      <FlowEditor v-if="editingMethod === EditingMethod.Flow" />
      <SQLEditor v-if="editingMethod === EditingMethod.SQL" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { ref } from 'vue'
import FlowEditor from './components/FlowEditor.vue'
import SQLEditor from './components/SQLEditor.vue'

const enum EditingMethod {
  Flow,
  SQL,
}

const { tl, t } = useI18nTl('RuleEngine')

const editingMethod = ref(EditingMethod.Flow)
const isSubmitting = ref(false)
</script>

<style lang="scss">
.flow-create {
  height: 100%;
  background-color: var(--color-bg-primary);
  $hd-height: 74px;
  .flow-create-hd {
    height: $hd-height;
    align-items: center;
    padding-left: 24px;
    padding-right: 24px;
    border-bottom: 1px solid var(--color-border-primary);
  }
  .el-radio-group {
    margin-right: 24px;
  }
  .flow-create-db {
    height: calc(100% - #{$hd-height});
    flex-grow: 1;
  }
}
</style>
