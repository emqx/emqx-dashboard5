<template>
  <div class="tls-config">
    <div class="create-form-title">TLS</div>
    <el-checkbox v-model="record.enable" :label="$t('Base.enableTLS')" border></el-checkbox>
    <el-checkbox
      v-model="record.verify"
      :label="$t('Auth.tlsVerify')"
      :true-label="SSL_VERIFY_VALUE_MAP.get(true)"
      :false-label="SSL_VERIFY_VALUE_MAP.get(false)"
      border
    ></el-checkbox>
    <el-collapse-transition>
      <div v-if="record.enable">
        <div class="create-form-title">
          {{ $t('Auth.TLSCerts') }}
        </div>
        <el-form class="create-form">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="TLS Cert">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="record.certfile"
                  placeholder="Begins with -----BEGIN CERTIFICATE-----"
                ></el-input>
                <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
                  <!-- <el-button slot="trigger" size="small">
                    {{ $t('Base.selectFile') }}
                  </el-button> -->
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="TLS Key">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="record.keyfile"
                  placeholder="Begins with -----BEGIN RSA PRIVATE KEY-----"
                ></el-input>
                <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
                  <!-- <el-button slot="trigger" size="small">
                    {{ $t('Base.selectFile') }}
                  </el-button> -->
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CA Cert">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="record.cacertfile"
                  placeholder="Begins with -----BEGIN CERTIFICATE -----"
                ></el-input>
                <el-upload class="bottom-btn" ref="upload" action="" :auto-upload="false">
                  <!-- <el-button slot="trigger" size="small">
                    {{ $t('Base.selectFile') }}
                  </el-button> -->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { SSL_VERIFY_VALUE_MAP } from '@/common/constants'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'TLSConfig',

  props: {
    modelValue: {
      type: Object,
      required: true,
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
