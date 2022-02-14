<template>
  <div class="data-bridge-create">
    <!-- <back-button back-url="/bridge">
      {{ tl('backDataBridge') }}
    </back-button> -->
    <div class="page-header-title">
      {{ tl('createBridge') }}
    </div>

    <el-row>
      <el-col :span="12">
        <el-steps :active="stepActive" finish-status="success">
          <el-step :title="tl('bridgeType')"> </el-step>
          <el-step :title="tl('configuration')"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row class="config-body">
      <template v-if="stepActive === 0">
        <div class="part-header">
          {{ tl('chooseBridgeType') }}
        </div>
        <el-row>
          <el-col :span="24">
            <el-radio-group class="bridge-type-select" v-model="chosenBridgeType">
              <el-radio v-for="item in bridgeType" :key="item" :label="item" border>
                <img
                  height="80"
                  width="80"
                  :src="require(`@/assets/img/${item}.png`)"
                  :alt="item"
                />
                <div>
                  <div class="title">{{ String(item).toUpperCase() }}</div>
                  <div>{{ tl(`bridgeDesc${String(item).toUpperCase()}`) }}</div>
                </div>
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </template>
      <template v-if="stepActive === 1">
        <bridge-http-config
          v-if="chosenBridgeType === 'http'"
          v-model:tls="tlsParams"
          v-model="bridgeData"
        ></bridge-http-config>
        <bridge-mqtt-config
          v-if="chosenBridgeType === 'mqtt'"
          v-model="bridgeData"
        ></bridge-mqtt-config>
      </template>
    </el-row>
    <el-row class="config-btn">
      <el-button
        size="small"
        type="primary"
        v-if="stepActive === 1"
        :loading="submitLoading"
        @click="submitCreateBridge"
        >{{ $t('Base.create') }}</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="++stepActive"
        v-if="stepActive < 1"
        :disabled="submitLoading"
        >{{ $t('Base.nextStep') }}</el-button
      >
      <el-button
        size="small"
        @click="--stepActive"
        v-if="stepActive > 0"
        :disabled="submitLoading"
        >{{ $t('Base.backStep') }}</el-button
      >
      <el-button
        size="small"
        v-if="stepActive === 0"
        @click="$router.push({ name: 'data-bridge' })"
        >{{ $t('Base.cancel') }}</el-button
      >
    </el-row>
    <div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BridgeHttpConfig from './BridgeHttpConfig.vue'
import BridgeMqttConfig from './BridgeMqttConfig.vue'
import { tlsConfig } from '@/types/ruleengine'
import { createBridge } from '@/api/ruleengine'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { ElMessage as M } from 'element-plus'

export default defineComponent({
  components: { BridgeHttpConfig, BridgeMqttConfig },
  setup() {
    const tlsParamsDefault: tlsConfig = {
      enable: false,
      verify: 'verify_none',
      certfile: '',
      keyfile: '',
      cacertfile: '',
    }
    const stepActive = ref(0)
    const router = useRouter()
    const { t } = useI18n()
    const bridgeType = ['http', 'mqtt']
    const chosenBridgeType = ref(bridgeType[0])
    const submitLoading = ref(false)
    const bridgeData = ref({})
    const tlsParams: Ref<tlsConfig> = ref(tlsParamsDefault)

    // watch(
    //   () => [_.cloneDeep(bridgeData.value), _.cloneDeep(tlsParams.value)],
    //   (val) => {
    //     console.log(val);
    //   }
    // );

    const submitCreateBridge = async () => {
      let res
      submitLoading.value = true
      switch (chosenBridgeType.value) {
        case bridgeType[0]:
          res = await createBridge({
            ...bridgeData.value,
            ssl: { ...tlsParams.value },
            type: chosenBridgeType.value,
          }).catch(() => {})
          break
        case bridgeType[1]:
          res = await createBridge({
            ...bridgeData.value,
            type: chosenBridgeType.value,
          }).catch(() => {})
          break
      }

      if (res) {
        M({
          type: 'success',
          message: t('Base.createSuccess'),
        })
        router.push({ name: 'data-bridge' })
      }
      submitLoading.value = false
    }

    return {
      tl: (key: string) => t('RuleEngine.' + key),
      stepActive,
      bridgeType,
      chosenBridgeType,
      submitLoading,
      tlsParams,
      bridgeData,
      submitCreateBridge,
    }
  },
})
</script>

<style lang="scss" scoped>
.config-btn {
  margin-top: 50px;
}

.el-radio.is-bordered {
  border-radius: 0px;
  padding: 0px 10px;
  min-width: 40%;
  border: 2px solid #e4e4e4;
  margin-top: 16px;
  height: unset;
  :deep(.el-radio__input) {
    display: none;
  }

  :deep(.el-radio__label) {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0px;
    height: 100%;
    color: #0000007f;
    .title {
      font-weight: bold;
      font-size: 14px;
      color: #000;
    }
  }
}

.config-body {
  flex-direction: column;
  margin-top: 30px;
  width: 70%;
}

.bridge-type-select {
  display: flex;
}
</style>
