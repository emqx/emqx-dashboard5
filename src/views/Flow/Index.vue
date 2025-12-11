<template>
  <div class="flow" v-loading="isLoading">
    <div class="flow-view-hd" v-if="showHeader">
      <el-row :gutter="20" class="flex-1" justify="space-between">
        <el-col v-bind="colProps">
          <NamespaceSelect
            v-if="!isNamespaceUser"
            v-model="selectedNamespace"
            :clearable="false"
            :global="{ enable: true, value: GLOBAL_NAMESPACE }"
          />
        </el-col>
        <el-col v-bind="colProps">
          <div class="flex justify-end">
            <CreateButton v-if="hasFlowData" @click="goCreate">
              {{ tl('flow-create') }}
            </CreateButton>
          </div>
        </el-col>
      </el-row>
    </div>
    <FlowView
      v-if="hasFlowData && showBy === ShowByOpt.Flow"
      :namespace="selectedNamespace"
      @load="handleLoad"
      @loaded="handleLoaded"
    />
    <div v-else class="flow-placeholder-container">
      <el-empty v-if="showEmpty" :description="t('Base.noData')" />
      <template v-else>
        <img class="img-placeholder" width="520" :src="getImgSrc()" alt="empty_placeholder" />
        <CreateButton @click="goCreate">
          {{ tl('flow-create') }}
        </CreateButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import FlowView from './components/FlowView.vue'

const router = useRouter()
const { tl, t } = useI18nTl('components')
const store = useStore()

const theme = computed(() => {
  return store.state.theme
})

const getImgSrc = () => {
  try {
    return getImg(`img/flow-placeholder-${theme.value}.png`)
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
const hasFlowData = ref(true)

const selectedNamespace = ref<string>(GLOBAL_NAMESPACE)
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

const showHeader = computed(() => {
  return !isNamespaceUser.value || (isNamespaceUser.value && hasFlowData.value)
})
const showEmpty = computed(() => {
  return (
    !isNamespaceUser.value &&
    selectedNamespace.value &&
    selectedNamespace.value !== GLOBAL_NAMESPACE &&
    !hasFlowData.value
  )
})

const handleLoad = () => {
  isLoading.value = true
}

const handleLoaded = (dataLength: number) => {
  isLoading.value = false
  hasFlowData.value = dataLength > 0
}

const goCreate = () => router.push({ name: 'flow-create' })
</script>

<style lang="scss">
.flow {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-content);

  $hd-height: 68px;
  .flow-view-hd {
    display: flex;
    align-items: center;
    height: $hd-height;
    padding: 0 24px;
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
