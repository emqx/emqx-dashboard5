<template>
  <div class="flow" v-loading="isLoading">
    <template v-if="showData">
      <div class="section-header flow-view-hd">
        <!-- <el-radio-group v-model="showBy">
          <el-radio-button :label="ShowByOpt.Flow">Flow</el-radio-button>
          <el-radio-button :label="ShowByOpt.List">{{ tl('list') }}</el-radio-button>
        </el-radio-group> -->
        <el-button @click="goCreate" :disabled="!$hasPermission('post')" type="primary">
          {{ tl('flow-create') }}
        </el-button>
      </div>
      <FlowView v-if="showBy === ShowByOpt.Flow" @loaded="handleLoaded" />
      <!-- <FlowList v-if="showBy === ShowByOpt.List" /> -->
    </template>
    <div v-else class="flow-placeholder-container">
      <img class="img-placeholder" width="520" :src="getImgSrc()" alt="empty_placeholder" />
      <el-button @click="goCreate" :disabled="!$hasPermission('post')" type="primary">
        {{ tl('flow-create') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { useVueFlow } from '@vue-flow/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FlowView from './components/FlowView.vue'
import { useStore } from 'vuex'

const router = useRouter()
const { tl } = useI18nTl('components')
const store = useStore()

const theme = computed(() => {
  return store.state.theme
})

const getImgSrc = () => {
  try {
    return require(`@/assets/img/flow-placeholder-${theme.value}.png`)
  } catch (error) {
    return ''
  }
}

const enum ShowByOpt {
  Flow,
  List,
}
const showBy = ref(ShowByOpt.Flow)

const isLoading = ref(true)
const showData = ref(true)

const handleLoaded = (dataLength: number) => {
  isLoading.value = false
  showData.value = dataLength > 0
}

useVueFlow({
  deleteKeyCode: null,
  nodesConnectable: false,
  maxZoom: 1,
})

const goCreate = () => router.push({ name: 'flow-create' })
</script>

<style lang="scss">
.flow {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-content);

  $hd-height: 68px;
  .flow-view-hd {
    height: $hd-height;
    padding-top: 20px;
    padding-left: 16px;
    margin-top: 0;
    border-bottom: 1px solid var(--color-border-primary);
  }
  .flow-view {
    height: calc(100% - #{$hd-height});
  }
  .flow-placeholder-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-bottom: 180px;
    align-items: center;
    justify-content: center;
  }
  .img-placeholder {
    margin-bottom: 48px;
  }
}
</style>
