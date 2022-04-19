<template>
  <div class="app-wrapper">
    <div class="data-bridge-create">
      <div class="page-header-title">
        {{ tl('createConnector') }}
      </div>
      <el-row>
        <el-col :span="12">
          <el-steps :active="stepActive" finish-status="success">
            <el-step :title="tl('connectorType')"> </el-step>
            <el-step :title="tl('configuration')"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row class="config-body">
        <template v-if="stepActive === 0">
          <div class="part-header">
            {{ tl('chooseConnectorType') }}
          </div>
          <el-row>
            <el-col :span="24">
              <el-radio-group v-model="chosenConnectorType">
                <el-radio v-for="item in connectorType" :key="item" :label="item" border>
                  <img
                    height="80"
                    width="80"
                    :src="require(`@/assets/img/${item}.png`)"
                    :alt="item"
                  />
                  <div>
                    <div class="title">{{ String(item).toUpperCase() }}</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </template>
        <template v-if="stepActive === 1">
          <connector-mqtt-config
            v-model="connectorData"
            v-model:tls="connectorTLS"
          ></connector-mqtt-config>
        </template>
      </el-row>
      <el-row class="config-btn">
        <el-button v-if="stepActive === 0" @click="$router.push({ name: 'bridge-connector' })">{{
          $t('Base.cancel')
        }}</el-button>
        <el-button
          type="primary"
          v-if="stepActive === 1"
          :loading="submitLoading"
          @click="submitCreateConnector"
          >{{ $t('Base.create') }}</el-button
        >
        <el-button
          type="primary"
          @click="++stepActive"
          v-if="stepActive < 1"
          :disabled="submitLoading"
          >{{ $t('Base.nextStep') }}</el-button
        >
        <el-button @click="--stepActive" v-if="stepActive > 0" :disabled="submitLoading">{{
          $t('Base.backStep')
        }}</el-button>
      </el-row>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ConnectorMqttConfig from './ConnectorMqttConfig.vue'
import { createConnector } from '@/api/ruleengine'
import { useRouter } from 'vue-router'
import { tlsConfig } from '@/types/ruleengine'
import { ElMessage as M } from 'element-plus'

export default defineComponent({
  components: { ConnectorMqttConfig },
  setup() {
    const tlsParamsDefault: tlsConfig = {
      enable: false,
      verify: 'verify_none',
      certfile: '',
      keyfile: '',
      cacertfile: '',
    }
    const router = useRouter()
    const stepActive = ref(0)
    const { t } = useI18n()
    const connectorType = ['mqtt']
    const chosenConnectorType = ref(connectorType[0])
    const submitLoading = ref(false)
    const connectorData = ref({})
    const connectorTLS: Ref<tlsConfig> = ref(tlsParamsDefault)

    const submitCreateConnector = async () => {
      submitLoading.value = true
      try {
        await createConnector({
          ...connectorData.value,
          type: chosenConnectorType.value,
          ssl: { ...connectorTLS.value },
        })
        M.success(t('Base.createSuccess'))
      } catch (error) {
        console.error(error)
      } finally {
        submitLoading.value = false
        router.push({ name: 'bridge-connector' })
      }
    }

    return {
      tl: (key: string) => t('RuleEngine.' + key),
      stepActive,
      connectorType,
      chosenConnectorType,
      submitLoading,
      connectorData,
      connectorTLS,
      submitCreateConnector,
    }
  },
})
</script>

<style lang="scss" scoped>
.config-btn {
  margin-top: 50px;
}

.el-radio.is-bordered {
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
</style>
