<template>
  <el-form
    ref="FormCom"
    class="cluster-linking-form"
    :model="record"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="name">
          <template #label>
            <FormItemLabel :label="tl('clusterName')" :desc="tl('clusterNameDesc')" desc-marked />
          </template>
          <el-input v-model="record.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="server">
          <template #label>
            <FormItemLabel :label="tl('serverAddress')" :desc="tl('serverAddressDesc')" />
          </template>
          <el-input v-model="record.server" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="tl('clientIdPrefix')" prop="clientid">
          <el-input v-model="record.clientid" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="t('Base.username')" prop="username">
          <el-input v-model="record.username" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="t('Base.password')" prop="password">
          <el-input
            v-model="record.password"
            type="password"
            autocomplete="one-time-code"
            show-password
          />
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item prop="topics">
          <template #label>
            <FormItemLabel
              :label="t('components.topics')"
              :desc="tl('linkingTopicsDesc')"
              desc-marked
            />
          </template>
          <ul class="topic-list">
            <li class="topic-item" v-for="(item, $index) in record.topics" :key="$index">
              <el-form-item :prop="`topics.${$index}`" :rules="arrayItemRule.topic">
                <el-tooltip
                  :content="tl('disabledDeleteTopicTopic')"
                  :disabled="!disabledEditTopic($index)"
                >
                  <el-input v-model="record.topics[$index]" :disabled="disabledEditTopic($index)" />
                </el-tooltip>
                <div class="btn-container vertical-align-center">
                  <el-tooltip
                    :content="tl('disabledDeleteTopicTopic')"
                    :disabled="!disabledEditTopic($index)"
                  >
                    <el-button
                      class="btn-del"
                      :icon="Minus"
                      :disabled="disabledEditTopic($index) || !$hasPermission('delete')"
                      @click="delTopic($index)"
                    />
                  </el-tooltip>
                  <el-button
                    v-if="$index === record.topics.length - 1"
                    class="btn-add"
                    :icon="Plus"
                    :disabled="!$hasPermission('post')"
                    @click="addTopic"
                  />
                </div>
              </el-form-item>
            </li>
          </ul>
          <el-button
            v-if="!record.topics.length"
            class="btn-add"
            :icon="Plus"
            :disabled="!$hasPermission('post')"
            @click="addTopic"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <CommonTLSConfig v-model="(record as any).ssl" :is-edit="isEdit" />
    <AdvancedSettingContainer>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="t('RuleEngine.connectionPoolSize')" prop="pool_size">
            <CustomInputNumber v-model.number="record.pool_size" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('Gateway.retryInterval')" prop="retry_interval">
            <TimeInputWithUnitSelect v-model="record.retry_interval" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getLabel('max_inflight')" prop="max_inflight">
            <CustomInputNumber v-model.number="record.max_inflight" />
          </el-form-item>
        </el-col>
        <template v-if="record.resource_opts">
          <el-col :span="12">
            <el-form-item :label="getLabel('start_timeout')" prop="resource_opts.start_timeout">
              <TimeInputWithUnitSelect v-model="record.resource_opts.start_timeout" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="getLabel('worker_pool_size')"
              prop="resource_opts.worker_pool_size"
            >
              <CustomInputNumber v-model.number="record.resource_opts.worker_pool_size" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getLabel('request_ttl')" prop="resource_opts.request_ttl">
              <Oneof
                v-model="record.resource_opts.request_ttl"
                :items="[{ type: 'duration' }, { symbols: ['infinity'], type: 'enum' }]"
                in-row
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="getLabel('health_check_interval')"
              prop="resource_opts.health_check_interval"
            >
              <TimeInputWithUnitSelect v-model="record.resource_opts.health_check_interval" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="getLabel('max_buffer_bytes')"
              prop="resource_opts.max_buffer_bytes"
            >
              <InputWithUnit
                v-model="record.resource_opts.max_buffer_bytes"
                :units="['MB', 'GB', 'KB', 'B']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getLabel('inflight_window')" prop="resource_opts.inflight_window">
              <CustomInputNumber v-model.number="record.resource_opts.inflight_window" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import { customValidate } from '@/common/tools'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { ClusterLinkingForm } from '@/types/typeAlias'
import { Minus, Plus } from '@element-plus/icons-vue'
import { computed, defineEmits, defineProps, ref, defineExpose } from 'vue'

const props = defineProps<{
  modelValue: ClusterLinkingForm
  isEdit?: boolean
  editDataTopicLength?: number
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: ClusterLinkingForm): void
}>()

const { t, tl } = useI18nTl('BasicConfig')
const getLabel = (key: string) => t(`BridgeSchema.common.${key}.label`)

const record = computed<ClusterLinkingForm>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const rules = {
  name: createRequiredRule(tl('clusterName')),
  server: createRequiredRule(tl('serverAddress')),
  topics: [
    {
      type: 'array',
      validator(rules: any, value: Array<string>, cb: (error?: Error) => void) {
        let error = undefined
        if (Array.isArray(value) && [...new Set(value)].length < value.length) {
          error = new Error(t('RuleEngine.repeatedTopic'))
        }
        cb(error)
      },
      trigger: 'blur',
    },
  ],
}
const arrayItemRule = { topic: createRequiredRule(t('Base.topic')) }
const FormCom = ref()

const addTopic = () => {
  record.value.topics.push('')
}

const delTopic = (index: number) => {
  record.value.topics.splice(index, 1)
}

/**
 * disabled edit and remove topic
 */
const disabledEditTopic = (index: number) => {
  return (
    props.isEdit &&
    record.value.enable &&
    props.editDataTopicLength &&
    index < props.editDataTopicLength
  )
}

const validate = () => customValidate(FormCom.value)

defineExpose({ validate })
</script>

<style lang="scss">
.cluster-linking-form {
  width: 75%;
  margin-bottom: 36px;
  .topic-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .topic-item {
    margin-bottom: 12px;
    .el-form-item {
      width: 100%;
    }
    .el-form-item__content {
      position: relative;
    }
    .el-button {
      margin-left: 12px;
      padding-right: 8px;
      padding-left: 8px;
    }
    .btn-container {
      position: absolute;
      top: 0;
      right: -12px;
      transform: translateX(100%);
    }
  }
}
</style>
