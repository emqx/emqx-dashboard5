<template>
  <div class="filter-form is-readonly">
    <div class="filter-container">
      <FilterOperatorLineReadonly :operator="record.groupOperator" />
      <div :id="record.id">
        <template v-for="(filter, index) in record.items">
          <div class="sub-level filter-container" v-if="filter.items" :key="filter.id">
            <FilterOperatorLineReadonly :operator="filter.groupOperator" />
            <div :id="filter.id">
              <div v-for="(subFilter, subIndex) in filter.items" :key="subIndex">
                <FilterItemReadonly
                  :level="2"
                  :data="filter.items[subIndex]"
                  :operator="filter.groupOperator"
                />
                <OperatorTag
                  v-if="subIndex < filter.items.length - 1"
                  :operator="filter.groupOperator"
                  disabled
                />
              </div>
            </div>
          </div>
          <div v-else :key="index">
            <OperatorTag v-if="showPreTag(index)" :operator="record.groupOperator" disabled />
            <FilterItemReadonly
              :level="1"
              :data="record.items[index]"
              :operator="record.groupOperator"
            />
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

const showPreTag = (index: number) => {
  if (index === 0) {
    return false
  }
  return filterCountArr.value[index - 1] > 1
}
</script>
