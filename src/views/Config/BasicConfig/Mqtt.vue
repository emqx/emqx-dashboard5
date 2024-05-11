<template>
  <div class="mqtt app-wrapper">
    <el-card class="app-card allow-overflow">
      <schema-form
        ref="SchemaFormCom"
        type="mqtt"
        need-rules
        :according-to="{ ref: ['paths', '/configs/global_zone', 'get'] }"
        :form="configs"
        :form-props="{ labelWidth: state.lang === 'zh' ? 240 : 284 }"
        :btn-loading="saveLoading"
        :record-loading="configLoading"
        :props-order-map="propsOrderMap"
        :data-handler="handleSchema"
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
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { Zone } from '@/types/config'
import { Properties } from '@/types/schemaForm'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Mqtt',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = ref({})
    const saveLoading = ref(false)
    const { t } = useI18n()
    const { state } = useStore()

    let rawData: any = undefined
    const SchemaFormCom = ref()
    const configLoading = ref(false)
    const checkDataIsChanged = () => !isEqual(SchemaFormCom.value?.configForm, rawData)
    useDataNotSaveConfirm(checkDataIsChanged)

    const propsOrderMap = createOrderObj(
      [
        'max_packet_size',
        'max_qos_allowed',
        'max_clientid_len',
        'max_topic_levels',
        'max_topic_alias',
        'wildcard_subscription',
        'shared_subscription',
        'shared_subscription_strategy',
        'exclusive_subscription',
        'retain_available',
        'ignore_loop_deliver',
        'strict_mode',
        'response_information',
        'keepalive_multiplier',
        'server_keepalive',
        'use_username_as_clientid',
        'peer_cert_as_username',
        'peer_cert_as_clientid',
        'idle_timeout',
      ],
      0,
    )

    const getSchemaText = (key: string) => t(`ConfigSchema.emqx_schema.${key}`)
    const handleSchema = (data: { components: Properties; rules: SchemaRules }) => {
      const { client_attrs_init } = data?.components?.mqtt?.properties || {}
      if (client_attrs_init) {
        if (!client_attrs_init.componentProps) {
          client_attrs_init.componentProps = {}
        }
        client_attrs_init.componentProps.columnsProps = {
          set_as_attr: { minWidth: 140 },
          expression: { minWidth: 200 },
        }
        if (client_attrs_init.path) {
          if (!data.rules[client_attrs_init.path]) {
            data.rules[client_attrs_init.path] = []
          }
          data.rules[client_attrs_init.path].push({
            validator(rules: any, value: any, cb: (errors?: Error) => void) {
              if (
                value?.some?.(
                  ({ set_as_attr, expression }: { expression: string; set_as_attr: string }) =>
                    !set_as_attr || !expression,
                )
              ) {
                cb(new Error(t('Rule.incompleteTableError')))
              }
              const setAsAttrArr = value?.map?.((item: any) => item.set_as_attr)
              const uniqueSetAsAttrArr = [...new Set(setAsAttrArr)]
              if (setAsAttrArr.length !== uniqueSetAsAttrArr.length) {
                cb(new Error(t('BasicConfig.duplicatedAttrError')))
              }
              cb()
            },
          })
        }
      }

      const { items } = client_attrs_init || {}
      if (items) {
        const { expression, set_as_attr } = items?.properties || {}
        if (expression) {
          expression.label = getSchemaText('client_attrs_init_expression.label')
          expression.description = getSchemaText('client_attrs_init_expression.desc')
        }
        if (set_as_attr) {
          set_as_attr.label = getSchemaText('client_attrs_init_set_as_attr.label')
        }
        items.properties = { set_as_attr, expression }
      }
      return data
    }

    const loadData = async () => {
      try {
        configLoading.value = true
        configs.value = await getDefaultZoneConfigs()
        rawData = cloneDeep(configs.value)
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
      state,
      SchemaFormCom,
      configs,
      handleSchema,
      saveLoading,
      configLoading,
      propsOrderMap,
      handleSave,
    }
  },
})
</script>

<style lang="scss"></style>
