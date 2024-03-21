<template>
  <div class="unauthorized">
    <Transition>
      <div v-if="show">
        <el-icon :size="180"><Failed /></el-icon>
        <p>{{ tl('unauthorized') }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { Failed } from '@element-plus/icons-vue'
import { ref } from 'vue'

const { tl } = useI18nTl('Base')
const show = ref(false)
setTimeout(() => {
  show.value = true
}, 200)
</script>

<style lang="scss">
.unauthorized {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
  color: #ccc;
  p {
    font-size: 28px;
  }
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
