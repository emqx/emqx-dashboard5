<template>
  <div class="filter-form is-readonly">
    <div class="filter-container">
      <FilterOperatorLineReadonly
        :operator="record.groupOperator"
        :level="1"
        :filter-data="getFilterDataForLine(1)"
      />
      <div :id="record.id">
        <template v-for="(filter, index) in record.items">
          <div class="sub-level filter-container" v-if="filter.items" :key="filter.id">
            <FilterOperatorLineReadonly
              :operator="filter.groupOperator"
              :level="2"
              :filter-data="getFilterDataForLine(2, index)"
            />
            <div :id="filter.id">
              <div v-for="(subFilter, subIndex) in filter.items" :key="subIndex">
                <FilterItemReadonly :data="filter.items[subIndex]" />
                <OperatorTag
                  v-if="subIndex < filter.items.length - 1"
                  :operator="filter.groupOperator"
                  disabled
                />
              </div>
            </div>
          </div>
          <div v-else :key="index">
            <FilterItemReadonly :data="record.items[index]" />
            <OperatorTag
              v-if="index < record.items.length - 1"
              :operator="record.groupOperator"
              disabled
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, defineProps } from 'vue'
import FilterItemReadonly from './FilterItemReadonly.vue'
import FilterOperatorLineReadonly from './FilterOperatorLineReadonly.vue'
import OperatorTag from './OperatorTag.vue'

const props = defineProps({
  record: {
    type: Object as PropType<any>,
    required: true,
  },
})

const filterCountArr = computed(() => {
  const { items } = props.record
  return items.map((item: any) => {
    if ('items' in item && item.items.length) {
      return item.items.length
    }
    return 1
  })
})
const getFilterDataForLine = (level: 1 | 2, index?: number) => {
  if (level === 2) {
    const currentCount = filterCountArr.value[index as number]
    return Array.from({ length: currentCount }, (_, index) => ({ filterIndex: index }))
  }
  return filterCountArr.value.reduce(
    (arr: Array<{ filterIndex: number }>, currentItem: number, index: number) => {
      if (currentItem === 1) {
        arr.push({ filterIndex: index })
      }
      return arr
    },
    [],
  )
}
</script>

<style lang="scss"></style>
