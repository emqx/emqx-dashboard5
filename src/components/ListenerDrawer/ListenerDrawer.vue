<template>
  <el-drawer
    :title="tl(props.listener ? 'editListener' : 'addListener')"
    v-model="showDialog"
    :lock-scroll="false"
    :close-on-click-modal="false"
    size="50%"
    :z-index="1999"
    class="listener-drawer"
    destroy-on-close
  >
    <el-form
      label-position="top"
      require-asterisk-position="right"
      :rules="listenerFormRules"
      :model="listenerRecord"
      :validate-on-rule-change="false"
      ref="formCom"
      v-loading="isLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="tl('name')" prop="name" required>
            <el-input v-model="listenerRecord.name" :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('lType')" prop="type" required>
            <el-select v-model="listenerRecord.type" :disabled="isEdit">
              <el-option v-for="item in listenerTypeOptList" :key="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('lAddress')" prop="bind" required>
            <el-input v-model="listenerRecord.bind" />
          </el-form-item>
        </el-col>
        <el-col :span="24"><el-divider /></el-col>
      </el-row>
      <el-row v-if="showWSConfig && !gatewayName" :gutter="20">
        <el-col :span="12">
          <el-form-item label="MQTT Path">
            <template #label>
              <FormItemLabel label="MQTT Path" :desc="$t('BasicConfig.mqttPath')" desc-marked />
            </template>
            <el-input v-model="listenerRecord.websocket.mqtt_path" placeholder="/mqtt" />
          </el-form-item>
        </el-col>
        <el-col :span="24"><el-divider /></el-col>
      </el-row>
      <el-row v-else-if="showWSConfig && gatewayName" :gutter="20">
        <el-col :span="12">
          <el-form-item label="Path">
            <el-input
              v-model="listenerRecord.websocket.path"
              :placeholder="gatewayName === GatewayName.OCPP ? '/ocpp' : ''"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24"><el-divider /></el-col>
      </el-row>
      <!-- Listener Config -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="tl('maxConn')" prop="max_connections">
            <Oneof
              class="in-one-row"
              v-model="listenerRecord.max_connections"
              :items="[{ type: 'number' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="gatewayName">
          <el-form-item :label="tl('maxConnRate')" prop="max_conn_rate">
            <CustomInputNumber v-model.number="listenerRecord.max_conn_rate" />
          </el-form-item>
        </el-col>
        <template v-if="showProxyProtocolConfig">
          <el-col :span="12">
            <el-form-item :label="$t('BasicConfig.proxyProtocol')">
              <BooleanSelect v-model="listenerRecord.proxy_protocol" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('BasicConfig.proxyProtocolTimeout')">
              <TimeInputWithUnitSelect
                v-model="listenerRecord.proxy_protocol_timeout"
                number-placeholder="15"
                :enabled-units="['s']"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <!-- (like)SSL Config -->
      <div v-if="showSSLConfig">
        <el-row :gutter="20">
          <el-col :span="24"><el-divider /></el-col>
          <el-col :span="24">
            <!-- v-if is for refresh -->
            <TLSEnableConfig
              v-if="showDialog && !isLoading"
              class="TLS-config"
              v-model="listenerRecord[SSLConfigKey]"
              :show-sni="false"
              :is-edit="isEdit"
              :base-path="SSLConfigKey"
              :verify-label="t('Base.tlsVerifyClient')"
              @verify-change="handleTLSVerifyChange"
            />
          </el-col>
          <template v-if="!isQUIC && listenerRecord[SSLConfigKey].verify !== 'verify_none'">
            <el-col :span="12">
              <el-form-item :label="tl('failIfNoPeerCert')">
                <BooleanSelect v-model="listenerRecord[SSLConfigKey].fail_if_no_peer_cert" />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </div>
      <!-- Rate Limiter -->
      <el-row :gutter="20" v-if="!gatewayName">
        <el-col :span="24"><el-divider /></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('showLimiter')"> </el-form-item>
        </el-col>
        <el-col :span="12" />
        <el-col v-if="!typesWithoutMaxConnectionRate.includes(listenerRecord.type)" :span="12">
          <el-form-item :label="t('Gateway.maxConnRate')" prop="max_conn_rate">
            <InputWithUnit
              v-model="listenerRecord.max_conn_rate"
              :units="[{ label: `/${t('Base.second')}`, value: '/s' }]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('Gateway.maxMsgPubRate')" prop="messages_rate">
            <InputWithUnit
              v-model="listenerRecord.messages_rate"
              :units="[{ label: `/${t('Base.second')}`, value: '/s' }]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('Gateway.maxMsgPubTraffic')" prop="bytes_rate">
            <InputWithUnit
              v-model="listenerRecord.bytes_rate"
              :units="[
                { label: `MB/${t('Base.second')}`, value: 'MB/s' },
                { label: `KB/${t('Base.second')}`, value: 'KB/s' },
              ]"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- Advanced Settings -->
      <advanced-setting-container>
        <div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="tl('mountPoint')">
                <el-input v-model="listenerRecord.mountpoint" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!isUDP">
              <el-form-item :label="$t('BasicConfig.acceptors')" prop="acceptors">
                <CustomInputNumber v-model="listenerRecord.acceptors" />
              </el-form-item>
            </el-col>
            <!-- SSL -->
            <template v-if="showSSLConfig">
              <el-col :span="24"><el-divider /></el-col>
              <template v-if="isDTLS">
                <el-col :span="12">
                  <el-form-item :label="tl('dtlsversion')">
                    <DTLSVersionSelect v-model="listenerRecord.dtls_options.versions" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template #label>
                      <form-item-label
                        :label="tl('ciphers')"
                        :desc="tl('ciphersDesc')"
                        desc-marked
                      />
                    </template>
                    <array-editor-input v-model="listenerRecord.dtls_options.ciphers" />
                  </el-form-item>
                </el-col>
              </template>
              <template v-else-if="!isQUIC">
                <el-col :span="12">
                  <el-form-item :label="tl('sslversion')">
                    <SSLVersionSelect v-model="listenerRecord.ssl_options.versions" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template #label>
                      <form-item-label
                        :label="tl('ciphers')"
                        :desc="tl('ciphersDesc')"
                        desc-marked
                      />
                    </template>
                    <array-editor-input v-model="listenerRecord.ssl_options.ciphers" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="tl('SSLdepth')">
                    <el-input v-model.number="listenerRecord[SSLConfigKey].depth" />
                  </el-form-item>
                </el-col>
              </template>
              <el-col :span="12">
                <el-form-item :label="tl('SSLPassword')">
                  <el-input
                    v-model="listenerRecord[SSLConfigKey].password"
                    type="password"
                    autocomplete="one-time-code"
                    show-password
                  />
                </el-form-item>
              </el-col>
              <!-- OCSP -->
              <template v-if="!gatewayName && !isWSS && !isQUIC">
                <el-col :span="24">
                  <el-form-item :label="tl('enableOcspStapling')">
                    <el-switch v-model="listenerRecord.ssl_options.ocsp.enable_ocsp_stapling" />
                  </el-form-item>
                </el-col>
                <template v-if="listenerRecord.ssl_options.ocsp.enable_ocsp_stapling">
                  <el-col :span="24">
                    <el-form-item :label="tl('responderUrl')" prop="ssl_options.ocsp.responder_url">
                      <el-input v-model="listenerRecord.ssl_options.ocsp.responder_url" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="tl('issuerPem')" prop="ssl_options.ocsp.issuer_pem">
                      <CertFileInput
                        v-model="listenerRecord.ssl_options.ocsp.issuer_pem"
                        :is-edit="isEdit"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="tl('refreshInterval')">
                      <TimeInputWithUnitSelect
                        v-model="listenerRecord.ssl_options.ocsp.refresh_interval"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="tl('refreshHttpTimeout')">
                      <TimeInputWithUnitSelect
                        v-model="listenerRecord.ssl_options.ocsp.refresh_http_timeout"
                      />
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="12">
                  <el-form-item :label="tl('enableCrlCheck')">
                    <el-switch v-model="listenerRecord.ssl_options.enable_crl_check" />
                  </el-form-item>
                </el-col>
              </template>
            </template>
            <!-- TCP -->
            <template v-if="showTCPConfig">
              <el-col :span="24"><el-divider /></el-col>
              <el-col :span="12">
                <el-form-item label="ActiveN">
                  <CustomInputNumber
                    v-model.number="listenerRecord.tcp_options.active_n"
                    :placeholder="String(defaultListener.tcp_options.active_n)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'Buffer'">
                  <InputWithUnit
                    v-model="listenerRecord.tcp_options.buffer"
                    number-placeholder="4"
                    :units="['KB']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'TCP_NODELAY'">
                  <BooleanSelect v-model="listenerRecord.tcp_options.nodelay" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'SO_REUSEADDR'">
                  <BooleanSelect v-model="listenerRecord.tcp_options.reuseaddr" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="tl('sendTimeout')">
                  <TimeInputWithUnitSelect
                    v-model="listenerRecord.tcp_options.send_timeout"
                    number-placeholder="15"
                    :enabled-units="['s']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="tl('sendTimeoutClose')">
                  <BooleanSelect v-model="listenerRecord.tcp_options.send_timeout_close" />
                </el-form-item>
              </el-col>
            </template>
            <!-- UDP -->
            <template v-if="showUDPConfig">
              <el-col :span="24"><el-divider /></el-col>
              <el-col :span="12">
                <el-form-item :label="'ActiveN'">
                  <el-input
                    v-model="listenerRecord.udp_options.active_n"
                    :placeholder="String(defaultListener.udp_options.active_n)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'Buffer'">
                  <InputWithUnit
                    v-model="listenerRecord.udp_options.buffer"
                    number-placeholder="4"
                    :units="['KB']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="tl('recBuf')">
                  <InputWithUnit
                    v-model="listenerRecord.udp_options.recbuf"
                    number-placeholder="2"
                    :units="['KB']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="tl('sendBuf')">
                  <InputWithUnit
                    v-model="listenerRecord.udp_options.sndbuf"
                    number-placeholder="2"
                    :units="['KB']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'SO_REUSEADDR'">
                  <BooleanSelect v-model="listenerRecord.udp_options.reuseaddr" />
                </el-form-item>
              </el-col>
            </template>
            <!-- Custome Configs -->
            <template v-if="!gatewayName && !isQUIC">
              <el-col :span="24"><el-divider /></el-col>
              <el-col :span="24">
                <custom-configs
                  ref="customConfig"
                  :type="listenerRecord.type"
                  v-model="listenerCustomConfigs"
                />
              </el-col>
            </template>
          </el-row>
        </div>
      </advanced-setting-container>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button
        v-if="canBeDeleted"
        type="danger"
        :disabled="!$hasPermission('delete')"
        plain
        @click="onDelete"
      >
        {{ $t('Base.delete') }}
      </el-button>
      <el-button
        type="primary"
        :disabled="!$hasPermission('post')"
        @click="submit"
        :loading="isSubmitting"
      >
        {{ props.listener ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { INFINITY_VALUE } from '@/common/constants'
import BooleanSelect from '@/components/BooleanSelect.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import CertFileInput from '@/components/TLSConfig/CertFileInput.vue'
import TLSEnableConfig from '@/components/TLSConfig/TLSEnableConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import useListenerDrawer from '@/hooks/Config/useListenerDrawer'
import useI18nTl from '@/hooks/useI18nTl'
import { GatewayName, ListenerType, ListenerTypeForGateway } from '@/types/enum'
import { Listener } from '@/types/listener'
import { PropType, computed, defineEmits, defineProps } from 'vue'
import ArrayEditorInput from '../ArrayEditorInput.vue'
import CustomInputNumber from '../CustomInputNumber.vue'
import DTLSVersionSelect from './DTLSVersionSelect.vue'
import SSLVersionSelect from './SSLVersionSelect.vue'
import CustomConfigs from './CustomConfigs.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  listener: {
    type: Object as PropType<Listener>,
  },
  gatewayName: {
    type: String as PropType<GatewayName>,
  },
  /**
   * when the dialog use in create gateway, the listener data handle by gateway
   */
  doNotSubmitToBackend: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'submit', 'submitted', 'delete'])

const { tl, t } = useI18nTl('Gateway')

const {
  showDialog,
  isEdit,
  canBeDeleted,
  isLoading,
  listenerRecord,
  listenerCustomConfigs,
  formCom,
  customConfig,
  listenerTypeOptList,
  defaultListener,
  isSubmitting,
  showProxyProtocolConfig,
  showTCPConfig,
  showUDPConfig,
  showSSLConfig,
  isDTLS,
  SSLConfigKey,
  showWSConfig,
  listenerFormRules,
  submit,
  onDelete,
  handleTLSVerifyChange,
} = useListenerDrawer(props, emit)

const isUDP = computed(() => listenerRecord.value.type === ListenerTypeForGateway.UDP)

const isQUIC = computed(() => listenerRecord.value.type === ListenerType.QUIC)

const isWSS = computed(() => listenerRecord.value.type === ListenerType.WSS)

const typesWithoutMaxConnectionRate = [ListenerType.WS, ListenerType.WSS, ListenerType.QUIC]
</script>

<style lang="scss">
.listener-drawer {
  .TLS-config {
    .TLS-input {
      width: 100%;
    }
  }
}
</style>
