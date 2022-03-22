<template>
  <div class="tls-config">
    <el-row>
      <el-col :span="16">
        <el-checkbox v-model="record.enable" :label="$t('Auth.enableTLS')" border />
        <el-checkbox
          v-model="record.verify"
          :label="$t('Auth.tlsVerify')"
          :true-label="SSL_VERIFY_VALUE_MAP.get(true)"
          :false-label="SSL_VERIFY_VALUE_MAP.get(false)"
          border
        />
      </el-col>
    </el-row>
    <el-collapse-transition>
      <template v-if="record.enable">
        <el-form label-position="top">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="TLS Cert">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="record.certfile"
                  placeholder="Begins with -----BEGIN CERTIFICATE-----"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="TLS Key">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="record.keyfile"
                  placeholder="Begins with -----BEGIN RSA PRIVATE KEY-----"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CA Cert">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="record.cacertfile"
                  placeholder="Begins with -----BEGIN CERTIFICATE -----"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import { SSL_VERIFY_VALUE_MAP } from '@/common/constants'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    const record = computed(() => props.modelValue)
    return {
      record,
      SSL_VERIFY_VALUE_MAP,
    }
  },
})
</script>
