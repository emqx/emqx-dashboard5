<template>
  <div class="pre-with-wrap">
    <pre class="keep-spaces"><slot /></pre>
  </div>
</template>

<style lang="scss">
@import '@/style/common.scss';
.pre-with-wrap {
  word-break: break-all;
}
</style>
