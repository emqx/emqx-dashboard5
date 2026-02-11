<template>
  <div>
    <el-divider>{{ tl('blockwiseTransfer') }}</el-divider>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item prop="blockwise.enable">
          <template #label>
            <FormItemLabel
              :label="tl('blockwiseEnable')"
              :desc="tl('blockwiseEnableDesc')"
              desc-marked
            />
          </template>
          <el-switch v-model="blockwiseValue.enable" />
        </el-form-item>
      </el-col>
      <el-col />
      <template v-if="blockwiseValue.enable">
        <el-col :span="12">
          <el-form-item :label="tl('maxBlockSize')">
            <el-select v-model="blockwiseValue.max_block_size">
              <el-option v-for="item in blockSizeOptions" :key="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxBodySize')">
            <InputWithUnit
              v-model="blockwiseValue.max_body_size"
              :default-unit="'MB'"
              :units="['KB', 'MB', 'GB']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('exchangeLifetime')">
            <TimeInputWithUnitSelect
              v-model="blockwiseValue.exchange_lifetime"
              :enabled-units="['s', 'm', 'h']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="blockwise.auto_tx_block1">
            <template #label>
              <FormItemLabel
                :label="tl('autoTxBlock1')"
                :desc="tl('autoTxBlock1Desc')"
                desc-marked
              />
            </template>
            <el-switch v-model="blockwiseValue.auto_tx_block1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="blockwise.auto_rx_block2">
            <template #label>
              <FormItemLabel
                :label="tl('autoRxBlock2')"
                :desc="tl('autoRxBlock2Desc')"
                desc-marked
              />
            </template>
            <el-switch v-model="blockwiseValue.auto_rx_block2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="blockwise.auto_tx_block2">
            <template #label>
              <FormItemLabel
                :label="tl('autoTxBlock2')"
                :desc="tl('autoTxBlock2Desc')"
                desc-marked
              />
            </template>
            <el-switch v-model="blockwiseValue.auto_tx_block2" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { BlockwiseConfig } from '@/types/typeAlias'

const blockwiseValue = defineModel<BlockwiseConfig>('modelValue', {
  required: true,
  default: () => ({}),
})

const blockSizeOptions = [16, 32, 64, 128, 256, 512, 1024]
const { tl } = useI18nTl('Gateway')
</script>
