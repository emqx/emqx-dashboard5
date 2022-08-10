<template>
  <div>
    <schema-form
      ref="formCom"
      type="bridge"
      :need-footer="false"
      :need-record="!bridgeRecord"
      :form="bridgeRecord"
      :schema-file-path="`static/bridge-api-${store.state.lang}.json`"
      :according-to="{ ref: '#/components/schemas/bridge_influxdb.post_api_v1' }"
      :btn-loading="saveLoading"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps, computed, defineEmits } from 'vue'
import { useStore } from 'vuex'
import SchemaForm from '@/components/SchemaForm'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const store = useStore()

const saveLoading = ref(false)

const formCom = ref()

const bridgeRecord = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const validate = () => {
  // TODO:
  return Promise.resolve()
}

const getFormRecord = () => {
  return formCom.value.configForm
}

defineExpose({ getFormRecord, validate })
</script>
