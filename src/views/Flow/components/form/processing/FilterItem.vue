<template>
  <div class="filter-item">
    <el-form-item :prop="getFormItemProp('field')">
      <el-autocomplete v-model="record.field" clearable :fetch-suggestions="getSuggestions" />
    </el-form-item>
    <el-form-item :prop="getFormItemProp('operator')">
      <el-select v-model="record.operator">
        <el-option v-for="item in RULE_LOGICAL_OPERATORS" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :prop="getFormItemProp('valueForComparison')">
      <el-input v-model="record.valueForComparison" />
    </el-form-item>
    <el-button link @click="deleteItem">
      <el-icon :size="16" class="icon-del"><Delete /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { RULE_LOGICAL_OPERATORS } from '@/common/constants'
import { Delete } from '@element-plus/icons-vue'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  index: {
    type: [Number, String],
    required: true,
  },
  subIndex: {
    type: [Number, String],
  },
})
const emit = defineEmits(['update:modelValue', 'delete'])

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const LIST_KEY = 'items'
const getFormItemProp = (key: string) => {
  return props.subIndex !== undefined
    ? [LIST_KEY, props.index.toString(), LIST_KEY, props.subIndex.toString(), key]
    : [LIST_KEY, props.index.toString(), key]
}

const getSuggestions = () => {
  // TODO:
  return []
}

const deleteItem = () => emit('delete')
</script>

<style lang="scss">
.filter-item {
  display: flex;
  align-items: center;
  .el-form-item {
    flex-grow: 1;
    flex-basis: 28%;
    margin-bottom: 0;
    margin-right: 16px;
  }
  .el-autocomplete {
    width: 100%;
    line-height: 0;
  }
  .icon-del {
    color: var(--color-text-secondary);
    opacity: 0.8;
  }
}
</style>
