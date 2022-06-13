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
                  <el-radio
                    class="bridge-type-item"
                    :label="item.valueForRadio"
                    border
                    :disabled="isBridgeTypeDisabled(item)"
                  >
                    <img
                      class="bridge-type-item-img"
                      height="64"
                      width="64"
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
              v-if="chosenBridgeType === BridgeType.Webhook"
              v-model:tls="tlsParams"
              v-model="bridgeData"
              ref="formCom"
            />
            <bridge-mqtt-config
              v-if="chosenBridgeType === BridgeType.MQTT"
              v-model="bridgeData"
              ref="formCom"
            />
          </template>
        </el-row>
        <el-row class="config-btn">
          <el-button v-if="stepActive === 0" @click="cancel">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button @click="goPreStep" v-if="stepActive > 0" :disabled="submitLoading">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button
            type="primary"
            @click="goNextStep"
            v-if="stepActive < 1"
            :disabled="submitLoading"
          >
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button
            v-if="stepActive === 1 && canTest"
            type="primary"
            plain
            :loading="isTesting"
            @click="testTheConnection"
          >
            {{ tl('testTheConnection') }}
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
import { ElMessageBox } from 'element-plus'
import { useBridgeTypeOptions, BridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType, MQTTBridgeDirection } from '@/types/enum'
import useI18nTl from '@/hooks/useI18nTl'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import DetailHeader from '@/components/DetailHeader.vue'
import useSSL from '@/hooks/useSSL'
import { checkNOmitFromObj, jumpToErrorFormItem } from '@/common/tools'
import useTestConnection from '@/hooks/Rule/bridge/useTestConnection'

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
    const bridgeData: Ref<any> = ref(createBridgeData())
    const tlsParams: Ref<tlsConfig> = ref(tlsParamsDefault)
    const { handleSSLDataBeforeSubmit } = useSSL()
    const { isTesting, canTest, testTheConnection } = useTestConnection(bridgeData)

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

    const isBridgeTypeDisabled = (bridgeType: BridgeTypeOptions) => {
      if (
        isFromRule.value &&
        bridgeType.externalConfig &&
        'direction' in bridgeType.externalConfig
      ) {
        return bridgeType.externalConfig.direction === MQTTBridgeDirection.In
      }
      return false
    }

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
      try {
        await formCom.value.validate()
      } catch (error) {
        jumpToErrorFormItem()
        return
      }
      submitLoading.value = true
      let res = undefined
      const dataToSubmit = {
        ..._.cloneDeep(bridgeData.value),
        type: chosenBridgeType.value,
      }
      try {
        switch (chosenBridgeType.value) {
          case BridgeType.Webhook:
            res = await createBridge(
              checkNOmitFromObj({
                ...dataToSubmit,
                ssl: handleSSLDataBeforeSubmit(tlsParams.value),
              }),
            )
            break
          case BridgeType.MQTT:
            if (dataToSubmit.connector?.type) {
              Reflect.deleteProperty(dataToSubmit.connector, 'type')
            }
            res = await createBridge(checkNOmitFromObj(handleBridgeDataBeforeSubmit(dataToSubmit)))
            break
        }
        const bridgeId = res.id
        if (!isFromRule.value) {
          ElMessageBox.confirm(tl('useBridgeCreateRule'), t('Base.createSuccess'), {
            confirmButtonText: tl('createRule'),
            cancelButtonText: tl('backBridgeList'),
            type: 'success',
          })
            .then(() => {
              router.push({ name: 'iot-create', query: { bridgeId } })
            })
            .catch(() => {
              router.push({ name: 'data-bridge' })
            })
        } else {
          router.push({ name: route.params.from as string, params: { bridgeId } })
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
      BridgeType,
      isBridgeTypeDisabled,
      cancel,
      submitCreateBridge,
      canTest,
      isTesting,
      testTheConnection,
    }
  },
})
</script>

<style lang="scss" scoped>
.config-btn {
  margin-top: 24px;
}

.el-radio.is-bordered {
  padding: 0 12px 0 2px;
  min-width: 40%;
  border: 2px solid var(--color-border-primary);
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
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 14px;
      color: var(--color-title-primary);
    }
    .bridge-type-desc {
      color: var(--color-title-primary);
      font-size: 12px;
      white-space: normal;
    }
    .bridge-type-item-bd {
      padding-left: 16px;
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
  margin-bottom: 24px;
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
