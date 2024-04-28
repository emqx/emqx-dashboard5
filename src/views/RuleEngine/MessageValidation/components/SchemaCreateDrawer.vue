<template>
  <el-drawer
    :title="t('components.schema-create')"
    v-model="showDrawer"
    :lock-scroll="false"
    class="schema-create-drawer"
    :size="700"
    destroy-on-close
    append-to-body
  >
    <SchemaCreate :type="type" @submitted="handleSchemaSubmitted" @cancel="cancel" />
  </el-drawer>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { computed, defineEmits, defineProps } from 'vue'
import SchemaCreate from '@/views/RuleEngine/Schema/SchemaCreate.vue'

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

const { t } = useI18nTl('RuleEngine')

const handleSchemaSubmitted = (name: string) => {
  showDrawer.value = false
  emit('submitted', name)
}

const cancel = () => (showDrawer.value = false)
</script>

<style lang="scss">
.schema-create-drawer {
  .schema-create {
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
  .schema-create-form {
    width: 100%;
  }
  // Set a special style for the button block of the creation page
  .schema-create-ft {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 10px 20px;
  }
}
</style>
