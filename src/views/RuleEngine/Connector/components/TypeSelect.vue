<template>
  <el-row class="type-filter-bar">
    <el-col :span="8">
      <el-input v-model="searchQuery" :placeholder="tl('typeSearch')" clearable></el-input>
    </el-col>
  </el-row>
  <el-radio-group class="target-type-select is-connector" v-model="chosenBridgeType">
    <el-row :gutter="28">
      <el-col v-for="item in filteredConnectorTypeList" :key="item.label" :span="8">
        <el-radio class="target-type-item" :value="item.value" border>
          <img
            class="target-type-item-img"
            height="64"
            width="64"
            :src="getBridgeIcon(item.value)"
            :alt="item.label"
          />
          <div class="target-type-item-bd">
            <div class="title">{{ item.label }}</div>
          </div>
        </el-radio>
      </el-col>
    </el-row>
  </el-radio-group>
</template>

<script setup lang="ts">
import { BridgeType } from '@/types/enum'

const props = defineProps<{
  modelValue: BridgeType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: BridgeType): void
}>()

const { tl } = useI18nTl('RuleEngine')

const chosenBridgeType = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { searchQuery, filteredConnectorTypeList } = useConnectorTypeValue()
const { getBridgeIcon } = useBridgeTypeIcon()
</script>

<style lang="scss">
@use '@/style/rule.scss';
.type-filter-bar {
  margin-bottom: 16px;
}
.target-type-select.is-connector {
  .el-radio__label {
    .title {
      margin-bottom: 0;
    }
  }
}
</style>
