<template>
  <!-- FIXME:title -->
  <el-dialog :title="tl('addListener')" v-model="showDialog">
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
      </el-row>
      <div class="part-header">{{ tl('listenerSetting') }}</div>
      <el-row :gutter="20">
        <el-col :span="12" v-if="listenerRecord.type !== 'udp'">
          <el-form-item :label="'Acceptors'">
            <el-input v-model="listenerRecord.acceptors" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxConn')">
            <el-input v-model="listenerRecord.max_connections" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxConnRate')">
            <el-input v-model="listenerRecord.max_conn_rate" />
          </el-form-item>
        </el-col>
        <template v-if="listenerRecord.type === 'tcp' || listenerRecord.type === 'ssl'">
          <el-col :span="12">
            <el-form-item :label="'Proxy Protocol'">
              <el-select v-model="listenerRecord.proxy_protocol">
                <el-option :value="true" />
                <el-option :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Proxy Protocol Timeout'">
              <el-input
                v-model.number="listenerRecord.proxy_protocol_timeout[0]"
                :placeholder="String(defaultListener.proxy_protocol_timeout[0])"
              >
                <template #append>
                  <el-select v-model="listenerRecord.proxy_protocol_timeout[1]">
                    <el-option value="s" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>

      <template v-if="listenerRecord.type === 'tcp' || listenerRecord.type === 'ssl'">
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
              <el-input
                v-model.number="listenerRecord.tcp.buffer[0]"
                :placeholder="String(defaultListener.tcp.buffer[0])"
              >
                <template #append>
                  <el-select v-model="listenerRecord.tcp.buffer[1]">
                    <el-option value="KB" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'TCP_NODELAY'">
              <el-select v-model="listenerRecord.tcp.nodelay">
                <el-option :value="true" />
                <el-option :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'SO_REUSEADDR'">
              <el-select v-model="listenerRecord.tcp.reuseaddr">
                <el-option :value="true" />
                <el-option :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('sendTimeout')">
              <el-input
                v-model.number="listenerRecord.tcp.send_timeout[0]"
                :placeholder="String(defaultListener.tcp.send_timeout[0])"
              >
                <template #append>
                  <el-select v-model="listenerRecord.tcp.send_timeout[1]">
                    <el-option value="s" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('sendTimeoutClose')">
              <el-select v-model="listenerRecord.tcp.send_timeout_close">
                <el-option :value="true" />
                <el-option :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-else-if="listenerRecord.type === 'udp' || listenerRecord.type === 'dtls'">
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
              <el-input
                v-model.number="listenerRecord.udp.buffer[0]"
                :placeholder="String(defaultListener.udp.buffer[0])"
              >
                <template #append>
                  <el-select v-model="listenerRecord.udp.buffer[1]">
                    <el-option value="KB" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('recBuf')">
              <el-input
                v-model.number="listenerRecord.udp.recbuf[0]"
                :placeholder="String(defaultListener.udp.recbuf[0])"
              >
                <template #append>
                  <el-select v-model="listenerRecord.udp.recbuf[1]">
                    <el-option value="KB" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="tl('sendBuf')">
              <el-input
                v-model.number="listenerRecord.udp.sndbuf[0]"
                :placeholder="String(defaultListener.udp.sndbuf[0])"
              >
                <template #append>
                  <el-select v-model="listenerRecord.udp.sndbuf[1]">
                    <el-option value="KB" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'SO_REUSEADDR'">
              <el-select v-model="listenerRecord.udp.reuseaddr">
                <el-option :value="true" />
                <el-option :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-if="listenerRecord.type === 'ssl' || listenerRecord.type === 'dtls'">
        <div class="part-header">
          {{ listenerRecord.type.toUpperCase() + ' ' + tl('configSetting') }}
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="'Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="defaultListener.certSpecial.certfile"
                v-model="listenerRecord[listenerRecord.type].certfile"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'CA Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="defaultListener.certSpecial.cacertfile"
                v-model="listenerRecord[listenerRecord.type].cacertfile"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'Key'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="defaultListener.certSpecial.keyfile"
                v-model="listenerRecord[listenerRecord.type].keyfile"
              />
            </el-form-item>
          </el-col>
          <template v-if="listenerRecord.type === 'ssl'">
            <el-col :span="12">
              <el-form-item :label="tl('sslversion')">
                <el-select v-model="listenerRecord.ssl.versions">
                  <el-option value="tlsv1.3,tlsv1.2,tlsv1.1,tlsv1" />
                  <el-option value="tlsv1.2,tlsv1.1,tlsv1" />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="listenerRecord.type === 'dtls'">
            <el-col :span="12">
              <el-form-item :label="tl('dtlsversion')">
                <el-select v-model="listenerRecord.dtls.versions">
                  <el-option value="dtlsv1.2,dtlsv1" />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item :label="'Verify'">
              <el-select v-model="listenerRecord.xtls.verify">
                <el-option value="verify_none" />
                <el-option value="verify_peer" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Fail If No Peer Cert'">
              <el-select v-model="listenerRecord.xtls.fail_if_no_peer_cert">
                <el-option :value="true" />
                <el-option :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Server Name Indacation'">
              <el-input v-model="listenerRecord.xtls.server_name_indication" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Intermediate Certificate Depth'">
              <el-input v-model="listenerRecord.xtls.depth" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'Key Password'">
              <el-input v-model="listenerRecord.xtls.password" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit" :loading="isSubmitting">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
      <el-button @click="showDialog = false">
        {{ $t('Base.cancel') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue'
import { ElDialog } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import { Listener } from '@/types/listener'
import { GatewayName } from '@/types/enum'
import useListenerDialog from '@/hooks/Config/useListenerDialog'

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

const {
  showDialog,
  isEdit,
  listenerRecord,
  listenerTypeOptList,
  defaultListener,
  isSubmitting,
  submit,
} = useListenerDialog(props, emit)
</script>
