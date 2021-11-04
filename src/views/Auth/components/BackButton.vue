<template>
  <a class="back-button" href="javascript:;" @click="handleBack">
    <i class="el-icon-arrow-left"></i>
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'BackButton',
  props: {
    backUrl: {
      required: true,
      type: String,
    },
  },
  methods: {
    handleBack() {
      this.$router.push({
        path: this.backUrl,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.back-button {
  color: #96999c;
  display: inline-block;
  margin-bottom: 10px;
  &:hover {
    color: #00b299;
  }
}
</style>
