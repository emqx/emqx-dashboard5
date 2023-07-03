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
    <!-- key is a hack, for refresh list -->
    <div class="filter-container" ref="ListContainer" :key="randomStr">
      <FilterOperatorLine :operator="record.groupOperator" @toggle="toggleGroupOperator(record)" />
      <div :class="listWrapClass" :id="record.id">
        <template v-for="(filter, index) in record.items">
          <div class="sub-level filter-container" v-if="filter.items" :key="filter.id">
            <FilterOperatorLine
              :operator="filter.groupOperator"
              @toggle="toggleGroupOperator(filter)"
            />
            <div :class="listWrapClass" :id="filter.id">
              <FilterItemCom
                v-for="(subFilter, subIndex) in filter.items"
                v-model="filter.items[subIndex]"
                :key="subIndex"
                :index="index"
                :subIndex="subIndex"
                @delete="deleteFilterItem(index, subIndex)"
              />
            </div>
          </div>
          <FilterItemCom
            v-else
            v-model="record.items[index]"
            :key="index"
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
import { createRandomString, removeFromArr } from '@/common/tools'
import {
  FilterForm,
  FilterItem,
  createFilterForm,
  createFilterItem,
} from '@/hooks/Flow/useNodeForm'
import useSortableFilterList from '@/hooks/Flow/useSortableFilterList'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FilterLogicalOperator } from '@/types/enum'
import { Plus } from '@element-plus/icons-vue'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick,
  onMounted,
  ref,
} from 'vue'
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

const record: WritableComputedRef<any> = computed({
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
      record.value.items[index].items = removeFromArr(items, subIndex)
      return
    }
  }
  record.value.items = removeFromArr(record.value.items, index)
}

const toggleGroupOperator = (group: FilterForm) => {
  group.groupOperator =
    group.groupOperator === FilterLogicalOperator.Or
      ? FilterLogicalOperator.And
      : FilterLogicalOperator.Or
}

const findItemById = (id: string) => {
  if (record.value.id === id) {
    return record.value
  }
  return record.value.items.find(({ items, id: subId }: any) => items && id === subId)
}

const moveElement = (arr: any, oldIndex: any, newIndex: any) => {
  if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) {
    throw new Error('Index out of bound')
  }
  const element = arr.splice(oldIndex, 1)[0]
  arr.splice(newIndex, 0, element)
  return arr
}

const randomStr = ref(createRandomString())
const handleDragged = async (evt: any) => {
  const { to: toList, from: fromList, oldIndex, newIndex } = evt
  const fromID = fromList.id
  const toID = toList.id
  const fromItem = findItemById(fromID)
  const toItem = findItemById(toID)
  const target = fromItem.items[oldIndex]
  if (fromID === toID) {
    moveElement(fromItem.items, oldIndex, newIndex)
  } else {
    fromItem.items = removeFromArr(fromItem.items, oldIndex)
    if (fromItem.items.length === 0 && fromItem.id !== record.value.id) {
      deleteFilterItem(record.value.items.findIndex((item: any) => item.id === fromItem.id))
    }
    toItem.items.splice(newIndex, 0, target)
  }
  randomStr.value = createRandomString()
  await nextTick()
  initSortable()
}

const { ListContainer, listWrapClass, initSortable } = useSortableFilterList(handleDragged)

const saveConfig = () => {
  emit('save', record.value)
}

onMounted(async () => {
  await nextTick()
  initSortable()
})

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
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .filter-item {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
