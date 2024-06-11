import { addGatewayListener, updateGatewayListener } from '@/api/gateway'
import { addListener, queryListenerDetail, updateListener } from '@/api/listener'
import { GATEWAY_DISABLED_LISTENER_TYPE_MAP } from '@/common/constants'
import { checkNOmitFromObj, jumpToErrorFormItem } from '@/common/tools'
import { FormRules } from '@/types/common'
import { GatewayName, ListenerType, ListenerTypeForGateway } from '@/types/enum'
import { Listener } from '@/types/listener'
import { ElMessage, ElMessageBox } from 'element-plus'
import { merge, assign, cloneDeep, omit } from 'lodash'
import { ComputedRef, Ref, WritableComputedRef, computed, nextTick, ref, watch } from 'vue'
import useI18nTl from '../useI18nTl'
import useListenerUtils from './useListenerUtils'
import { isEmptyObj, unflattenObject } from '@emqx/shared-ui-utils'

type Props = Readonly<
  {
    modelValue?: unknown
    listener?: unknown
    gatewayName?: unknown
    doNotSubmitToBackend?: unknown
  } & {
    modelValue: boolean
    doNotSubmitToBackend: boolean
  } & {
    listener?: Listener | undefined
    gatewayName?: GatewayName | undefined
  }
>

type Emit = (event: 'update:modelValue' | 'submit' | 'submitted' | 'delete', ...args: any[]) => void

interface UseListenerDialogReturns {
  showDialog: WritableComputedRef<boolean>
  isEdit: ComputedRef<boolean>
  canBeDeleted: ComputedRef<boolean>
  isLoading: Ref<boolean>
  listenerRecord: Ref<Listener>
  listenerCustomConfigs: Ref<Listener>
  formCom: Ref<any>
  customConfig: Ref<any>
  listenerTypeOptList: ComputedRef<Array<string>>
  defaultListener: Ref<Listener>
  isSubmitting: Ref<boolean>
  showProxyProtocolConfig: ComputedRef<boolean>
  showTCPConfig: ComputedRef<boolean>
  showUDPConfig: ComputedRef<boolean>
  showSSLConfig: ComputedRef<boolean>
  isDTLS: ComputedRef<boolean>
  SSLConfigKey: ComputedRef<string>
  showWSConfig: ComputedRef<boolean>
  listenerFormRules: ComputedRef<FormRules>
  submit: () => Promise<void>
  onDelete: () => void
  transPort: (port: string) => string
  handleTLSVerifyChange: (val: string | number | boolean) => void
}

export default (props: Props, emit: Emit): UseListenerDialogReturns => {
  const showDialog = computed({
    get: () => props.modelValue,
    set: (val: boolean) => {
      emit('update:modelValue', val)
    },
  })

  /**
   * when the dialog use in create gateway, the listener data handle by gateway
   * so the edit listener just like create listener
   */
  const isEdit: ComputedRef<boolean> = computed(
    () => !!props.listener && !props.doNotSubmitToBackend,
  )

  const canBeDeleted = computed(() => {
    return isEdit.value || !!(props.doNotSubmitToBackend && props.listener)
  })

  const listenerRecord: Ref<Listener> = ref({} as Listener)

  const listenerCustomConfigs: Ref<Listener> = ref({} as Listener)

  const { t } = useI18nTl('Gateway')
  const {
    completeGatewayListenerTypeList,
    listenerTypeList,
    listenerFormRules: rawRules,
    limiterRules,
    maxConnRateRule,
    createListenerId,
    createRawListener,
    hasTCPConfig,
    hasUDPConfig,
    hasSSLConfig,
    hasWSConfig,
    canConfigProxyProtocol,
    normalizeStructure,
    handleListenerDataWhenItIsIndependent,
    getListenerNameNTypeById,
    transPort,
    extractDifferences,
    hoconToObject,
  } = useListenerUtils(props.gatewayName)

  const listenerTypeOptList = computed(() => {
    if (props.gatewayName) {
      if (props.gatewayName in GATEWAY_DISABLED_LISTENER_TYPE_MAP) {
        const disabledList = GATEWAY_DISABLED_LISTENER_TYPE_MAP[props.gatewayName]
        return completeGatewayListenerTypeList.filter((type) => !disabledList.includes(type))
      }
      return completeGatewayListenerTypeList
    }
    return listenerTypeList
  })

  const defaultListener = ref(createRawListener())
  const formCom = ref()
  const customConfig = ref()

  const isSubmitting = ref(false)

  const showProxyProtocolConfig = computed(() => canConfigProxyProtocol(listenerRecord.value.type))
  const showTCPConfig = computed(() => hasTCPConfig(listenerRecord.value.type))
  const showUDPConfig = computed(() => hasUDPConfig(listenerRecord.value.type))
  const isDTLS = computed(() => listenerRecord.value.type === ListenerTypeForGateway.DTLS)
  const showSSLConfig = computed(() => hasSSLConfig(listenerRecord.value.type) || isDTLS.value)
  /**
   * the config data put in `dtls` field then type is DTLS
   * put in `ssl` when type is not DTLS
   */
  const SSLConfigKey: ComputedRef<string> = computed(() =>
    isDTLS.value ? 'dtls_options' : 'ssl_options',
  )
  const showWSConfig = computed(() => hasWSConfig(listenerRecord.value.type))

  const listenerFormRules = computed(() => {
    let rules = rawRules
    if (props.gatewayName) {
      rules = { ...rules, ...maxConnRateRule }
    } else {
      rules = { ...rules, ...limiterRules }
    }
    return rules
  })

  const isLoading = ref(false)

  const loadListenerData = async () => {
    if (!props.listener) {
      return
    }
    try {
      isLoading.value = true
      const data = await queryListenerDetail(props.listener.id)
      const { name, type } = getListenerNameNTypeById(data.id)
      listenerRecord.value = { ...data, name, type, bind: transPort(data.bind) }
      // Extract differences custom configs
      const differences = extractDifferences(
        type as 'tcp' | 'ssl' | 'ws' | 'wss',
        listenerRecord.value,
      )
      listenerCustomConfigs.value = {}
      if (!isEmptyObj(differences)) {
        listenerCustomConfigs.value = unflattenObject(differences)
      }
    } catch (error) {
      //
    } finally {
      isLoading.value = false
    }
  }

  const validateForm = async () => {
    try {
      await formCom.value.validate()
      return Promise.resolve()
    } catch (error) {
      jumpToErrorFormItem()
      return Promise.reject()
    }
  }

  const validateCustomConfig = async () => {
    try {
      if (customConfig.value) {
        await hoconToObject(customConfig.value.rawListener)
      }
      return Promise.resolve()
    } catch (error) {
      const err = error as Error
      ElMessage.error(err.toString())
      return Promise.reject(error)
    }
  }

  const handleDataBeforeSubmit = (data: Listener) => {
    if (props.gatewayName) {
      const needDeletedKeys = ['zone', 'limiter', 'current_connections']
      needDeletedKeys.forEach((key) => {
        delete data[key]
      })
    }
    if (listenerRecord.value.type === ListenerTypeForGateway.UDP) {
      data.acceptors = ''
    }
    if (data.type === ListenerType.WSS || data.type === ListenerType.QUIC) {
      delete data.ssl_options.ocsp
    }
    // Handle the custom configs
    if (!isEmptyObj(listenerCustomConfigs.value)) {
      merge(data, listenerCustomConfigs.value)
    }
    return data
  }

  const submit = async () => {
    await validateForm()
    if (!props.gatewayName) {
      await validateCustomConfig()
    }
    listenerRecord.value.id = createListenerId(listenerRecord.value, props.gatewayName)
    const input = handleDataBeforeSubmit(cloneDeep(listenerRecord.value))
    if (props.doNotSubmitToBackend) {
      emit('submit', checkNOmitFromObj(input))
      showDialog.value = false
      return
    }
    try {
      if (isEdit.value) {
        const confirmMsg = props.gatewayName
          ? t('Gateway.updateGatewayListenerTip')
          : t('BasicConfig.updateListenerTip')
        await ElMessageBox.confirm(confirmMsg, '', {
          type: 'warning',
        })
      }
      isSubmitting.value = true
      const filePaths = ['certfile', 'keyfile', 'cacertfile'].reduce(
        (arr: Array<string>, key) => [...arr, `dtls_options.${key}`, `ssl_options.${key}`],
        [],
      )

      let data = normalizeStructure(input)
      if (!isEdit.value) {
        data = checkNOmitFromObj(normalizeStructure(input), filePaths)
      }
      props.gatewayName ? await submitGatewayListenerInfo(data) : await submitListener(data)
      ElMessage.success(t(`Base.${isEdit.value ? 'updateSuccess' : 'createSuccess'}`))
      showDialog.value = false
      emit('submitted')
    } catch (error) {
      console.error(error)
    } finally {
      isSubmitting.value = false
    }
  }

  const onDelete = () => {
    emit('delete', listenerRecord.value)
  }

  const submitGatewayListenerInfo = async function (data: Listener) {
    const gatewayName: string = props.gatewayName as string
    const listener = omit(cloneDeep(data), ['zone'])
    try {
      isEdit.value
        ? await updateGatewayListener(gatewayName, data.id, listener)
        : await addGatewayListener(gatewayName, listener)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const submitListener = async (data: Listener) => {
    try {
      let listener = omit(cloneDeep(data), ['name'])
      listener = handleListenerDataWhenItIsIndependent(listener)
      isEdit.value ? await updateListener(listener, data.id) : await addListener(listener, data.id)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const getDefaultListenerTypeByGateway = () => {
    const { gatewayName } = props
    if (!gatewayName || !(gatewayName in GATEWAY_DISABLED_LISTENER_TYPE_MAP)) {
      return completeGatewayListenerTypeList[0]
    }
    const disabledList = GATEWAY_DISABLED_LISTENER_TYPE_MAP[gatewayName]
    return completeGatewayListenerTypeList.filter((item) => !disabledList.includes(item))[0]
  }

  watch(showDialog, async (val) => {
    if (val) {
      if (props.listener) {
        listenerRecord.value = assign(createRawListener(), cloneDeep(props.listener))
        if (!props.gatewayName) {
          loadListenerData()
        }
      } else {
        const formData: { type?: ListenerTypeForGateway } = {}
        if (props.gatewayName) {
          formData.type = getDefaultListenerTypeByGateway()
        }
        listenerRecord.value = { ...createRawListener(), ...formData }
        if (!props.gatewayName) {
          delete listenerRecord.value.max_conn_rate
        }
      }
      await nextTick()
      formCom.value.clearValidate()
    } else {
      // for prevent form throw error
      listenerRecord.value = createRawListener()
      listenerCustomConfigs.value = {}
      isLoading.value = false
    }
  })

  // If 'fail_if_no_peer_cert' is true while TLS verification is 'verify_none', it will cause an update error
  const handleTLSVerifyChange = (val: string | number | boolean) => {
    const { fail_if_no_peer_cert } = listenerRecord.value[SSLConfigKey.value]
    if (val === 'verify_none' && fail_if_no_peer_cert === true) {
      listenerRecord.value[SSLConfigKey.value].fail_if_no_peer_cert = false
    }
  }

  return {
    showDialog,
    isLoading,
    isEdit,
    canBeDeleted,
    listenerRecord,
    listenerCustomConfigs,
    formCom,
    customConfig,
    listenerTypeOptList,
    defaultListener,
    isSubmitting,
    showProxyProtocolConfig,
    showTCPConfig,
    showUDPConfig,
    showSSLConfig,
    showWSConfig,
    isDTLS,
    SSLConfigKey,
    listenerFormRules,
    submit,
    onDelete,
    transPort,
    handleTLSVerifyChange,
  }
}
