<template>
  <div class="flow" v-loading="isLoading">
    <div class="flow-view-hd" v-if="showHeader">
      <el-row :gutter="20" class="flex-1" justify="space-between">
        <el-col v-bind="colProps">
          <NamespaceSelect
            v-if="isMultiTenancyEnabled && !isNamespaceUser"
            v-model="selectedNamespace"
            :global="{ enable: true, value: GLOBAL_NAMESPACE_VALUE }"
            @change="handleNamespaceChange"
          />
        </el-col>
        <el-col v-bind="colProps">
          <div class="flex justify-end">
            <NamespaceCreateButton
              v-if="hasFlowData || showEmpty"
              resource="flow"
              @create="goCreate"
            >
              {{ tl('flow-create') }}
            </NamespaceCreateButton>
          </div>
        </el-col>
      </el-row>
    </div>
    <FlowView
      v-if="hasFlowData"
      :namespace="selectedNamespace"
      @load="handleLoad"
      @loaded="handleLoaded"
    />
    <div v-else class="flow-placeholder-container">
      <el-empty v-if="showEmpty" :description="t('Base.noData')" />
      <template v-else>
        <img class="img-placeholder" width="520" :src="getImgSrc()" alt="empty_placeholder" />
        <NamespaceCreateButton resource="flow" @create="goCreate">
          {{ tl('flow-create') }}
        </NamespaceCreateButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GLOBAL_NAMESPACE_VALUE,
  SEARCH_FORM_RES_PROPS as colProps,
  type NamespaceSelection,
} from '@/common/constants'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import NamespaceCreateButton from '@/components/Namespace/NamespaceCreateButton.vue'
import FlowView from './components/FlowView.vue'

const router = useRouter()
const { tl, t } = useI18nTl('components')
const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()

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

const isLoading = ref(true)
const hasFlowData = ref(true)

const selectedNamespace = ref<NamespaceSelection | undefined>(undefined)
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

const showHeader = computed(() => {
  return !isNamespaceUser.value || (isNamespaceUser.value && hasFlowData.value)
})
const showEmpty = computed(() => {
  return !isNamespaceUser.value && typeof selectedNamespace.value === 'string' && !hasFlowData.value
})

const handleNamespaceChange = () => {
  // reset the flag to true when namespace changes
  hasFlowData.value = true
}

const handleLoad = () => {
  isLoading.value = true
}

const handleLoaded = (dataLength: number) => {
  isLoading.value = false
  hasFlowData.value = dataLength > 0
}

const { getNsParams } = useNsParams()
const goCreate = (namespace?: string) =>
  router.push({
    name: 'flow-create',
    query: getNsParams(namespace),
  })
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
