<template>
  <div class="mq-guidance">
    <div class="guidance-content">
      <div class="guidance-text">
        <h2 class="guidance-title">{{ tl('createFirstMQTitle') }}</h2>
        <div class="guidance-description">
          <p>{{ tl('mqGuidance1') }}</p>
          <p>{{ tl('mqGuidance2') }}</p>
        </div>
        <el-button
          type="primary"
          size="large"
          :disabled="!$hasPermission('post')"
          @click="handleCreateMQ"
        >
          {{ tl('createMQQueue') }}
        </el-button>
      </div>
      <div class="guidance-illustration">
        <div class="illustration-placeholder">
          <el-icon class="illustration-icon">
            <Document />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'

const emit = defineEmits<{
  createMQ: []
}>()

const { tl } = useI18nTl('MessageQueue')

const handleCreateMQ = () => {
  emit('createMQ')
}
</script>

<style lang="scss" scoped>
.mq-guidance {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 24px;
  background-color: var(--color-bg-content);

  .guidance-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 800px;
    width: 100%;
    gap: 60px;

    .guidance-text {
      flex: 1;
      max-width: 400px;

      .guidance-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--color-title-primary);
        margin: 0 0 16px 0;
        line-height: 1.4;
      }

      .guidance-description {
        font-size: 14px;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0 0 32px 0;
      }
    }

    .guidance-illustration {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .illustration-placeholder {
        width: 320px;
        height: 200px;
        border: 2px dashed var(--color-border-primary);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--color-bg-split);

        .illustration-icon {
          font-size: 48px;
          color: var(--color-text-placeholder);
          margin-bottom: 12px;
        }

        .illustration-text {
          font-size: 14px;
          color: var(--color-text-placeholder);
          text-align: center;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .mq-guidance {
    .guidance-content {
      flex-direction: column;
      text-align: center;
      gap: 32px;

      .guidance-text {
        max-width: none;
      }

      .guidance-illustration {
        .illustration-placeholder {
          width: 280px;
          height: 180px;
        }
      }
    }
  }
}
</style>
