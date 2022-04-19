<template>
  <div class="app-wrapper">
    <detail-header :item="{ name: tl('createBridge'), routeName: backRoute.name }" />
    <div class="data-bridge-create">
      <el-card class="app-card">
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
            <el-radio-group class="bridge-type-select" v-model="radioSelectedBridgeType">
              <el-row :gutter="28">
                <el-col v-for="item in bridgeTypeOptions" :key="item.label" :span="8">
                  <el-radio class="bridge-type-item" :label="item.valueForRadio" border>
                    <img
                      class="bridge-type-item-img"
                      height="52"
                      width="52"
                      :src="require(`@/assets/img/${item.value}.png`)"
                      :alt="item.label"
                    />
                    <div class="bridge-type-item-bd">
                      <div class="title">{{ item.label }}</div>
                      <span class="bridge-type-desc">{{ item.desc }}</span>
                    </div>
                  </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </template>
          <template v-if="stepActive === 1">
            <bridge-http-config
              v-if="chosenBridgeType === 'http'"
              v-model:tls="tlsParams"
              v-model="bridgeData"
              ref="formCom"
            />
            <bridge-mqtt-config
              v-if="chosenBridgeType === 'mqtt'"
              v-model="bridgeData"
              ref="formCom"
            />
          </template>
        </el-row>
        <el-row class="config-btn">
          <el-button v-if="stepActive === 0" @click="cancel">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="goNextStep"
            v-if="stepActive < 1"
            :disabled="submitLoading"
          >
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button @click="goPreStep" v-if="stepActive > 0" :disabled="submitLoading">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button
            type="primary"
            v-if="stepActive === 1"
            :loading="submitLoading"
            @click="submitCreateBridge"
          >
            {{ $t('Base.create') }}
          </el-button>
        </el-row>
        <div></div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BridgeHttpConfig from './BridgeHttpConfig.vue'
import BridgeMqttConfig from './BridgeMqttConfig.vue'
import { tlsConfig } from '@/types/ruleengine'
import { createBridge } from '@/api/ruleengine'
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage as M } from 'element-plus'
import { useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType } from '@/types/enum'
import useI18nTl from '@/hooks/useI18nTl'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import DetailHeader from '@/components/DetailHeader.vue'

export default defineComponent({
  components: { BridgeHttpConfig, BridgeMqttConfig, DetailHeader },
  setup() {
    const { tl } = useI18nTl('RuleEngine')

    const createBridgeData = () => ({
      local_topic: '',
    })

    const tlsParamsDefault: tlsConfig = {
      enable: false,
      verify: 'verify_none',
      certfile: '',
      keyfile: '',
      cacertfile: '',
    }
    const stepActive = ref(0)
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const { bridgeTypeOptions, getTrueTypeObjByRadioValue } = useBridgeTypeOptions()
    const radioSelectedBridgeType = ref(bridgeTypeOptions[0].valueForRadio)
    const chosenBridgeType = ref(bridgeTypeOptions[0].value)
    const submitLoading = ref(false)
    const bridgeData = ref(createBridgeData())
    const tlsParams: Ref<tlsConfig> = ref(tlsParamsDefault)

    const formCom = ref()

    const isFromRule = computed(() =>
      ['create-bridge-for-create-iot', 'create-bridge-for-edit-iot'].includes(route.name as string),
    )

    const backRoute = computed(() => {
      let name = 'data-bridge'
      if (isFromRule.value) {
        name = route.params.from.indexOf('detail') > -1 ? 'iot-detail' : 'iot-create'
      }
      return { name }
    })

    const { handleBridgeDataBeforeSubmit } = useBridgeDataHandler()

    const handleTypeSelected = () => {
      const type = getTrueTypeObjByRadioValue(radioSelectedBridgeType.value)
      if (!type) {
        return
      }
      chosenBridgeType.value = type.value
      if (type.externalConfig) {
        bridgeData.value = { ...bridgeData.value, ..._.cloneDeep(type.externalConfig) }
      }
    }

    const goPreStep = () => {
      stepActive.value -= 1
      bridgeData.value = createBridgeData()
    }

    const goNextStep = () => {
      if (stepActive.value === 0) {
        handleTypeSelected()
      }
      stepActive.value += 1
    }

    const cancel = () => {
      if (!isFromRule.value) {
        router.push({ name: 'data-bridge' })
      } else {
        router.push({ name: route.params.from as string })
      }
    }

    const submitCreateBridge = async () => {
      let res = undefined
      await formCom.value.validate()
      submitLoading.value = true

      try {
        switch (chosenBridgeType.value) {
          case BridgeType.HTTP:
            res = await createBridge({
              ...bridgeData.value,
              ssl: { ...tlsParams.value },
              type: chosenBridgeType.value,
            })
            break
          case BridgeType.MQTT:
            res = await createBridge(
              handleBridgeDataBeforeSubmit({
                ...bridgeData.value,
                type: chosenBridgeType.value,
              }),
            )
            break
        }
        M.success(t('Base.createSuccess'))

        if (!isFromRule.value) {
          router.push({ name: 'data-bridge' })
        } else {
          router.push({ name: route.params.from as string, params: { bridgeId: res.id } })
        }
      } catch (error) {
        console.error(error)
      } finally {
        submitLoading.value = false
      }
    }

    return {
      tl,
      backRoute,
      stepActive,
      goPreStep,
      goNextStep,
      bridgeTypeOptions,
      chosenBridgeType,
      radioSelectedBridgeType,
      submitLoading,
      tlsParams,
      bridgeData,
      formCom,
      cancel,
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
  padding: 0px 10px 0 8px;
  min-width: 40%;
  border: 2px solid #e4e4e4;
  margin-top: 16px;
  height: 100%;
  :deep(.el-radio__input) {
    display: none;
  }

  :deep(.el-radio__label) {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 0 0 52px;
    min-height: 52px;
    .title {
      margin-bottom: 4px;
      font-weight: bold;
      font-size: 14px;
      color: #000;
    }
    .bridge-type-desc {
      color: #0000007f;
      font-size: 12px;
      word-break: break-all;
      white-space: normal;
    }
    .bridge-type-item-bd {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
}

.config-body {
  flex-direction: column;
  margin-top: 30px;
  width: 70%;
}
.bridge-type-select {
  width: 100%;
}
.bridge-type-item {
  box-sizing: border-box;
  width: 100%;
}
.bridge-type-item-img {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
</style>
