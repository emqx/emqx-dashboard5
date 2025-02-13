<template>
  <div class="pre-with-wrap">
    <pre class="keep-spaces"><slot /></pre>
  </div>
</template>

<style lang="scss">
@use '@/style/variables.scss';
.pre-with-wrap {
  word-break: break-all;
  font-family: variables.$font;
}
</style>
