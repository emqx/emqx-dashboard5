<template>
  <div class="filter-form is-readonly">
    <div class="filter-container">
      <div
        class="filter-operator-line"
        v-if="record.items.length > 1"
        readonly
        :operator="record.groupOperator"
      ></div>
      <div :id="record.id">
        <template v-for="(filter, index) in record.items">
          <div class="sub-level filter-container" v-if="filter.items" :key="filter.id">
            <div
              class="filter-operator-line sub-level"
              show-del
              readonly
              :operator="filter.groupOperator"
            ></div>
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
import { defineProps, PropType } from 'vue'
import FilterItemReadonly from './FilterItemReadonly.vue'
import OperatorTag from './OperatorTag.vue'

defineProps({
  record: {
    type: Object as PropType<any>,
    required: true,
  },
})
</script>

<style lang="scss"></style>
