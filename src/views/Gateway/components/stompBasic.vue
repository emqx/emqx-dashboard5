<template>
  <div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('maxHeader')">
            <CustomInputNumber
              v-model.number="sValue.frame.max_headers"
              :placeholder="String(sValueDefault.frame.max_headers)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxHeaderLen')">
            <CustomInputNumber
              v-model.number="sValue.frame.max_headers_length"
              :placeholder="String(sValueDefault.frame.max_headers_length)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxBodyLen')">
            <CustomInputNumber
              v-model.number="sValue.frame.max_body_length"
              :min="0"
              :placeholder="String(sValueDefault.frame.max_body_length)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="sValue.idle_timeout"
              :enabled-units="['s']"
              :number-placeholder="parseInt(sValueDefault.idle_timeout).toString()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="sValue.mountpoint" :placeholder="sValueDefault.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="sValue.enable_stats" />
          </el-form-item>
        </el-col>
      </el-row>
      <AdvancedSettingContainer>
        <el-row :gutter="30">
          <el-col v-for="{ key, label } in transactionLimits" :key="key" :span="12">
            <el-form-item>
              <template #label>
                <FormItemLabel :label="tl(label)" :desc="tl(`${label}Desc`)" />
              </template>
              <CustomInputNumber
                v-model.number="sValue.transaction[key]"
                :placeholder="String(transactionDefaults[key])"
              >
                <template v-if="key === 'max_retained_bytes'" #suffix>B</template>
              </CustomInputNumber>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <FormItemLabel
                  :label="tl('stompTransactionTimeout')"
                  :desc="tl('stompTransactionTimeoutDesc')"
                />
              </template>
              <TimeInputWithUnitSelect
                v-model="sValue.transaction.timeout"
                :enabled-units="['ms', 's', 'm', 'h', 'd']"
                :number-placeholder="parseInt(transactionDefaults.timeout).toString()"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </AdvancedSettingContainer>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type { StompGatewayConfig } from '@/types/typeAlias'

const props = defineProps<{
  value?: StompGatewayConfig
  isEdit?: boolean
}>()

const emit = defineEmits(['update:value'])

const createDefault = () => ({
  frame: {
    max_headers: 10,
    max_headers_length: 1024,
    max_body_length: 65536,
  },
  idle_timeout: '30s',
  enable_stats: true,
  mountpoint: '',
})

const sValueDefault = createDefault()

const { tl } = useI18nTl('Gateway')

const transactionDefaults = {
  max_transactions: 100,
  max_actions_per_transaction: 1000,
  max_retained_bytes: 16777216,
  timeout: '60s',
}
const transactionLimits = [
  { key: 'max_transactions', label: 'stompMaxTransactions' },
  { key: 'max_actions_per_transaction', label: 'stompMaxActionsPerTransaction' },
  { key: 'max_retained_bytes', label: 'stompMaxRetainedBytes' },
] as const

const initialTransaction = { ...transactionDefaults, ...props.value?.transaction }
const sValue = reactive({
  ...merge(createDefault(), props.value),
  transaction: { ...initialTransaction },
})

const formValue = computed(() => {
  const { transaction, ...config } = cloneDeep(sValue)
  const baseline = props.isEdit ? initialTransaction : transactionDefaults
  // PUT replaces the entire transaction object when present.
  return isEqual(transaction, baseline) ? config : { ...config, transaction }
})

watch(formValue, (value) => emit('update:value', value))
onMounted(() => emit('update:value', formValue.value))
</script>
