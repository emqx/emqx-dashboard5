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
    <div class="filter-container" ref="ListContainer">
      <FilterOperatorLine
        v-if="record.items.length > 1"
        :operator="record.groupOperator"
        @toggle="toggleGroupOperator(record)"
      />
      <div class="connector-container" :class="{ 'is-hidden': hideConnector }" v-if="showConnector">
        <FilterItemConnector
          v-for="item in connectorArr"
          :data="item"
          :key="item.startIndex"
          :style="getConnectorStyle(item)"
          @connected="handleFiltersConnected"
        />
      </div>
      <div :class="listWrapClass" :id="record.id" :key="randomStr">
        <template v-for="(filter, index) in record.items">
          <div class="sub-level filter-container" v-if="filter.items" :key="filter.id">
            <FilterOperatorLine
              class="sub-level"
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
            :class="{ 'can-connect': getCanConnect(index) && showConnector }"
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
import useFilterConnectorInForm from '@/hooks/Flow/useFilterConnectorInForm'
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
import FilterItemConnector from './FilterItemConnector.vue'
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
      }
      return { items: filter.items.map(() => ({ ...ruleItem })) }
    }),
  }
})

/**
 * If there is only one group item in the current first level,
 * make this group item the new first level.
 */
const handleAllInSecondLevel = () => {
  if (record.value.items.length === 1 && 'items' in record.value.items[0]) {
    record.value = record.value.items[0]
  }
}

/**
 * If there is only one item inside the group's items, move it out of the group.
 */
const handleOnlyOneInGroup = () => {
  record.value.items.forEach((filter: FilterItem | FilterForm, index: number) => {
    if ('items' in filter && filter.items.length === 1) {
      record.value.items[index] = filter.items[0]
    }
  })
}

const addFilterItem = () => {
  record.value.items = [...record.value.items, createFilterItem()]
}

const deleteFilterItem = (index: number, subIndex?: number) => {
  const subItems = subIndex !== undefined ? record.value.items[index]?.items || [] : []
  if (subIndex !== undefined && subItems.length > 1) {
    record.value.items[index].items = removeFromArr(subItems, subIndex)
    // so, if items.length === 1, it's a empty group, delete it
  } else {
    record.value.items = removeFromArr(record.value.items, index)
  }
  handleOnlyOneInGroup()
  handleAllInSecondLevel()
}

const toggleGroupOperator = (group: FilterForm) => {
  group.groupOperator =
    group.groupOperator === FilterLogicalOperator.Or
      ? FilterLogicalOperator.And
      : FilterLogicalOperator.Or
}

/**
 * To ensure proper styling during dragging, hide the connector
 */
const hideConnector = ref(false)
const sortEventOpt = {
  onStart: () => {
    hideConnector.value = true
  },
}

const { connectorArr, getCanConnect, getConnectorStyle } = useFilterConnectorInForm(record)
const showConnector = computed(() => record.value.items.length > 2)
const handleFiltersConnected = async ({
  startIndex,
  endIndex,
}: {
  startIndex: number
  endIndex: number
}) => {
  const { items } = record.value
  const filters = items.slice(startIndex, endIndex + 1)
  record.value.items = [
    ...items.slice(0, startIndex),
    { groupOperator: FilterLogicalOperator.And, id: createRandomString(), items: filters },
    ...items.slice(endIndex + 1),
  ]
  handleAllInSecondLevel()
  await nextTick()
  initSortable(sortEventOpt)
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
  handleAllInSecondLevel()
  handleOnlyOneInGroup()
  randomStr.value = createRandomString()
  await nextTick()
  initSortable(sortEventOpt)
  hideConnector.value = false
}
const { ListContainer, listWrapClass, initSortable } = useSortableFilterList(handleDragged)

const saveConfig = () => {
  emit('save', record.value)
}

onMounted(async () => {
  await nextTick()
  initSortable(sortEventOpt)
})

const validate = () => FormCom.value.validate()
defineExpose({ validate })
</script>

<style lang="scss">
.filter-form {
  user-select: none;
  input {
    user-select: auto;
  }
  .filter-container {
    display: flex;
  }
  .list-wrap {
    flex-grow: 1;
  }
  // If you want to make changes here, please modify it along with src/hooks/Flow/useFilterConnectorInForm.ts:8:31
  .filter-container:not(:last-child),
  .filter-item:not(:last-child) {
    margin-bottom: 16px;
  }

  $large-padding-right: 40px;
  $middle-padding-right: 32px;
  $small-padding-right: 24px;

  $gap-left: 8px;
  .filter-item {
    margin-left: $gap-left;
    padding-right: $large-padding-right;
  }

  .sub-level .filter-item {
    padding-right: $small-padding-right;
  }

  .filter-item {
    position: relative;
  }
  $dot-color: #ccefe3;
  // If you want to make changes here, please modify it along with src/hooks/Flow/useFilterConnectorInForm.ts:9:21
  $dot-radius: 3px;
  .filter-item.can-connect::before,
  .filter-item-connector .dot {
    display: block;
    width: $dot-radius * 2;
    height: $dot-radius * 2;
    border-radius: $dot-radius;
    background: $dot-color;
  }
  .filter-item-connector .dot {
    z-index: 1;
    fill: $dot-color;
    stroke: $dot-color;
    stroke-width: 0;
  }
  .filter-item-connector .line {
    stroke: $dot-color;
    stroke-width: $dot-radius * 2;
  }
  $margin-left: $gap-left + $dot-radius * 2 + 20px;
  $connector-left-position: 20px;
  .filter-item.can-connect {
    margin-left: $margin-left;
    padding-right: $middle-padding-right;
  }
  .filter-item.can-connect::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -$margin-left + $connector-left-position;
    transform: translateY(-50%);
  }
  .connector-container {
    position: relative;
    left: $connector-left-position;
    &.is-hidden {
      visibility: hidden;
    }
  }

  .filter-item-connector {
    position: absolute;
    z-index: 1;
    width: 6px;
  }
}
</style>
