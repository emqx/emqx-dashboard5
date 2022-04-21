<template>
  <el-dialog :title="tl(isEdit ? 'editListener' : 'addListener')" v-model="showDialog">
    <div class="part-header">{{ tl('basic') }}</div>
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="tl('name')">
            <el-input v-model="listenerRecord.name" :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('lType')">
            <el-select v-model="listenerRecord.type" :disabled="isEdit">
              <el-option v-for="item in listenerTypeOptList" :key="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('lAddress')">
            <el-input v-model="listenerRecord.bind" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="listenerRecord.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!gatewayName">
          <el-form-item label="Zone">
            <ZoneSelect v-model="listenerRecord.zone" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('listenerSetting') }}</div>
      <el-row :gutter="20">
        <el-col :span="12" v-if="!isUDP">
          <el-form-item :label="'Acceptors'">
            <el-input v-model="listenerRecord.acceptors" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxConn')">
            <el-input v-model="listenerRecord.max_connections" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="gatewayName">
          <el-form-item :label="tl('maxConnRate')">
            <el-input v-model="listenerRecord.max_conn_rate" />
          </el-form-item>
        </el-col>
        <template v-if="showProxyProtocolConfig">
          <el-col :span="12">
            <el-form-item :label="'Proxy Protocol'">
              <BooleanSelect v-model="listenerRecord.proxy_protocol" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Proxy Protocol Timeout'">
              <InputWithUnit
                v-model="listenerRecord.proxy_protocol_timeout"
                number-placeholder="15"
                :units="['s']"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <!-- TCP Config -->
      <div v-if="showTCPConfig">
        <div class="part-header">
          {{ 'TCP ' + tl('configSetting') }}
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="'ActiveN'">
              <el-input
                v-model="listenerRecord.tcp.active_n"
                :placeholder="String(defaultListener.tcp.active_n)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Buffer'">
              <InputWithUnit
                v-model="listenerRecord.tcp.buffer"
                number-placeholder="4"
                :units="['KB']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'TCP_NODELAY'">
              <BooleanSelect v-model="listenerRecord.tcp.nodelay" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'SO_REUSEADDR'">
              <BooleanSelect v-model="listenerRecord.tcp.reuseaddr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('sendTimeout')">
              <InputWithUnit
                v-model="listenerRecord.tcp.send_timeout"
                number-placeholder="15"
                :units="['s']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('sendTimeoutClose')">
              <BooleanSelect v-model="listenerRecord.tcp.send_timeout_close" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- UDP -->
      <div v-else-if="showUDPConfig">
        <div class="part-header">
          {{ 'UDP ' + tl('configSetting') }}
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="'ActiveN'">
              <el-input
                v-model="listenerRecord.udp.active_n"
                :placeholder="String(defaultListener.udp.active_n)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Buffer'">
              <InputWithUnit
                v-model="listenerRecord.udp.buffer"
                number-placeholder="4"
                :units="['KB']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('recBuf')">
              <InputWithUnit
                v-model="listenerRecord.udp.recbuf"
                number-placeholder="2"
                :units="['KB']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('sendBuf')">
              <InputWithUnit
                v-model="listenerRecord.udp.sndbuf"
                number-placeholder="2"
                :units="['KB']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'SO_REUSEADDR'">
              <BooleanSelect v-model="listenerRecord.udp.reuseaddr" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- (like)SSL Config -->
      <div v-if="showSSLConfig">
        <div class="part-header">{{ `${isDTLS ? 'DTLS' : 'SSL'} ${tl('configSetting')}` }}</div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="'Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="certPlaceholder.certfile"
                v-model="listenerRecord[SSLConfigKey].certfile"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'CA Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="certPlaceholder.cacertfile"
                v-model="listenerRecord[SSLConfigKey].cacertfile"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'Key'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="certPlaceholder.keyfile"
                v-model="listenerRecord[SSLConfigKey].keyfile"
              />
            </el-form-item>
          </el-col>
          <!-- Version of SSL/DTLS -->
          <el-col :span="12" v-if="isDTLS">
            <el-form-item :label="tl('dtlsversion')">
              <DTLSVersionSelect v-model="listenerRecord.dtls.versions" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item :label="tl('sslversion')">
              <SSLVersionSelect v-model="listenerRecord.ssl.versions" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="'Verify'">
              <el-select v-model="listenerRecord[SSLConfigKey].verify">
                <el-option value="verify_none" />
                <el-option value="verify_peer" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Fail If No Peer Cert'">
              <BooleanSelect v-model="listenerRecord[SSLConfigKey].fail_if_no_peer_cert" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Intermediate Certificate Depth'">
              <el-input v-model="listenerRecord[SSLConfigKey].depth" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Key Password'">
              <el-input v-model="listenerRecord[SSLConfigKey].password" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="showWSConfig">
        <div class="part-header">{{ `WebSocket ${tl('configSetting')}` }}</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="MQTT path">
              <el-input
                v-model="listenerRecord.websocket.mqtt_path"
                placeholder="ws://{ip}:{port}/mqtt"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button type="primary" @click="submit" :loading="isSubmitting">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType, computed } from 'vue'
import { ElDialog } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import { Listener } from '@/types/listener'
import { GatewayName, ListenerType, ListenerTypeForGateway } from '@/types/enum'
import useListenerDialog from '@/hooks/Config/useListenerDialog'
import BooleanSelect from '@/components/BooleanSelect.vue'
import SSLVersionSelect from './SSLVersionSelect.vue'
import DTLSVersionSelect from './DTLSVersionSelect.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import ZoneSelect from '../ZoneSelect.vue'

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
const emit = defineEmits(['update:modelValue', 'submit', 'submitted'])

const { tl } = useI18nTl('Gateway')

const certPlaceholder = {
  cacertfile: 'Begins with ----BEGIN CERTIFICATE----',
  certfile: 'Begins with ----BEGIN CERTIFICATE----',
  keyfile: 'Begins with ----BEGIN PRIVATE KEY----',
}

const {
  showDialog,
  isEdit,
  listenerRecord,
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
  submit,
} = useListenerDialog(props, emit)

const isUDP = computed(
  () =>
    listenerRecord.value.type === ListenerType.QUIC ||
    listenerRecord.value.type === ListenerTypeForGateway.UDP,
)
</script>
