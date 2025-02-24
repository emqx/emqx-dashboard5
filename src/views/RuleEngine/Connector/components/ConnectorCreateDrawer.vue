<template>
  <el-drawer
    :title="tl('createConnector')"
    v-model="showDrawer"
    :lock-scroll="false"
    class="connector-create-drawer"
    size="60%"
    destroy-on-close
    append-to-body
  >
    <ConnectorCreate :type="type" @submitted="handleConnectorSubmitted" @cancel="cancel" />
  </el-drawer>
</template>

<script setup lang="ts">
import ConnectorCreate from '../ConnectorCreate.vue'

const props = defineProps<{
  modelValue: boolean
  type?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submitted', name: string): void
}>()

const showDrawer = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { tl } = useI18nTl('RuleEngine')

const handleConnectorSubmitted = (name: string) => {
  showDrawer.value = false
  emit('submitted', name)
}

const cancel = () => (showDrawer.value = false)
</script>

<style lang="scss">
.connector-create-drawer {
  .connector-create {
    .el-card {
      border: none;
      overflow: visible;
    }
    .el-card__body {
      padding: 0;
    }
    .form-container {
      width: 100%;
    }
  }
  // Set a special style for the button block of the creation page
  .form-ft {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 10px 20px;
  }
}
</style>
