<template>
  <el-form
    ref="FormCom"
    label-width="0px"
    class="filter-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @keyup.enter="saveConfig()"
  >
    <div class="filter-container">
      <FilterOperatorLine :operator="record.groupOperator" @toggle="toggleGroupOperator(record)" />
      <div class="list-wrap">
        <template v-for="(filter, index) in record.items">
          <div class="sub-level filter-container" v-if="filter.items" :key="index">
            <FilterOperatorLine
              :operator="filter.groupOperator"
              @toggle="toggleGroupOperator(filter)"
            />
            <div class="list-wrap">
              <FilterItemCom
                v-for="(subFilter, subIndex) in filter.items"
                v-model="filter.items[subIndex]"
                :key="subFilter.id"
                :index="index"
                :subIndex="subIndex"
                @delete="deleteFilterItem(index, subIndex)"
              />
            </div>
          </div>
          <FilterItemCom
            v-else
            v-model="record.items[index]"
            :key="filter.id"
            :index="index"
            @delete="deleteFilterItem(index)"
          />
        </template>
      </div>
    </div>
    <el-button link type="primary" :icon="Plus" @click="addFilterItem">
      {{ t('Base.add') }}
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import {
  FilterForm,
  FilterItem,
  createFilterForm,
  createFilterItem,
} from '@/hooks/Flow/useNodeForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FilterLogicalOperator } from '@/types/enum'
import { Plus } from '@element-plus/icons-vue'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'
import FilterItemCom from './FilterItem.vue'
import FilterOperatorLine from './FilterOperatorLine.vue'

const FormCom = ref()

const props = defineProps({
  modelValue: {
    type: Object as PropType<any>,
    default: () => createFilterForm(),
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { t } = useI18nTl('RuleEngine')

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const ruleItem = {
  field: createRequiredRule(''),
  operator: createRequiredRule('', 'select'),
  valueForComparison: createRequiredRule(''),
}
const rules = computed(() => {
  return {
    items: record.value.items.map((filter: FilterItem | FilterForm) => {
      if (!('items' in filter)) {
        return { ...ruleItem }
      } else {
        return {
          items: filter.items.map(() => ({ ...ruleItem })),
        }
      }
    }),
  }
})

const addFilterItem = () => {
  record.value.items = [...record.value.items, createFilterItem()]
}

const deleteFilterItem = (index: number, subIndex?: number) => {
  if (subIndex !== undefined) {
    const { items = [] } = record.value.items[index] || {}
    if (items.length > 1) {
      record.value.items[index].items = items.filter((_: FilterItem, i: number) => i !== subIndex)
      return
    }
  }
  record.value.items = record.value.items.filter((_: FilterItem, i: number) => i !== index)
}

const toggleGroupOperator = (group: FilterForm) => {
  group.groupOperator =
    group.groupOperator === FilterLogicalOperator.Or
      ? FilterLogicalOperator.And
      : FilterLogicalOperator.Or
}

const saveConfig = () => {
  emit('save', record.value)
}

const validate = () => FormCom.value.validate()
defineExpose({ validate })
</script>

<style lang="scss">
.filter-form {
  .filter-container {
    display: flex;
  }
  .list-wrap {
    flex-grow: 1;
  }
  .filter-container {
    margin-bottom: 16px;
  }
  .filter-item {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
