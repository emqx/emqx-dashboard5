<template>
  <div class="no-tab-wrapper cluster">
    <schema-form path="/configs/cluster"></schema-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SchemaForm from '@/components/SchemaForm'

export default defineComponent({
  name: 'Cluster',
  components: {
    SchemaForm,
  },
  setup() {
    const loadData = () => {}
    const reloading = () => {
      loadData()
    }
    return {
      reloading,
    }
  },
})
</script>

<style lang="scss" scoped></style>
