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
      <el-form-item prop="qos" label="QoS">
        <el-select v-model.number="record.qos">
          <el-option v-for="item in QoSOptions" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
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
  },

  data() {
    return {
      QoSOptions,
      record: {
        clientid: this.clientid,
        qos: 0,
        topic: '',
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
    async handleAdd() {
      const valid = await this.$refs.record.validate().catch(() => {})
      if (!valid) {
        return
      }
      if (this.gateway) {
        return this.addGatewaySubs()
      }

      let clientId = this.clientId || this.record.clientid

      let subs = await subscribe(clientId, {
        topic: this.record.topic,
        qos: this.record.qos,
      }).catch(() => {})
      if (subs) {
        this.$emit('create:subs')
        this.close()
      }
    },
    async addGatewaySubs() {
      this.submitLoading = true
      let clientId = this.clientId || this.record.clientid
      let res = await addGatewayClientSubs(this.gateway, clientId, {
        topic: this.record.topic,
        qos: this.record.qos,
      }).catch(() => {})
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
