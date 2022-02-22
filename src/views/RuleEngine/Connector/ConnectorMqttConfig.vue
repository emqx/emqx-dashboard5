<template>
  <div>
    <el-form label-position="top">
      <div class="form-sub-block">
        <div class="part-header">{{ tl('baseInfo') }}</div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="tl('connName')">
              <el-input
                v-model="connectorVal.name"
                :placeholder="connectorDefaultVal.name"
                :disabled="edit"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="form-sub-block">
        <div class="part-header">{{ tl('connParams') }}</div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="tl('brokerAddress')">
              <el-input v-model="connectorVal.server" :placeholder="connectorDefaultVal.server" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Clients.clientId')">
              <el-input
                v-model="connectorVal.clientid"
                :placeholder="connectorDefaultVal.clientid"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('username')">
              <el-input
                v-model="connectorVal.username"
                :placeholder="connectorDefaultVal.username"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('password')">
              <el-input
                type="password"
                autocomplete="new-password"
                v-model="connectorVal.password"
              />
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
            <el-form-item :label="'Clean Start'">
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
          <el-col :span="12">
            <el-form-item :label="tl('connMode')">
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
          <el-col :span="12">
            <el-form-item :label="tl('reconnectInterval')">
              <InputWithUnit v-model="connectorVal.reconnect_interval" :units="commonTimeUnits" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('retryInterval')">
              <InputWithUnit v-model="connectorVal.retry_interval" :units="commonTimeUnits" />
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

      <div class="part-header">{{ tl('tlsConfig') }}</div>
      <TLS-config class="tls-config-form" v-model="tlsParams" />
    </el-form>
  </div>
</template>

<script lang="ts">
import TLSConfig from '../components/TLSConfig.vue'
import { useI18n } from 'vue-i18n'
import { ref, Ref, reactive, computed, defineComponent, watch, onMounted } from 'vue'
// import { tlsConfig } from "@/types/ruleengine";
import _ from 'lodash'
import InputWithUnit from '@/components/InputWithUnit.vue'
import { commonTimeUnits } from '@/common/tools'

export default defineComponent({
  components: { TLSConfig, InputWithUnit },
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
    // const tlsParamsDefault = {
    //   enable: false,
    //   verify: false,
    //   certfile: "",
    //   keyfile: "",
    //   cacertfile: "",
    // };
    // const tlsParams: Ref<tlsConfig> = ref({ ..._.cloneDeep(tlsParamsDefault) });
    const tlsParams = computed(() => prop.tls)
    const modeOptions = ['cluster_shareload', 'cluster_singleton']

    const connectorDefaultVal = {
      name: '',
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
    const connectorVal = reactive({
      ..._.cloneDeep(connectorDefaultVal),
      ..._.cloneDeep({
        ...prop.modelValue,
        keepalive:
          (matchedKeepalive?.length && matchedKeepalive[1]) || connectorDefaultVal.keepalive,
      }),
    })

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
      return _.cloneDeep({
        ...obj,
        keepalive: obj.keepalive + 's',
      })
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
}
</style>
