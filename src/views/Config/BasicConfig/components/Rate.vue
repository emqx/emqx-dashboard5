<template>
  <div class="rate">
    <el-form class="schema-form" label-position="top">
      <el-radio-group class="groups-radio" v-model="currentLimiterType" @change="handleTypeChange">
        <el-radio-button v-for="group in LimiterTypes" :key="group" :label="group">
        </el-radio-button>
      </el-radio-group>
      <el-row v-if="rateProperties">
        <!-- Map rate -->
        <template v-for="(rateProp, key) in rateProperties" :key="rateProp">
          <template v-if="rateProp.path">
            <el-col v-if="rateProp.type !== 'object'" :span="16">
              <el-form-item :label="rateProp.label">
                <p class="item-desc" v-html="rateProp.description"></p>
                <template v-if="rateProp.type === 'string'">
                  <el-input
                    :disabled="rateProp.readOnly"
                    :placeholder="rateProp.default"
                    v-model="configs[key]"
                    clearable
                  ></el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col class="custom-col" v-else-if="rateProp.type === 'object'" :span="16">
              <div class="group-title">{{ rateProp.label }}</div>
              <div class="bucket-configs">
                <p class="item-desc">{{ rateProp.description }}</p>
                <el-tabs class="bucket-tabs" type="border-card">
                  <!-- Map bucket name -->
                  <el-tab-pane
                    v-for="(config, configKey) in configs.bucket"
                    :key="configKey"
                    :label="configKey"
                  >
                    <!-- Map bucket -->
                    <template
                      v-for="(bucket, bucketKey) in rateProp.properties.$bucket_name.properties"
                      :key="bucketKey"
                    >
                      <template v-if="bucket.type && bucket.type !== 'object'">
                        <el-form-item :label="bucket.label">
                          <template v-if="bucket.type === 'string'">
                            <el-input
                              :disabled="bucket.readOnly"
                              :placeholder="bucket.default"
                              v-model="configs.bucket[configKey][bucketKey]"
                              clearable
                            ></el-input>
                          </template>
                        </el-form-item>
                      </template>
                      <template v-else>
                        <div class="group-title">{{ bucket.label }}</div>
                        <!-- Map per_client -->
                        <template
                          v-for="(perClient, perClientKey) in bucket.properties"
                          :key="perClientKey"
                        >
                          <el-form-item :label="perClient.label">
                            <p class="item-desc" v-html="perClient.description"></p>
                            <el-input
                              v-if="perClient.type === 'string'"
                              :disabled="perClient.readOnly"
                              :placeholder="perClient.default"
                              v-model="configs.bucket[configKey][bucketKey][perClientKey]"
                              clearable
                            ></el-input>
                            <el-select
                              v-if="perClient.type === 'enum'"
                              :disabled="perClient.readOnly"
                              :placeholder="perClient.default"
                              v-model="configs.bucket[configKey][bucketKey][perClientKey]"
                              clearable
                            >
                              <el-option
                                v-for="value in perClient.symbols"
                                :key="value"
                                :value="value"
                                :label="value"
                              ></el-option>
                            </el-select>
                            <time-input-with-unit-select
                              v-if="perClient.type === 'duration'"
                              :disabled="perClient.readOnly"
                              v-model="configs.bucket[configKey][bucketKey][perClientKey]"
                            >
                            </time-input-with-unit-select>
                            <el-switch
                              v-if="perClient.type === 'boolean'"
                              :disabled="perClient.readOnly"
                              v-model="configs.bucket[configKey][bucketKey][perClientKey]"
                            ></el-switch>
                          </el-form-item>
                        </template>
                      </template>
                    </template>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-col>
          </template>
        </template>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { getRateConfigsByType, updateRateConfigsByType } from '@/api/config'
import { LimiterType, RateItem } from '@/types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import { useStore } from 'vuex'
import _ from 'lodash'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

export default defineComponent({
  name: 'Rate',
  components: {
    TimeInputWithUnitSelect,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()
    const store = useStore()
    const { components } = useSchemaForm('/configs/limiter')
    const currentLimiterType = ref<LimiterType>('bytes_in')
    const LimiterTypes = ['bytes_in', 'message_in', 'connection', 'message_routing', 'batch']
    const rateProperties = computed(() => {
      const currComponent = components.value[currentLimiterType.value]
      console.log(currComponent.properties)
      return currComponent.properties
    })
    const loadData = async () => {
      const res = await getRateConfigsByType(currentLimiterType.value)
      if (res) {
        configs.value = res
      }
      console.log(configs.value)
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async () => {
      saveLoading.value = true
      const data = _.cloneDeep(configs.value) as RateItem
      try {
        await updateRateConfigsByType(currentLimiterType.value, data)
        ElMessage.success(t('Base.updateSuccess'))
        reloading()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    loadData()
    const handleTypeChange = () => {
      loadData()
    }
    return {
      rateProperties,
      currentLimiterType,
      LimiterTypes,
      store,
      handleSave,
      configs,
      reloading,
      handleTypeChange,
      saveLoading,
    }
  },
})
</script>

<style lang="scss">
.rate {
  .bucket-configs {
    padding: 0px 12px 12px;
  }
  .bucket-tabs {
    margin-top: 12px;
    &.el-tabs--border-card {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border-primary);
      border-radius: 8px;
      .el-tabs__header {
        background-color: var(--color-bg-split);
        border-bottom: 1px solid var(--color-border-primary);
        .el-tabs__nav-scroll {
          border-radius: 8px 8px 0 0;
        }
        .el-tabs__nav {
          border-radius: 8px 8px 0 0;
          border-bottom: none;
        }
      }
      & > .el-tabs__header .el-tabs__item:first-child {
        border-radius: 8px 0 0 0;
        border-right-color: var(--color-border-primary);
      }
      & > .el-tabs__header .el-tabs__item.is-active {
        background: var(--color-bg-primary);
      }
      &.el-tabs.el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top {
        padding: 0px 20px;
      }
      .el-tabs__header {
        border-radius: 8px 8px 0 0;
      }
      .el-tabs__content {
        padding: 12px;
      }
    }
  }
}
</style>
