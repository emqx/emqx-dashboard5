<template>
  <div class="mq-guidance">
    <div class="guidance-content">
      <div class="guidance-text">
        <h2 class="guidance-title">{{ tl('createFirstMQTitle') }}</h2>
        <div class="guidance-description">
          <p>{{ tl('mqGuidance1') }}</p>
          <p>{{ tl('mqGuidance2') }}</p>
          <p class="disabled-tip" v-if="!enabled">{{ tl('mqDisabledTip') }}</p>
        </div>
        <el-button
          v-if="enabled"
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="handleCreateMQ"
        >
          {{ tl('createMQQueue') }}
        </el-button>
      </div>
      <img class="illustration-placeholder" src="@/assets/img/mq_placeholder.png" width="420" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  enabled: boolean
}>()

const emit = defineEmits<(e: 'create') => void>()

const { tl } = useI18nTl('MessageQueue')

const handleCreateMQ = () => {
  emit('create')
}
</script>

<style lang="scss" scoped>
.mq-guidance {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 240px;
  background-color: var(--color-bg-content);

  .guidance-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 48px;
  }
  .guidance-text {
    flex: 1;
    max-width: 500px;

    .guidance-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-title-primary);
      margin: 0 0 16px 0;
    }

    .guidance-description {
      color: var(--color-text-secondary);
      margin-bottom: 32px;
      line-height: 1.6;
      p {
        margin: 0;
      }
      .disabled-tip {
        margin-top: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
