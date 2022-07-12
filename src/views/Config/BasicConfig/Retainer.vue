<template>
  <div class="retainer app-wrapper">
    <el-card>
      <el-tabs type="card">
        <el-tab-pane :label="tl('messages')">
          <div>
            <el-table class="shadow-none" :data="tbData" v-loading="tbLoading">
              <el-table-column :label="'Topic'" prop="topic" />
              <el-table-column :label="'QoS'" prop="qos" min-width="40" />
              <el-table-column label="From Client ID" prop="from_clientid" />
              <el-table-column
                :label="tl('createDate')"
                prop="publish_at"
                :sort-by="(row) => new Date(row.publish_at).getTime()"
              >
                <template #default="{ row }">
                  {{ row.publish_at && dateFormat(row.publish_at) }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('Base.operation')">
                <template #default="{ row }">
                  <el-button size="small" @click="checkPayload(row)">{{
                    tl('openPayload')
                  }}</el-button>
                  <el-button size="small" type="danger" plain @click="deleteRetainerTopic(row)">
                    {{ $t('Base.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="emq-table-footer">
              <el-pagination
                v-if="count > 0"
                hide-on-single-page
                background
                layout="total, sizes, prev, pager, next"
                :page-sizes="[20, 50, 100, 500]"
                v-model:page-size="limit"
                v-model:current-page="page"
                :total="count"
                @size-change="initPageNo(), loadTbData()"
                @current-change="loadTbData"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="tl('setting')" v-loading="configLoading">
          <div class="part-header">{{ tl('enable') }}</div>
          <el-row align="middle">
            <el-col :span="16" :style="{ marginBottom: '14px' }">{{ tl('enableDesc') }}</el-col>
            <el-col :span="16">
              <el-switch v-model="retainerConfig.enable" @change="toggleStatus()" />
            </el-col>
          </el-row>
          <div class="part-header">{{ tl('storage') }}</div>
          <el-form
            :disabled="!configEnable"
            ref="retainerForm"
            :rules="retainerRules"
            :model="retainerConfig"
            label-position="top"
            @keyup.enter="updateConfigData()"
          >
            <el-row :gutter="30">
              <el-col :span="16">
                <el-form-item :label="tl('storageType')">
                  <el-select v-model="retainerConfig.backend.type">
                    <el-option value="built_in_database" :label="tl('builtInDatabase')" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="16">
                <el-form-item :label="tl('storage')" required prop="backend.storage_type">
                  <el-select v-model="retainerConfig.backend.storage_type">
                    <el-option value="ram" />
                    <el-option value="disc" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="part-header">{{ tl('policy') }}</div>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="Max Retained Messages" prop="backend.max_retained_messages">
                  <el-input
                    v-model.number="retainerConfig.backend.max_retained_messages"
                    :readonly="selOptions.retained == 'unlimited'"
                    maxlength="6"
                  >
                    <template #append>
                      <el-select v-model="selOptions.retained">
                        <el-option value="unlimited" :label="tl('unlimited')" />
                        <el-option value="custom" :label="tl('custom')" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Max Payload Size" prop="max_payload_size">
                  <InputWithUnit v-model="retainerConfig.max_payload_size" :units="['KB', 'MB']" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item :label="tl('expire')" prop="msg_expiry_interval">
                  <InputWithUnit
                    v-model="retainerConfig.msg_expiry_interval"
                    :units="expiryTimeUnits"
                    :disabled-opt="{ value: DISABLED_VALUE, label: tl('noExp') }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="tl('intervalClean')" prop="msg_clear_interval">
                  <InputWithUnit
                    v-model="retainerConfig.msg_clear_interval"
                    :units="expiryTimeUnits"
                    :disabled-opt="{ value: DISABLED_VALUE, label: tl('disable') }"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="part-header">{{ tl('flowControl') }}</div>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item :label="tl('batchReadNumber')" prop="flow_control.batch_read_number">
                  <el-input
                    v-model.number="retainerConfig.flow_control.batch_read_number"
                    :readonly="selOptions.read == 'unlimited'"
                    maxlength="6"
                  >
                    <template #append>
                      <el-select v-model="selOptions.read">
                        <el-option value="unlimited" :label="tl('unlimited')" />
                        <el-option value="custom" :label="tl('custom')" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="tl('batchDeliverNumber')"
                  prop="flow_control.batch_deliver_number"
                >
                  <el-input
                    v-model.number="retainerConfig.flow_control.batch_deliver_number"
                    :readonly="selOptions.deliver == 'unlimited'"
                    maxlength="6"
                  >
                    <template #append>
                      <el-select v-model="selOptions.deliver">
                        <el-option value="unlimited" :label="tl('unlimited')" />
                        <el-option value="custom" :label="tl('custom')" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="btn-col">
              <el-col :span="24">
                <el-button type="primary" @click="updateConfigData()">
                  {{ $t('Base.save') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog v-model="payloadDialog" custom-class="payload-dialog" :title="'Payload'">
      <el-row v-loading="payloadLoading">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="Payload"
          v-model="payloadForShow"
          readonly
        />
      </el-row>
      <template #footer>
        <div class="payload-dialog-ft" v-if="!(payloadDetail === null)">
          <el-select v-model="payloadShowBy">
            <el-option
              v-for="item in payloadShowByOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <div>
            <span v-if="isCopyShow" class="payload-copied">{{ $t('Base.copied') }}</span>
            <el-button @click="copyText(payloadForShow)">
              {{ $t('Base.copy') }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  getRetainer,
  getRetainerList,
  updateRetainer,
  getRetainerTopic,
  delRetainerTopic,
} from '@/api/advanced'
import { dateFormat } from '@/common/utils'
import useShowTextByDifferent from '@/hooks/useShowTextByDifferent'
import { ElMessageBox as MB, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import useI18nTl from '@/hooks/useI18nTl'
import useCopy from '@/hooks/useCopy'
import useFormRules from '@/hooks/useFormRules'
import usePagination from '@/hooks/usePagination'
import InputWithUnit from '@/components/InputWithUnit.vue'

const { t } = useI18n()
const { tl } = useI18nTl('Advanced')
const { copyText } = useCopy(copySuccess)
const { createRequiredRule } = useFormRules()

const DISABLED_VALUE = 'disabled'
const VALUE_FOR_NO_VALUE = '0s'
const expiryTimeUnits = [
  { value: 's', label: tl('sec') },
  { value: 'm', label: tl('min') },
  { value: 'h', label: tl('hour') },
]
const keysNeedTrans = ['msg_expiry_interval', 'msg_clear_interval']

let retainerConfig = reactive({
  max_payload_size: '1MB',
  msg_clear_interval: DISABLED_VALUE,
  msg_expiry_interval: DISABLED_VALUE,
  backend: {
    storage_type: 'ram',
    type: 'built_in_database',
    max_retained_messages: 0,
  },
  flow_control: {
    batch_read_number: 0,
    batch_deliver_number: 0,
    batch_deliver_limiter: '',
  },
  enable: false,
})

const selOptions = reactive({
  retained: 'custom',
  read: 'custom',
  deliver: 'custom',
})

const { page, limit, count, resetPageNum } = usePagination()
let configLoading = ref(true)
let configEnable = ref(false)
let tbLoading = ref(true)
let tbData = ref([])
let payloadDialog = ref(false)
let payloadDetail = ref('')
let payloadLoading = ref(false)
let retainerForm = ref(null)
let isCopyShow = ref(false)
const { payloadForShow, payloadShowBy, payloadShowByOptions, setRawText } = useShowTextByDifferent()

let validatorRules = [
  { required: true, message: tl('required'), trigger: 'blur' },
  {
    type: 'number',
    message: tl('needNumber'),
    trigger: 'blur',
  },
  {
    type: 'number',
    min: 0,
    message: t('Rule.minimumError', { min: 0 }),
  },
]

const numberRule = {
  validator: (rule, value) => {
    const num = parseFloat(value)
    if (num < 0) {
      return new Error(t('Rule.minimumError', { min: 0 }))
    }
    return []
  },
}

const retainerRules = ref({
  backend: {
    max_retained_messages: validatorRules,
    storage_type: createRequiredRule('Storage', 'select'),
  },
  max_payload_size: [...createRequiredRule('Max Payload Size'), numberRule],
  msg_expiry_interval: [...createRequiredRule(tl('expire')), numberRule],
  msg_clear_interval: [...createRequiredRule(tl('intervalClean')), numberRule],
  flow_control: {
    batch_read_number: validatorRules,
    batch_deliver_number: validatorRules,
  },
})

watch(
  () => ({ ...selOptions }),
  async (newV) => {
    // wait derivedOptionsFromConfig finished
    await nextTick()
    if (newV.retained == 'unlimited') {
      retainerConfig.backend.max_retained_messages = 0
    }
    if (newV.read == 'unlimited') {
      retainerConfig.flow_control.batch_read_number = 0
    }
    if (newV.deliver == 'unlimited') {
      retainerConfig.flow_control.batch_deliver_number = 0
    }
  },
)

const loadConfigData = async () => {
  configLoading.value = true
  configEnable.value = true
  retainerForm.value?.resetFields()
  try {
    let res = await getRetainer()
    if (res) {
      Object.assign(retainerConfig, res)
      getConfigFormEnable()
      derivedOptionsFromConfig()
    }
  } catch (error) {
    console.error(error)
  } finally {
    configLoading.value = false
  }
}

const getConfigFormEnable = () => {
  if (retainerConfig?.enable === true) {
    configEnable.value = true
  } else {
    configEnable.value = false
  }
}

const transDataFromDataRequested = (config) => {
  keysNeedTrans.forEach((key) => {
    if (config[key] === VALUE_FOR_NO_VALUE) {
      config[key] = DISABLED_VALUE
    }
  })
  return config
}

const getSelectedOptions = (value) => (value === 0 ? 'unlimited' : 'custom')

const derivedOptionsFromConfig = () => {
  let config = transDataFromDataRequested(retainerConfig)
  // trans some values from string to array
  selOptions.retained = getSelectedOptions(config?.backend?.max_retained_messages)
  selOptions.read = getSelectedOptions(config?.flow_control?.batch_read_number)
  selOptions.deliver = getSelectedOptions(config?.flow_control?.batch_deliver_number)
}

const transDataToSubmit = (config) => {
  const ret = _.cloneDeep(config)
  keysNeedTrans.forEach((key) => {
    if (ret[key] === DISABLED_VALUE) {
      ret[key] = VALUE_FOR_NO_VALUE
    }
  })
  return ret
}

const toggleStatus = async () => {
  let valid = await retainerForm.value.validate().catch(() => {})
  if (!valid) {
    retainerConfig.enable = !retainerConfig.enable
    return
  }
  updateConfigData()
}

const updateConfigData = async function () {
  let valid = await retainerForm.value.validate().catch(() => {})
  if (!valid) return

  configLoading.value = true
  const formData = transDataToSubmit(retainerConfig)

  let res = await updateRetainer(formData).catch(() => {})
  if (res) {
    getConfigFormEnable()
    ElMessage.success(t('Base.updateSuccess'))
  } else {
    loadConfigData()
  }
  configLoading.value = false
}

const deleteRetainerTopic = async function (row) {
  MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(async () => {
      const { topic } = row
      if (!topic) return
      let res = await delRetainerTopic(topic).catch(() => {})
      if (res) {
        page.value = resetPageNum(tbData.value, page.value)
        loadTbData()
      } else {
        //todo
      }
    })
    .catch(() => {})
}

const initPageNo = () => {
  page.value = 1
}

const loadTbData = async () => {
  tbLoading.value = true
  const params = { page: page.value, limit: limit.value }
  tbData.value = []
  count.value = 0
  try {
    const { data, meta } = await getRetainerList(params)
    tbData.value = data
    count.value = meta.count
  } catch (error) {
    //
  } finally {
    tbLoading.value = false
  }
}

const checkPayload = async (row) => {
  payloadDialog.value = true
  payloadDetail.value = ''
  payloadLoading.value = true
  const { topic } = row
  if (!topic) return
  let res = await getRetainerTopic(topic).catch(() => {})
  if (res) {
    payloadDetail.value = res.payload
    setRawText(payloadDetail.value)
  }
  payloadLoading.value = false
  await nextTick()
}

onMounted(() => {
  loadConfigData()
  loadTbData()
})

let copyShowTimeout = ref(null)
const copySuccess = () => {
  isCopyShow.value = true
  clearTimeout(copyShowTimeout.value)
  copyShowTimeout.value = setTimeout(() => {
    isCopyShow.value = false
  }, 2000)
}

onUnmounted(() => {
  copyShowTimeout.value && clearTimeout(copyShowTimeout.value)
})
</script>

<style lang="scss">
.retainer {
  .el-tabs.el-tabs--card.el-tabs--top {
    .el-tabs__content {
      padding: 0 8px;
      .el-tab-pane {
        margin: 24px 0;
      }
    }
  }
  .payload-copied {
    padding-right: 10px;
  }
  .payload-dialog {
    .payload-dialog-ft {
      display: flex;
      justify-content: space-between;
      .el-select {
        width: 200px;
      }
    }
  }
}
</style>
