<template>
  <div class="schema-bridge bridge-config">
    <schema-form
      v-if="getRefKey"
      ref="formCom"
      type="bridge"
      need-rules
      :need-footer="false"
      :need-record="!edit && !copy"
      :form="bridgeRecord"
      :schema-file-path="`static/bridge-api-${store.state.lang}.json`"
      :according-to="{ ref: `#/components/schemas/${getRefKey}` }"
      :btn-loading="saveLoading"
      :form-item-span="12"
      :use-tooltip-show-desc="true"
      :props-order-map="propsOrderMap"
      :custom-col-class="customColClass"
      :custom-label-map="customLabelMap"
      :props-disabled="propsDisabled"
      :data-handler="getComponentsHandler()"
      @update="handleRecordChanged"
      @component-change="handleComponentChange"
    >
    </schema-form>
  </div>
</template>

<script setup lang="ts">
import SchemaForm from '@/components/SchemaForm'
import useComponentsHandlers from '@/hooks/Rule/bridge/useComponentsHandlers'
import useSchemaBridgePropsLayout from '@/hooks/Rule/bridge/useSchemaBridgePropsLayout'
import {
  useMongoSecondTypeControl,
  useRedisSecondTypeControl,
} from '@/hooks/Rule/bridge/useSecondTypeControl'
import useSyncConfiguration from '@/hooks/Rule/bridge/useSyncConfiguration'
import useFillNewRecord from '@/hooks/useFillNewRecord'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRules } from '@/hooks/useSchemaFormRules'
import { BridgeType } from '@/types/enum'
import { OtherBridge } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, PropType, ref } from 'vue'
import { useStore } from 'vuex'

type UseSchemaBridgeType = Exclude<
  BridgeType,
  BridgeType.MQTT | BridgeType.Webhook | BridgeType.InfluxDB | BridgeType.Kafka
>

const typeRefKeyMap = {
  [BridgeType.MySQL]: `bridge_mysql.post`,
  [BridgeType.GCP]: `bridge_gcp_pubsub.post`,
  // [BridgeType.Redis]: `bridge_redis.post_single`,
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: undefined,
  },
  type: {
    type: String as PropType<UseSchemaBridgeType>,
  },
  edit: {
    type: Boolean,
  },
  copy: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])

const store = useStore()
const { tl } = useI18nTl('RuleEngine')

const bridgeRecord = computed({
  get() {
    return props.modelValue || {}
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { handleSyncEtcFormData } = useSyncConfiguration(bridgeRecord)

const saveLoading = ref(false)

const formCom = ref()

const { propsOrderMap, customColClass } = useSchemaBridgePropsLayout(props, bridgeRecord)

const customLabelMap = {
  name: tl('name'),
}

const { currentType: redisFormType, keyField: redisSecondTypeControlField } =
  useRedisSecondTypeControl(bridgeRecord)
const { currentType: mongoFormType, keyField: mongoSecondTypeControlField } =
  useMongoSecondTypeControl(bridgeRecord)

const typesWithSecondControlMap = {
  [BridgeType.Redis]: redisFormType,
  [BridgeType.MongoDB]: mongoFormType,
}
const typesWithSecondControlKeyMap = {
  [BridgeType.Redis]: redisSecondTypeControlField,
  [BridgeType.MongoDB]: mongoSecondTypeControlField,
}

const propsDisabled = computed(() => {
  const ret = []
  if (props.edit) {
    ret.push('name')
    if (props.type && props.type in typesWithSecondControlKeyMap) {
      ret.push(
        typesWithSecondControlKeyMap[props.type as keyof typeof typesWithSecondControlKeyMap],
      )
    }
  }

  return ret
})

const getRefKey = computed(() => {
  if (!props.type) {
    return
  }
  if (Object.keys(typesWithSecondControlMap).includes(props.type)) {
    return typesWithSecondControlMap[props.type as keyof typeof typesWithSecondControlMap].value
  }
  return typeRefKeyMap[props.type as keyof typeof typeRefKeyMap] || undefined
})

const {
  deleteSSLLabelAndDesc,
  redisComponentsHandler,
  GCPComponentsHandler,
  mongoComponentsHandler,
} = useComponentsHandlers()
const getComponentsHandler = () => {
  if (props.type === BridgeType.Redis) {
    return redisComponentsHandler
  } else if (props.type === BridgeType.GCP) {
    return GCPComponentsHandler
  } else if (props.type === BridgeType.MongoDB) {
    return mongoComponentsHandler
  }
  return ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
    deleteSSLLabelAndDesc(components)
    return { components, rules }
  }
}

const { fillNewRecord } = useFillNewRecord()
const handleComponentChange = ({
  newVal,
  oldVal,
}: Record<'oldVal' | 'newVal', { components: Properties; record: Record<string, any> }>) => {
  bridgeRecord.value = { ...fillNewRecord(newVal, oldVal), type: newVal.record.type }
}

const handleRecordChanged = (formData: OtherBridge) => {
  if (Object.keys(formData).length > 0) {
    bridgeRecord.value = formData
  }
}

const validate = () => {
  if (formCom.value?.validate) {
    return formCom.value.validate()
  }
  return Promise.resolve()
}

const getFormRecord = () => handleSyncEtcFormData(cloneDeep(formCom.value.configForm))

defineExpose({ getFormRecord, validate })
</script>

<style lang="scss">
.schema-bridge {
  min-height: 320px;
  .col-need-row {
    // To squeeze the next column down
    margin-right: 40%;
  }
  .col-hidden {
    display: none;
  }
  .custom-col-24 {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
  // hide first label
  .col-ssl {
    > .el-form-item {
      > .el-form-item__label {
        display: none;
      }
    }
  }
  .el-col-12.dividing-line-below {
    position: relative;
    &::after {
      content: '';
      display: block;
      height: 1px;
      width: 200%;
      margin-top: 24px + 18px;
      margin-bottom: 24px;
      background-color: var(--color-border-menu);
    }
  }
  .schema-form .el-form-item__label {
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
}
</style>
