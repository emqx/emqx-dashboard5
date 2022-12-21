<template>
  <div class="limiter app-wrapper">
    <el-card>
      <el-form class="schema-form" label-position="top">
        <el-tabs class="group-tabs" type="card" v-model="currentLimiterType">
          <el-tab-pane
            v-for="group in LimiterTypes"
            :key="group"
            :label="tl(group)"
            :name="group"
          />
        </el-tabs>
        <LimiterConfigurationBlock
          v-if="rateProperties"
          v-model="configs"
          :properties="rateProperties"
          :block-tip="tl('rateConfigDesc')"
        />

        <!-- Client -->
        <el-card
          class="app-card with-border card-client-rate"
          v-if="clientRateProperties"
          shadow="never"
        >
          <p class="part-header">{{ tl('connectionTitle') }}</p>
          <LimiterConfigurationBlock
            v-model="configs"
            :properties="clientRateProperties"
            :block-tip="tl('clientRateConfigDesc')"
          />
        </el-card>
        <el-row v-if="rateProperties || clientRateProperties">
          <el-col
            :span="24"
            class="btn-col"
            :style="{ left: store.state.leftBarCollapse ? '104px' : '224px' }"
          >
            <el-button type="primary" :loading="saveLoading" @Click="handleSave">
              {{ $t('Base.save') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getLimiters, updateLimiters } from '@/api/config'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import useI18nTl from '@/hooks/useI18nTl'
import { Limiter, LimiterType } from '@/types/config'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import LimiterConfigurationBlock from './components/LimiterConfigurationBlock.vue'

const configs = ref<Limiter>({} as Limiter)
const saveLoading = ref(false)

const { t } = useI18n()
const { tl } = useI18nTl('BasicConfig')
const store = useStore()

const { components } = useSchemaForm(`static/hot-config-schema-${store.state.lang}.json`, {
  path: '/configs/limiter',
})
const currentLimiterType = ref<LimiterType>('bytes_in')
const LimiterTypes = ['bytes_in', 'message_in', 'connection', 'message_routing', 'internal']

const rateProperties = computed(() => {
  const currComponent = components.value[currentLimiterType.value]
  return currComponent?.properties
})

const clientRateProperties = computed(() => {
  const clientRateComponent = components.value.client?.properties?.[currentLimiterType.value]
  return clientRateComponent?.properties
})

const loadData = async () => {
  try {
    const res = await getLimiters()
    configs.value = res
  } catch (error) {
    //
  }
}

const handleSave = async () => {
  saveLoading.value = true
  const data = cloneDeep(configs.value)
  try {
    await updateLimiters(data)
    ElMessage.success(t('Base.updateSuccess'))
    loadData()
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}

loadData()
</script>
<style lang="scss">
.limiter {
  .card-client-rate {
    width: 60%;
    margin-left: -1px;
    margin-top: 20px;
    .part-header {
      margin-top: 0;
      padding-left: 12px + 12px + 4px;
    }
    .el-card__body {
      padding-left: 0;
      padding-right: 0;
    }
    .el-form-item {
      padding: 8px 12px 12px;
    }
    .col-custom-width {
      flex-basis: 91.6%;
      max-width: 91.6%;
    }
  }
  .desc-config {
    margin: 16px 0;
    padding-left: 12px + 4px;
  }
}
</style>
