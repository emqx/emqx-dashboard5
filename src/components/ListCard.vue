<template>
  <div class="app-wrapper list-page">
    <el-card>
      <slot />
    </el-card>
  </div>
</template>

<style lang="scss">
.app-wrapper.list-page {
  margin-top: 16px;
  margin-bottom: 16px;
}
.title-bar + div {
  > .app-wrapper.list-page {
    margin-top: 0;
  }
}
</style>
