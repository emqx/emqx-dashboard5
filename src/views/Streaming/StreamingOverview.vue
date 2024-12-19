<template>
  <div class="streaming-overview app-wrapper with-padding-top" v-loading="isLoading">
    <template v-if="isStreamingEnabled || configForm.enable">
      <el-card class="metric-card">
        <div v-for="item in metricList" :key="item" class="metric-item">
          <component
            :is="getRouterLink(item) ? 'router-link' : 'div'"
            :to="{ name: getRouterLink(item) }"
            :class="{ 'not-highlight': getRouterLink(item) }"
          >
            <div class="metric-item-hd">
              <i class="metric-item-icon" :class="getIconClass(item)" />
              <p class="metric-item-title">{{ tl(`metricTitleDic.${item}`) }}</p>
            </div>
            <div class="metric-item-bd">
              <label class="metric-item-value">{{ metricsData[item] }}</label>
              <span class="metric-item-unit" v-if="/rate/i.test(item)">
                {{ t('RuleEngine.rateUnit', metricsData[item] || 0) }}
              </span>
            </div>
          </component>
        </div>
      </el-card>
      <el-card class="app-card streaming-config" v-loading="isConfigLoading">
        <div class="config-block">
          <h6 class="config-block-title">{{ t('Base.enable') }}</h6>
          <el-form>
            <el-form-item :label="t('Streaming.enableStreaming')">
              <el-switch v-model="configForm.enable" :disabled="!$hasPermission('put')" />
            </el-form-item>
          </el-form>
        </div>
        <div class="config-block">
          <h6 class="config-block-title">{{ t('components.settings') }}</h6>
          <el-form
            ref="FormCom"
            :model="configForm"
            :rules="rules"
            label-position="top"
            require-asterisk-position="right"
          >
            <el-row :gutter="32">
              <el-col :span="12">
                <el-form-item prop="hornbill_admin_api">
                  <template #label>
                    <FormItemLabel
                      :label="t('Streaming.hornbillAdminEndpoints')"
                      :desc="t('Streaming.hornbillAdminEndpointsDesc')"
                      desc-marked
                    />
                  </template>
                  <el-input v-model="configForm.hornbill_admin_api" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="hornbill_kafka_api">
                  <template #label>
                    <FormItemLabel
                      :label="t('Streaming.hornbillKafkaEndpoints')"
                      :desc="t('Streaming.hornbillKafkaEndpointsDesc')"
                      desc-marked
                    />
                  </template>
                  <el-input v-model="configForm.hornbill_kafka_api" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            class="btn-update"
            :disabled="!$hasPermission('put')"
            type="primary"
            @click="updateConfig"
            :loading="isSubmitting"
          >
            {{ t('Base.update') }}
          </el-button>
        </div>
      </el-card>
    </template>
    <StreamingEmpty v-else @enable-streaming="enableStreaming" />
  </div>
</template>

<script setup lang="ts">
import { getStreamingConfig, getStreamingMetrics, updateStreamingConfig } from '@/api/streaming'
import useStreamingStatus from '@/hooks/useStreamingStatus'
import { StreamingAllMetrics } from '@/types/schemas/streaming.schemas'
import { useLocale } from '@emqx/shared-ui-utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import StreamingEmpty from './components/StreamingEmpty.vue'
import { StreamingConfig } from '@/types/typeAlias'
import useFormRules from '@/hooks/useFormRules'
import { ElMessage } from 'element-plus'
import FormItemLabel from '@/components/FormItemLabel.vue'
import useOperationConfirm from '@/hooks/useOperationConfirm'

const { state } = useStore()
const { t: sharedT } = useLocale(state.lang)
const tl = (key: string) => sharedT(`streaming.${key}`)

const { t } = useI18n()

const isLoading = ref(false)

const { isStreamingEnabled, updateStreamingStatus } = useStreamingStatus()

const metricsData = ref<StreamingAllMetrics>({
  partition_count: 0,
  total_messages_out_rate: 0,
  total_messages_in_rate: 0,
  group_count: 0,
  stream_count: 0,
})

const metricList: Array<keyof StreamingAllMetrics> = [
  'stream_count',
  'partition_count',
  'group_count',
  'total_messages_in_rate',
  'total_messages_out_rate',
]

const iconClassMap = {
  partition_count: 'icon-partition',
  total_messages_out_rate: 'icon-message-out',
  total_messages_in_rate: 'icon-message-in',
  group_count: 'icon-consumer',
  stream_count: 'icon-stream',
}
const getIconClass = (key: keyof StreamingAllMetrics) => {
  return iconClassMap[key]
}

const routerLinkMap: Partial<Record<keyof StreamingAllMetrics, string>> = {
  stream_count: 'stream',
  group_count: 'consumer-group',
}
const getRouterLink = (key: keyof StreamingAllMetrics) => {
  return routerLinkMap[key]
}

const getMetrics = async () => {
  try {
    metricsData.value = await getStreamingMetrics()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

const isConfigLoading = ref(false)
const configForm = ref<StreamingConfig>({} as StreamingConfig)
const FormCom = ref()

const { createRequiredRule } = useFormRules()
const rules = {
  hornbill_admin_api: createRequiredRule(t('Streaming.hornbillAdminEndpoints')),
  hornbill_kafka_api: createRequiredRule(t('Streaming.hornbillKafkaEndpoints')),
}

const getConfig = async () => {
  try {
    isConfigLoading.value = true
    configForm.value = await getStreamingConfig()
    updateStreamingStatus(configForm.value.enable ?? false)
    isConfigLoading.value = false
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

const { operationWarning } = useOperationConfirm()

const isSubmitting = ref(false)
const updateConfig = async (noValidate = false) => {
  try {
    if (!configForm.value.enable) {
      await operationWarning(t('Streaming.disableStreamingWarning'))
    }
    isSubmitting.value = true
    !noValidate && (await FormCom.value.validate())
    configForm.value = await updateStreamingConfig(configForm.value)
    updateStreamingStatus(configForm.value.enable ?? false)
    ElMessage.success(t('Base.updateSuccess'))
    if (isStreamingEnabled.value) {
      await getMetrics()
    }
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  } finally {
    isSubmitting.value = false
  }
}

const enableStreaming = async () => {
  configForm.value.enable = true
}

;(async () => {
  try {
    isLoading.value = true
    await getConfig()
    if (isStreamingEnabled.value) {
      await getMetrics()
    }
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
})()
</script>

<style lang="scss">
.streaming-overview {
  padding-bottom: 32px;
  .metric-card {
    margin-bottom: 48px;
    .el-card__body {
      display: flex;
      padding: 24px;
    }
  }

  .metric-item {
    flex-basis: 20%;
    display: flex;
    cursor: default;

    &-hd {
      .metric-item-icon {
        display: block;
        width: 40px;
        height: 40px;
        margin-bottom: 16px;
        background-size: contain;
        &.icon-partition {
          background-image: url('~@/assets/img/partition.png');
        }
        &.icon-message-out {
          background-image: url('~@/assets/img/message-out.png');
        }
        &.icon-message-in {
          background-image: url('~@/assets/img/message-in.png');
        }
        &.icon-consumer {
          background-image: url('~@/assets/img/consumer.png');
        }
        &.icon-stream {
          background-image: url('~@/assets/img/stream.png');
        }
      }

      .metric-item-title {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 16px;
      }
    }

    &-bd {
      .metric-item-value {
        margin-right: 8px;
        font-size: 32px;
        font-weight: 600;
        line-height: 44px;
      }

      .metric-item-unit {
        font-size: 14px;
        color: #999;
        color: var(--color-text-secondary);
      }
    }
  }
}
.streaming-config {
  .config-block {
    &:not(:last-child) {
      margin-bottom: 36px;
    }
  }
  .config-block-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--color-title-primary);
    line-height: 25px;
  }
  .btn-update {
    padding-left: 30px;
    padding-right: 30px;
  }
  .el-icon {
    vertical-align: top;
  }
}
</style>
