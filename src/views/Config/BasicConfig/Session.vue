<template>
  <div class="session app-wrapper">
    <el-card class="app-card allow-overflow">
      <schema-form
        ref="SchemaFormCom"
        type="session"
        :form="configs"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :according-to="{ ref: ['paths', '/configs/global_zone', 'get'] }"
        :form-props="{ labelWidth: state.lang === 'zh' ? 204 : 276 }"
        :props-order-map="propsOrderMap"
        :data-handler="handleSessionSchema"
        @save="handleSave"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { createOrderObj, customValidate } from '@/common/tools'
import { isJSONString } from '@emqx/shared-ui-utils'
import SchemaForm from '@/components/SchemaForm'
import { Zone } from '@/types/config'

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
    const handleSessionSchema = ({ rules, components }: any) => {
      const { mqtt } = rules
      const { mqtt: mqttComponent } = components
      const disabledValue = mqttComponent?.properties?.mqueue_priorities?.oneOf?.find(
        (item: any) => item.symbols?.length === 1,
      )?.symbols?.[0]
      if (mqtt && !mqtt.mqueue_priorities) {
        mqtt.mqueue_priorities = {
          validator: (rules: any, value: string, callback: any) => {
            if (disabledValue === value) {
              callback()
            } else if (!isJSONString(value)) {
              callback(t('Auth.jsonFormatError'))
            } else {
              const obj = JSON.parse(value)
              let invalidPriority = false
              for (const key in obj) {
                const priority = obj[key]
                if (typeof priority !== 'number' || priority < 1 || priority > 255) {
                  invalidPriority = true
                  break
                }
              }
              const msg = invalidPriority ? t('Auth.priorityRangeError') : undefined
              callback(msg)
            }
          },
          trigger: 'blur',
        }
      }
      const expiryInterval = mqttComponent?.properties?.session_expiry_interval || {}
      if (expiryInterval) {
        expiryInterval.componentProps = { enabledUnits: ['s', 'm', 'h'] }
      }
      return { components, rules }
    }

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
        return Promise.reject()
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
      handleSessionSchema,
      handleSave,
      SchemaFormCom,
    }
  },
})
</script>

<style lang="scss"></style>
