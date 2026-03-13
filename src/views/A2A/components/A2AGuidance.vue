<template>
  <div class="a2a-guidance">
    <div class="guidance-content gap-8">
      <div class="guidance-text">
        <h2 class="guidance-title">{{ tl('guidanceTitle') }}</h2>

        <div class="guidance-description">
          <p class="tip">{{ tl('guidanceDesc') }}</p>
          <p class="disabled-tip">{{ tl('guidanceDisabledTip') }}</p>
          <LinkButton
            :icon="Setting"
            :disabled="!$hasPermission('put')"
            :to="{ name: 'a2a-registry-settings' }"
          >
            {{ t('Base.setting') }}
          </LinkButton>
        </div>
      </div>
      <el-empty description=" " />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'

const { t } = useI18n()
const tl = (key: string) => t(`A2A.${key}`)
</script>

<style lang="scss" scoped>
.a2a-guidance {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 180px 48px;
  background-color: var(--color-bg-content);

  .guidance-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-title-primary);
    margin: 0 0 16px 0;
  }

  .guidance-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .disabled-tip {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .guidance-text {
    max-width: 420px;
    line-height: 1.4;
  }
}
</style>
