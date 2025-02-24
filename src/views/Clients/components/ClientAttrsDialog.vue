<template>
  <el-dialog
    v-model="showDialog"
    width="480px"
    class="common-dialog client-attrs-dialog"
    destroy-on-close
    :title="tl('clientAttrs')"
    :close-on-click-modal="false"
  >
    <KeyAndValueEditor readonly :model-value="value" />
  </el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  value: {
    type: Object as PropType<Record<string, string>>,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('Clients')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss">
.client-attrs-dialog {
  .el-dialog__body {
    max-height: 60vh;
    overflow-y: scroll;
  }
}
</style>
