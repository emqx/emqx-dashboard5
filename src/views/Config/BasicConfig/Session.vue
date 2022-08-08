<template>
  <div class="session app-wrapper">
    <el-card>
      <schema-form
        :according-to="{ path: '/configs/zones' }"
        type="session"
        :form="configs"
        :btn-loading="saveLoading"
        @save="handleSave"
      >
      </schema-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { Zone } from '../../../types/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Session',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref<Record<string, any>>({})
    const saveLoading = ref(false)
    const { t } = useI18n()
    const handleMpField = async (mqueue_priorities: string | Record<string, any>) => {
      if (mqueue_priorities === 'disabled') {
        return Promise.resolve(mqueue_priorities)
      }
      try {
        if (typeof mqueue_priorities === 'string') {
          const jsonData = JSON.parse(mqueue_priorities)
          return Promise.resolve(jsonData)
        } else {
          const stringData = JSON.stringify(mqueue_priorities)
          return Promise.resolve(stringData)
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ElMessage.error(mqueue_priorities.toString() + ': ' + error.toString())
      }
    }
    const loadData = async () => {
      const res = await getDefaultZoneConfigs()
      if (res) {
        const stringData = await handleMpField(res.mqtt.mqueue_priorities)
        if (stringData) {
          res.mqtt.mqueue_priorities = stringData
        }
        configs.value = res
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Zone) => {
      const data = _.cloneDeep(val)
      const {
        mqtt: { mqueue_priorities },
      } = data
      // Trans Topic Priorities to JSON format
      const jsonData = await handleMpField(mqueue_priorities)
      if (!jsonData) {
        return
      }
      saveLoading.value = true
      data.mqtt.mqueue_priorities = jsonData
      try {
        await updateDefaultZoneConfigs(data)
        ElMessage.success(t('Base.updateSuccess'))
        reloading()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    loadData()
    return {
      configs,
      saveLoading,
      handleSave,
    }
  },
})
</script>

<style lang="scss"></style>
