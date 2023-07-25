<template>
  <div class="function-form">
    <ul class="field-list">
      <li class="field-item" v-for="(item, $index) in record" :key="item.id">
        <FunctionBlock v-model="record[$index]" />
        <el-button v-if="record.length > 1" link class="btn-del" @click="deleteItem($index)">
          <el-icon :size="16" class="icon-del"><Delete /></el-icon>
        </el-button>
      </li>
    </ul>
    <el-button link type="primary" :icon="Plus" @click="addItem">
      {{ tl('add') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { FunctionForm } from '@/hooks/Flow/useFlowNode'
import { createFunctionItem } from '@/hooks/Flow/useNodeForm'
import useI18nTl from '@/hooks/useI18nTl'
import { Delete, Plus } from '@element-plus/icons-vue'
import { isFunction } from 'lodash'
import { PropType, computed, defineEmits, defineExpose, defineProps } from 'vue'
import FunctionBlock from './FunctionBlock.vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<FunctionForm>,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('Base')

// TODO:
const FormComArr: Array<any> = []

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const addItem = () => {
  record.value.push(createFunctionItem())
}

const deleteItem = (index: number) => {
  record.value.splice(index, 1)
}

const validate = () => {
  return Promise.all(
    FormComArr.map((item) => {
      if (item.validate && isFunction(item.validate)) {
        return item.validate()
      }
      return Promise.resolve()
    }),
  )
}

defineExpose({ validate })
</script>

<style lang="scss">
.function-form {
  ul {
    list-style: none;
  }
  ul,
  li {
    padding: 0;
    margin-top: 0;
  }
  .field-item {
    position: relative;
    padding-right: 36px;
    margin-bottom: 16px;
  }
  .btn-del {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
