<template>
  <div class="session app-wrapper">
    <el-card>
      <schema-form
        ref="SchemaFormCom"
        type="session"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :according-to="{ path: '/configs/zones' }"
        :label-width="state.lang === 'zh' ? 204 : 276"
        :props-order-map="propsOrderMap"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { createOrderObj, customValidate } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { Zone } from '@/types/config'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Session',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref<Record<string, any>>({})
    const saveLoading = ref(false)
    const configLoading = ref(false)
    const { t } = useI18n()
    const { state } = useStore()

    let rawData: any = undefined
    const SchemaFormCom = ref()
    const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
    useDataNotSaveConfirm(checkDataIsChanged)

    const propsOrderMap = createOrderObj(
      [
        'session_expiry_interval',
        'max_subscriptions',
        'upgrade_qos',
        'max_inflight',
        'retry_interval',
        'max_awaiting_rel',
        'await_rel_timeout',
        'max_mqueue_len',
        'mqueue_priorities',
        'mqueue_default_priority',
        'mqueue_store_qos0',
      ],
      0,
    )

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
      try {
        configLoading.value = true
        const res = await getDefaultZoneConfigs()
        const stringData = await handleMpField(res.mqtt.mqueue_priorities)
        if (stringData) {
          res.mqtt.mqueue_priorities = stringData
        }
        configs.value = res
        rawData = cloneDeep(res)
      } catch (error) {
        //
      } finally {
        configLoading.value = false
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Zone) => {
      await customValidate(SchemaFormCom.value)
      const data = cloneDeep(val)
      const {
        mqtt: { mqueue_priorities },
      } = data
      try {
        // Trans Topic Priorities to JSON format
        const jsonData = await handleMpField(mqueue_priorities)
        saveLoading.value = true
        data.mqtt.mqueue_priorities = jsonData
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
      state,
      configs,
      saveLoading,
      configLoading,
      propsOrderMap,
      handleSave,
      SchemaFormCom,
    }
  },
})
</script>

<style lang="scss"></style>
