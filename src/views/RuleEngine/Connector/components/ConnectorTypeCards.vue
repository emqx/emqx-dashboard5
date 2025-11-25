<template>
  <div class="connector-type-cards">
    <div class="type-filter-bar">
      <el-input
        v-model="searchQuery"
        :placeholder="tl('typeSearch')"
        clearable
        size="large"
        class="search-input"
      >
        <template #prefix>
          <Search :size="16" />
        </template>
      </el-input>
    </div>

    <div v-if="filteredConnectorTypeList.length === 0" class="no-results">
      <el-empty :description="tl('noMatchingConnectorTypes')">
        <el-button @click="searchQuery = ''">
          {{ tl('clearSearch') }}
        </el-button>
      </el-empty>
    </div>

    <div v-else class="connector-categories">
      <div
        v-for="categoryGroup in categorizedConnectorTypes"
        :key="categoryGroup.category"
        class="category-section"
      >
        <h4 class="category-title">{{ getCategoryLabel(categoryGroup.category) }}</h4>
        <div class="connector-cards-grid">
          <div
            v-for="item in categoryGroup.connectors"
            :key="item.value"
            class="connector-card"
            :class="{ 'is-disabled': !canCreate }"
            @click="handleCardClick(item.value)"
          >
            <div class="card-icon">
              <img
                :src="getBridgeIcon(item.value)"
                :alt="item.label"
                :class="{
                  'is-svg': isSvgIcon(item.value),
                  'dark-invert': needsDarkModeInvert(item.value),
                }"
              />
            </div>
            <div class="card-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { BridgeType } from '@/types/enum'
import { getCurrentInstance } from 'vue'
import { ActionType } from '@/plugins/permissionsPlugin'

const emit = defineEmits<{
  (e: 'select', type: BridgeType): void
}>()

const { tl } = useI18nTl('RuleEngine')
const instance = getCurrentInstance()

// Get permission check function from global properties
const hasPermission = (permission: ActionType) => {
  return instance?.appContext.config.globalProperties.$hasPermission?.(permission) ?? true
}

const canCreate = computed(() => hasPermission('post'))

const { searchQuery, filteredConnectorTypeList, categorizedConnectorTypes, getCategoryLabel } =
  useConnectorTypeValue()
const { getBridgeIcon, isSvgIcon, needsDarkModeInvert } = useBridgeTypeIcon()

const handleCardClick = (type: BridgeType) => {
  if (canCreate.value) {
    emit('select', type)
  }
}
</script>

<style lang="scss" scoped>
.connector-type-cards {
  width: 100%;

  .type-filter-bar {
    margin-bottom: 32px;
    display: flex;
    justify-content: center;

    .search-input {
      max-width: 500px;
    }
  }

  .no-results {
    text-align: center;
    padding: 60px 0;
  }

  .connector-categories {
    .category-section {
      margin-bottom: 48px;

      &:last-child {
        margin-bottom: 0;
      }

      .category-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 24px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border-card);
        letter-spacing: -0.01em;
      }
    }
  }

  .connector-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    width: 100%;

    .connector-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      border: 1px solid var(--color-border-primary);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 140px;

      &:hover:not(.is-disabled) {
        border-color: var(--el-color-primary);
        box-shadow: var(--el-box-shadow-light);
        transform: translateY(-2px);
      }

      &.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .card-icon {
        width: 64px;
        height: 64px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;

          &.is-svg {
            width: 65%;
            height: 65%;
          }
        }
      }

      .card-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        text-align: center;
        line-height: 1.4;
        word-break: break-word;
      }
    }

    @media (max-width: 1200px) {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;

      .connector-card {
        padding: 20px 12px;
        min-height: 120px;

        .card-icon {
          width: 48px;
          height: 48px;
        }

        .card-label {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
