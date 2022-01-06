<template>
  <div class="TLS-enable-config">
    <div class="TLS-enable-config-title">
      {{ $t("Base.TLSCerts") }}
    </div>
    <el-form-item label="TLS Cert">
      <el-input
        class="TLS-input"
        type="textarea"
        :rows="4"
        v-model="record.certfile"
        placeholder="Begins with -----BEGIN CERTIFICATE-----"
      />
    </el-form-item>
    <el-form-item label="TLS Key">
      <el-input
        class="TLS-input"
        type="textarea"
        :rows="4"
        v-model="record.keyfile"
        placeholder="Begins with -----BEGIN RSA PRIVATE KEY-----"
      />
    </el-form-item>
    <el-form-item label="CA Cert">
      <el-input
        class="TLS-input"
        type="textarea"
        :rows="4"
        v-model="record.cacertfile"
        placeholder="Begins with -----BEGIN CERTIFICATE -----"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TLSEnableConfig",
});
</script>

<script setup lang="ts">
import { defineProps, defineEmits, computed, PropType, WritableComputedRef } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const record: WritableComputedRef<any> = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
</script>

<style lang="scss">
.TLS-enable-config {
  margin-bottom: 12px;
  .TLS-enable-config-title {
    margin-top: 0;
    margin-bottom: 8px;
    color: #000000;
    font-weight: bold;
    line-height: 20px;
  }
  .TLS-input {
    width: 60%;
  }
}
</style>
