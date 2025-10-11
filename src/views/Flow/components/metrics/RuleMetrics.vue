<template>
  <div class="rule-metrics">
    <el-tooltip :content="t('Base.refresh')" placement="top">
      <el-button class="icon-button" type="primary" @click="handleRefresh">
        <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
      </el-button>
    </el-tooltip>
  </div>
  <h1><pre>RULE METRICS</pre></h1>
</template>

<script setup lang="ts">
const { t } = useI18nTl('RuleEngine')

const handleRefresh = () => {
  // TODO:
}
</script>

<style lang="scss"></style>
