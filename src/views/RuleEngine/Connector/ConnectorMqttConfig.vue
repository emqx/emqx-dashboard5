<template>
  <div>
    <div class="form-sub-block">
      <div class="part-header">{{ tl('connParams') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('brokerAddress')">
            <el-input v-model="connectorVal.server" :placeholder="connectorDefaultVal.server" />
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
            <el-input
              v-model="connectorVal.keepalive"
              :placeholder="String(connectorDefaultVal.keepalive)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mqttVer')">
            <el-select v-model="connectorVal.proto_ver">
              <el-option v-for="ver in ['v3', 'v4', 'v5']" :key="ver" :value="ver" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('cleanStart')">
            <el-select v-model="connectorVal.clean_start">
              <el-option v-for="cs in [true, false]" :key="cs" :value="cs" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="form-sub-block">
      <div class="part-header">{{ tl('connSetting') }}</div>
      <el-row :gutter="30">
        <!-- <el-col :span="12">
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
        </el-col> -->
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
        <!-- <el-col :span="12">
          <el-form-item :label="tl('bridgeMode')">
            <el-select v-model="connectorVal.bridge_mode">
              <el-option
                v-for="bm in [true, false]"
                :key="bm"
                :value="bm"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
    </div>
    <CommonTLSConfig class="tls-config-form" v-model="tlsParams" />
  </div>
</template>

<script lang="ts">
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import { useI18n } from 'vue-i18n'
import { reactive, computed, defineComponent, watch, onMounted } from 'vue'
import _ from 'lodash'
import InputWithUnit from '@/components/InputWithUnit.vue'
import { commonTimeUnits } from '@/common/tools'
import { ConnectorItem } from '@/types/rule'

type ConnectorForm = Partial<ConnectorItem>

export default defineComponent({
  components: { InputWithUnit, CommonTLSConfig },
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    tls: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  setup(prop, context) {
    const { t } = useI18n()
    const tlsParams = computed(() => prop.tls)
    const modeOptions = ['cluster_shareload', 'cluster_singleton']

    const connectorDefaultVal = {
      server: 'public-mqtt-broker.emqx.com:1883',
      clientid: '',
      username: '',
      password: '',
      keepalive: 60,
      proto_ver: 'v4',
      clean_start: true,
      mode: modeOptions[0],
    }
    const matchedKeepalive = String(prop.modelValue.keepalive).match(/([\d]+)/)
    const connectorVal: ConnectorForm = reactive({
      ..._.cloneDeep(connectorDefaultVal),
      ..._.cloneDeep({
        ...prop.modelValue,
        keepalive:
          (matchedKeepalive?.length && matchedKeepalive[1]) || connectorDefaultVal.keepalive,
      }),
    }) as ConnectorForm

    watch(
      () => _.cloneDeep(connectorVal),
      (val) => {
        context.emit('update:modelValue', transformValue(val))
      },
    )

    // watch(
    //   () => _.cloneDeep(tlsParams.value),
    //   (val) => {
    //     context.emit("update:tls", _.cloneDeep(val));
    //   }
    // );

    onMounted(() => {
      context.emit('update:modelValue', transformValue(connectorVal))
    })

    const transformValue = (obj: Record<string, unknown>) => {
      let ret = _.cloneDeep(obj)
      ret.keepalive = ret.keepalive + 's'
      return ret
    }

    return {
      tl: (key: string) => t('RuleEngine.' + key),
      tlsParams,
      connectorVal,
      connectorDefaultVal,
      modeOptions,
      commonTimeUnits,
    }
  },
})
</script>

<style lang="scss" scoped>
.tls-config-form {
  margin-top: 20px;

  :deep(.TLS-base-config) .TLS-base-config-title {
    color: var(--el-text-color-regular);
    font-size: 16px;
  }
  :deep(.TLS-enable-config) {
    .TLS-input {
      width: 100%;
    }
  }
}
</style>
