<template>
  <div class="mqtt app-wrapper">
    <el-card>
      <schema-form
        ref="SchemaFormCom"
        type="mqtt"
        :according-to="{ path: '/configs/zones' }"
        :form="configs"
        :label-width="290"
        :btn-loading="saveLoading"
        :props-order-map="propsOrderMap"
        :data-handler="componentsHandler"
        @save="handleSave"
      >
      </schema-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { createOrderObj, customValidate } from '@/common/tools'
import SchemaForm from '@/components/SchemaForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { SchemaRules } from '@/hooks/useSchemaFormRules'
import { Zone } from '@/types/config'
import { Properties } from '@/types/schemaForm'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Mqtt',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()

    let rawData: any = undefined
    const SchemaFormCom = ref()
    const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
    useDataNotSaveConfirm(checkDataIsChanged)

    const propsOrderMap = createOrderObj(
      [
        'max_packet_size',
        'max_qos_allowed',
        'max_clientid_len',
        'use_username_as_clientid',
        'max_topic_levels',
        'max_topic_alias',
        'wildcard_subscription',
        'shared_subscription',
        'exclusive_subscription',
        'ignore_loop_deliver',
        'strict_mode',
        'response_information',
        'server_keepalive',
        'peer_cert_as_username',
        'peer_cert_as_clientid',
        'idle_timeout',
        'retain_available',
        'keepalive_backoff',
      ],
      0,
    )

    const keysDoNotNeedDesc = [
      'max_packet_size',
      'max_qos_allowed',
      'max_clientid_len',
      'max_topic_levels',
      'max_topic_alias',
      'wildcard_subscription',
      'shared_subscription',
      'exclusive_subscription',
    ]
    const componentsHandler = ({
      components,
      rules,
    }: {
      components: Properties
      rules: SchemaRules
    }) => {
      const comRet = components
      const props = components.mqtt?.properties || {}
      keysDoNotNeedDesc.forEach((key) => {
        if (props[key] && props[key].description) {
          props[key].description = ''
        }
      })
      return { components: comRet, rules }
    }

    const loadData = async () => {
      const res = await getDefaultZoneConfigs()
      if (res) {
        configs.value = res
        rawData = cloneDeep(res)
      }
    }
    const reloading = () => {
      loadData()
    }
    const handleSave = async (val: Zone) => {
      try {
        await customValidate(SchemaFormCom.value)
        saveLoading.value = true
        const data = { ...val }
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
      SchemaFormCom,
      configs,
      saveLoading,
      propsOrderMap,
      componentsHandler,
      handleSave,
    }
  },
})
</script>

<style lang="scss"></style>
