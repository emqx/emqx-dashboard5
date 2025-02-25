<template>
  <div class="rule-metrics">
    <el-tooltip :content="t('Base.refresh')" placement="top">
      <el-button class="icon-button" type="primary" :icon="Refresh" @click="handleRefresh">
      </el-button>
    </el-tooltip>
  </div>
  <h1><pre>RULE METRICS</pre></h1>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

const { t } = useI18nTl('RuleEngine')

const handleRefresh = () => {
  // TODO:
}
</script>

<style lang="scss"></style>
