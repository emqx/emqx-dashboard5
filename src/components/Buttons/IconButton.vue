<template>
  <el-button class="icon-button" plain><slot></slot></el-button>
</template>

<style lang="scss">
.icon-button {
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;
  .el-icon {
    margin-right: 0;
  }
  [class*='el-icon'] + span {
    margin-left: 0;
  }
}
</style>
