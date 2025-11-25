<template>
  <el-row class="type-filter-bar">
    <el-col :span="8">
      <el-input v-model="searchQuery" :placeholder="tl('typeSearch')" clearable>
        <template #prefix>
          <Search :size="16" />
        </template>
      </el-input>
    </el-col>
  </el-row>
  <el-radio-group class="target-type-select is-connector" v-model="chosenBridgeType">
    <div
      v-for="categoryGroup in categorizedConnectorTypes"
      :key="categoryGroup.category"
      class="category-section"
    >
      <h4 class="category-title">{{ getCategoryLabel(categoryGroup.category) }}</h4>
      <el-row :gutter="28">
        <el-col v-for="item in categoryGroup.connectors" :key="item.label" :span="8">
          <el-radio class="target-type-item" :value="item.value" border>
            <img
              class="target-type-item-img"
              :class="{
                'is-svg': isSvgIcon(item.value),
                'dark-invert': needsDarkModeInvert(item.value),
              }"
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
    </div>
  </el-radio-group>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
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

const { searchQuery, categorizedConnectorTypes, getCategoryLabel } = useConnectorTypeValue()
const { getBridgeIcon, isSvgIcon, needsDarkModeInvert } = useBridgeTypeIcon()
</script>

<style lang="scss">
@use '@/style/rule.scss';
.type-filter-bar {
  margin-bottom: 32px;
}
.target-type-select.is-connector {
  display: block;

  .category-section {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .category-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border-card);
      letter-spacing: -0.01em;
    }
  }

  .target-type-item {
    border: 1px solid var(--color-border-primary);
    border-radius: 8px;

    &.is-checked {
      border: 2px solid var(--el-color-primary);
    }

    .is-svg {
      width: 36px;
      height: 36px;
      margin-left: 12px;
    }
  }

  .el-radio__label {
    .title {
      margin-bottom: 0;
    }
  }
}
</style>
