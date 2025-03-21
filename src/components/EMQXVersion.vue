<template>
  <span class="emqx-version">
    <!-- <el-tooltip :disabled="!versionInfo.isMutiVersion" placement="top">
      <template #content>
        <span>{{ $t('Dashboard.multiVersionWarning') }}</span>
        <router-link to="/dashboard/nodes">{{ $t('Dashboard.nodeList') }}</router-link>
        <span>{{ $t('Dashboard.checkVersionInfo') }}</span>
      </template>
      <span :class="{ dot: versionInfo.isMutiVersion }">
        {{ versionInfo.latestVersion }}
      </span>
    </el-tooltip> -->
    <span> v1.0.0 </span>
  </span>
</template>

<script setup lang="ts">
import useClusterNodes from '@/hooks/useClusterNodes'

const { versionInfo } = useClusterNodes({
  loadByDefault: true,
  hideProgress: true,
  timeout: 25000,
  getVersion: true,
})
</script>

<style scoped>
.dot::before {
  content: '';
  height: 6px;
  width: 6px;
  background-color: #eb4e3d;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  position: relative;
  top: -2px;
}
</style>
