<template>
  <el-dialog
    v-bind="$attrs"
    :title="$t('Clients.addASubscription')"
    width="400px"
    v-model="dialogVisible"
    @close="close"
    @open="open"
  >
    <el-form ref="record" :model="record" :rules="rules" label-position="top">
      <el-form-item v-if="!clientId" prop="clientid" label="Client ID">
        <el-input v-model="record.clientid" placeholder="Client ID"></el-input>
      </el-form-item>
      <el-form-item prop="topic" label="Topic">
        <el-input v-model="record.topic" placeholder="Topic"></el-input>
      </el-form-item>
      <!-- For stomp gateway -->
      <el-form-item
        v-if="gateway && gateway === 'stomp'"
        prop="subid"
        :label="`${$t('Tools.Subscription')} ID`"
      >
        <el-input v-model="record.subid"></el-input>
      </el-form-item>
      <el-form-item prop="qos" label="QoS">
        <el-select v-model.number="record.qos">
          <el-option v-for="item in QoSOptions" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="isMQTTVersion5">
        <el-form-item prop="nl" :label="tl('noLocal')">
          <el-select v-model="record.nl">
            <el-option
              v-for="{ value, label } in noLocalOpts"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="rap" :label="tl('retainAsPublished')">
          <el-select v-model="record.rap">
            <el-option
              v-for="{ value, label } in retainAsPublishedOpts"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="rh" :label="tl('retainHandling')">
          <el-select v-model="record.rh">
            <el-option v-for="item in retainHandlingOpts" :label="item" :value="item" :key="item" />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="close">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="handleAdd" :loading="submitLoading">
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { subscribe } from '@/api/clients'
import { addGatewayClientSubs } from '@/api/gateway'
import { QoSOptions } from '@/common/constants'
import useMQTTVersion5NewConfig from '@/hooks/useMQTTVersion5NewConfig.ts'
import useI18nTl from '@/hooks/useI18nTl.ts'
import { omit } from 'lodash'

export default {
  name: 'CreateSubscribe',

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    clientId: {
      type: String,
      default: '',
    },
    gateway: {
      type: String,
      required: false,
      default: '',
    },
    isMQTTVersion5: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      QoSOptions,
      record: {
        clientid: this.clientid,
        qos: 0,
        topic: '',
        nl: 0,
        rap: 0,
        rh: 0,
      },
      rules: {
        clientid: {
          required: true,
          message: this.$t('Clients.pleaseEnter'),
        },
        topic: {
          required: true,
          message: this.$t('Clients.pleaseEnter'),
        },
        subid: {
          required: true,
          message: this.$t('Clients.pleaseEnter'),
        },
      },
      submitLoading: false,
    }
  },
  computed: {
    dialogVisible: function () {
      return this.visible
    },
  },
  emits: ['create:subs', 'update:visible'],
  methods: {
    open() {
      this.record.clientid = this.clientId
    },
    getTopicMsg() {
      if (this.isMQTTVersion5) {
        return omit(this.record, 'clientid')
      }
      return {
        qos: this.record.qos,
        topic: this.record.topic,
      }
    },
    async handleAdd() {
      try {
        await this.$refs.record.validate()
        if (this.gateway) {
          return this.addGatewaySubs()
        }
        this.submitLoading = true
        let clientId = this.clientId || this.record.clientid
        await subscribe(clientId, this.getTopicMsg())
        this.$emit('create:subs')
        this.close()
      } catch (error) {
        //
      } finally {
        this.submitLoading = false
      }
    },
    async addGatewaySubs() {
      this.submitLoading = true
      let clientId = this.clientId || this.record.clientid
      const data = {
        topic: this.record.topic,
        qos: this.record.qos,
      }
      if (this.record.subid && this.gateway && this.gateway === 'stomp') {
        data.sub_props = {
          subid: this.record.subid,
        }
      }
      const res = await addGatewayClientSubs(this.gateway, clientId, data).catch(() => {})
      this.submitLoading = false
      if (res) {
        this.$emit('create:subs')
        this.close()
      }
    },
    close() {
      this.$emit('update:visible', false)
      this.$refs.record.resetFields()
    },
  },
  setup(ctx) {
    const { tl } = useI18nTl('Clients')
    const { noLocalOpts, retainAsPublishedOpts, retainHandlingOpts } = useMQTTVersion5NewConfig()
    return {
      tl,
      noLocalOpts,
      retainAsPublishedOpts,
      retainHandlingOpts,
    }
  },
}
</script>

<style lang="scss">
.create-subscribe {
  .el-select,
  .el-input {
    width: 100%;
  }
}
</style>
