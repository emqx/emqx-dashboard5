<template>
  <div>
    <div class="connector-mqtt-config form-sub-block">
      <!-- <div class="part-header">{{ tl('connParams') }}</div> -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('brokerAddress')" required :prop="getFormItemProp('server')">
            <el-input v-model="connectorVal.server" placeholder="broker.emqx.io:1883" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('username')">
            <el-input v-model="connectorVal.username" :placeholder="connectorDefaultVal.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('password')">
            <el-input type="password" autocomplete="new-password" v-model="connectorVal.password" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'Keep Alive'">
            <InputWithUnit
              v-model="connectorVal.keepalive"
              number-placeholder="60"
              :units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mqttVer')">
            <el-select v-model="connectorVal.proto_ver">
              <el-option
                v-for="{ label, value } in MQTT_VERSION_LIST"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('cleanStart')">
            <BooleanSelect v-model="connectorVal.clean_start" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('bridgeMode')">
            <BooleanSelect v-model="connectorVal.bridge_mode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('reconnectInterval')">
            <InputWithUnit
              v-model="connectorVal.reconnect_interval"
              :units="commonTimeUnits"
              default-unit="s"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('retryInterval')">
            <InputWithUnit
              v-model="connectorVal.retry_interval"
              :units="commonTimeUnits"
              default-unit="s"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="form-sub-block">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item>
            <template #label>
              <label>{{ tl('connMode') }}</label>
              <InfoTooltip>
                <template #content>
                  <span>{{ tl('connectionClusterModeDesc') }}</span>
                  <br />
                  <span>{{ tl('connectionNodeModeDesc') }}</span>
                </template>
              </InfoTooltip>
            </template>
            <el-select v-model="connectorVal.mode">
              <el-option
                v-for="cm in modeOptions"
                :key="cm"
                :value="cm"
                :label="tl(`mode_${cm}`)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div> -->
    <CommonTLSConfig class="tls-config-form" v-model="tlsParams" :is-edit="edit" />
  </div>
</template>

<script lang="ts">
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import { useI18n } from 'vue-i18n'
import { computed, defineComponent, onMounted, watch } from 'vue'
import { cloneDeep } from 'lodash'
import InputWithUnit from '@/components/InputWithUnit.vue'
import { commonTimeUnits } from '@/common/tools'
import BooleanSelect from '@/components/BooleanSelect.vue'
import { ConnectorType } from '@/types/enum'
import { MQTT_VERSION_LIST } from '@/common/constants.ts'

export default defineComponent({
  name: 'ConnectorMqttConfig',
  components: { InputWithUnit, CommonTLSConfig, BooleanSelect },
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    /**
     * for form rules
     */
    connectorField: {
      type: String,
    },
  },
  setup(prop, context) {
    const { t } = useI18n()
    const tlsParams = computed(() => prop.modelValue.ssl)
    const modeOptions = ['cluster_shareload', 'cluster_singleton']

    const connectorDefaultVal = {
      type: ConnectorType.MQTT,
      server: '',
      username: '',
      password: '',
      keepalive: '60s',
      proto_ver: 'v4',
      clean_start: true,
      bridge_mode: false,
      mode: modeOptions[0],
    }

    const connectorVal = computed({
      get() {
        return prop.modelValue
      },
      set(val) {
        context.emit('update:modelValue', val)
      },
    })

    watch(
      () => prop.modelValue,
      () => {
        initConnectorVal()
      },
    )

    const getFormItemProp = (rawProp: string) => {
      const { connectorField } = prop
      return connectorField ? `${connectorField}.${rawProp}` : rawProp
    }

    const initConnectorVal = () => {
      connectorVal.value = { ...cloneDeep(connectorDefaultVal), ...cloneDeep(prop.modelValue) }
    }

    onMounted(() => {
      initConnectorVal()
    })

    return {
      tl: (key: string) => t('RuleEngine.' + key),
      MQTT_VERSION_LIST,
      tlsParams,
      connectorVal,
      connectorDefaultVal,
      modeOptions,
      commonTimeUnits,
      getFormItemProp,
    }
  },
})
</script>

<style lang="scss" scoped>
.tls-config-form {
  :deep(.TLS-base-config) {
    margin-bottom: 0px;
  }
  :deep(.TLS-base-config) .TLS-base-config-title {
    font-size: 14px;
    font-weight: normal;
  }
  :deep(.TLS-enable-config) {
    .TLS-input {
      width: 100%;
    }
  }
}
</style>
