<template>
  <div class="schema-form">{{ components }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'

export default defineComponent({
  name: 'Cluster',
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { components } = useSchemaForm(props.path)
    return {
      components,
    }
  },
})
</script>

<style lang="scss" scoped></style>
