<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" class="cluster-link-dialog" destroy-on-close>
    <el-form
      ref="FormCom"
      :model="record"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      @keyup.enter="save()"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="tl('clusterName')" prop="name">
            <el-input v-model="record.name" :disabled="!!editData" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('serverAddress')" prop="server">
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
          <el-form-item prop="topics" :label="t('components.topics')">
            <ul class="topic-list">
              <li class="topic-item" v-for="(item, $index) in record.topics" :key="$index">
                <el-form-item :prop="`topics.${$index}`" :rules="arrayItemRule.topic">
                  <el-tooltip
                    :content="tl('disabledDeleteTopicTopic')"
                    :disabled="!disabledEditTopic($index)"
                  >
                    <el-input
                      v-model="record.topics[$index]"
                      :disabled="disabledEditTopic($index)"
                    />
                  </el-tooltip>
                  <div class="btn-container vertical-align-center">
                    <el-tooltip
                      :content="tl('disabledDeleteTopicTopic')"
                      :disabled="!disabledEditTopic($index)"
                    >
                      <el-button
                        class="btn-del"
                        :icon="Minus"
                        :disabled="
                          record.topics.length <= 1 ||
                          disabledEditTopic($index) ||
                          !$hasPermission('delete')
                        "
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
          </el-form-item>
        </el-col>
      </el-row>
      <CommonTLSConfig v-model="record.ssl" />
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
              <el-form-item
                :label="getLabel('inflight_window')"
                prop="resource_opts.inflight_window"
              >
                <CustomInputNumber v-model.number="record.resource_opts.inflight_window" />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </AdvancedSettingContainer>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="save"
          :loading="submitLoading"
        >
          {{ props.editData ? t('Base.confirm') : t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { postClusterLinking, putClusterLinking } from '@/api/cluster'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useClusterLinking from '@/hooks/Config/useClusterLinking'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { ClusterLinkingForm } from '@/types/typeAlias'
import { Minus, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: boolean
  editData?: ClusterLinkingForm
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('BasicConfig')
const getLabel = (key: string) => t(`BridgeSchema.common.${key}.label`)

const { locale } = useI18n()
const isZh = /zh/i.test(locale.value)
const dialogTitle = computed(
  () =>
    `${props.editData ? t('Base.edit') : t('Base.create')}${isZh ? '' : ' '}${t(
      'components.cluster-linking',
    )}`,
)

const { createSSLForm, handleSSLDataBeforeSubmit } = useSSL()
const generateRawRecord = (): ClusterLinkingForm => ({
  enable: true,
  name: '',
  server: '',
  clientid: '',
  username: '',
  password: '',
  topics: [''],
  ssl: createSSLForm() as any,
  pool_size: 8,
  retry_interval: '15s',
  max_inflight: 32,
  resource_opts: {
    start_timeout: '5s',
    worker_pool_size: 16,
    health_check_interval: '15s',
    max_buffer_bytes: '256MB',
    inflight_window: 100,
    request_ttl: '45s',
  },
})

const submitLoading = ref(false)
const record = ref(generateRawRecord())

const { createRequiredRule } = useFormRules()
const rules = {
  name: createRequiredRule(tl('clusterName')),
  server: createRequiredRule(tl('serverAddress')),
  topics: [
    {
      type: 'array',
      validator(rules: any, value: Array<string>, cb: (error?: Error) => void) {
        let error = undefined
        if (Array.isArray(value) && value.length === 0) {
          error = new Error(tl('msgSourceTopicRequired'))
        } else if (Array.isArray(value) && [...new Set(value)].length < value.length) {
          error = new Error(t('RuleEngine.repeatedTopic'))
        }
        cb(error)
      },
      trigger: 'blur',
      required: true,
    },
  ],
}
const FormCom = ref()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, async (value: boolean) => {
  if (!value) {
    record.value = generateRawRecord()
  } else if (props.editData) {
    record.value = cloneDeep(props.editData)
  }
})

const addTopic = () => {
  record.value.topics.push('')
}

const delTopic = (index: number) => {
  record.value.topics.splice(index, 1)
}

/**
 * disabled edit and remove topic
 */
const disabledEditTopic = (index: number) =>
  props.editData &&
  record.value.enable &&
  props.editData?.topics?.length &&
  index < props.editData.topics.length

const arrayItemRule = { topic: createRequiredRule(t('Base.topic')) }
const { getDataForUpdate } = useClusterLinking()
const save = async () => {
  try {
    await FormCom.value.validate()
    const data = {
      ...record.value,
      ssl: handleSSLDataBeforeSubmit(record.value.ssl as any) as any,
    }
    submitLoading.value = true
    try {
      if (!props.editData) {
        await postClusterLinking(data)
      } else {
        await putClusterLinking(data.name, getDataForUpdate(data))
      }
      ElMessage.success(!props.editData ? t('Base.createSuccess') : t('Base.updateSuccess'))
      showDialog.value = false
      emit('submitted')
    } catch (error) {
      //
    } finally {
      submitLoading.value = false
    }
  } catch (error) {
    //
  }
}
</script>

<style lang="scss">
.cluster-link-dialog {
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
