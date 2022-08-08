<template>
  <div class="mqtt app-wrapper">
    <el-card>
      <schema-form
        :schema-file-path="`static/bridge-api-${store.state.lang}.json`"
        :according-to="{ ref: '#/components/schemas/bridge_influxdb.get_api_v1' }"
        type="mqtt"
        :form="configs"
        :btn-loading="saveLoading"
        @save="handleSave"
      >
      </schema-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import SchemaForm from '@/components/SchemaForm'

const store = useStore()
const configs = ref({})
const saveLoading = ref(false)
const { t } = useI18n()
const loadData = async () => {
  // TODO: load when edit
}

const handleSave = async (val) => {
  saveLoading.value = true
  const data = {
    ...val,
  }
  try {
    //  TODO:
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}
loadData()
</script>

<style lang="scss"></style>
