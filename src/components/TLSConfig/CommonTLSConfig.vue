<template>
  <TLSBaseConfig v-model="record" />
  <el-collapse-transition>
    <TLSEnableConfig v-if="record.enable" />
  </el-collapse-transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommonTLSConfig",
});
</script>

<script setup lang="ts">
import { defineProps, defineEmits, computed, PropType, WritableComputedRef } from "vue";
import TLSBaseConfig from "./TLSBaseConfig.vue";
import TLSEnableConfig from "./TLSEnableConfig.vue";

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
