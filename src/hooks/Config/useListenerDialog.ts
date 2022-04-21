import { GATEWAY_DISABLED_LISTENER_TYPE_MAP } from '@/common/constants'
import { GatewayName, ListenerTypeForGateway } from '@/types/enum'
import { Listener } from '@/types/listener'
import { computed, ref, ComputedRef, Ref, WritableComputedRef, watch } from 'vue'
import { cloneDeep, merge, omit } from 'lodash'
import { addGatewayListener, updateGatewayListener } from '@/api/gateway'
import { ElMessage } from 'element-plus'
import useI18nTl from '../useI18nTl'
import useListenerUtils from './useListenerUtils'
import { addListener, queryListenerDetail, updateListener } from '@/api/listener'

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

type Emit = (event: 'update:modelValue' | 'submit' | 'submitted', ...args: any[]) => void

interface UseListenerDialogReturns {
  showDialog: WritableComputedRef<boolean>
  isEdit: ComputedRef<boolean>
  listenerRecord: Ref<Listener>
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
  submit: () => Promise<void>
}

export default (props: Props, emit: Emit): UseListenerDialogReturns => {
  const showDialog = computed({
    get: () => props.modelValue,
    set: (val: boolean) => {
      emit('update:modelValue', val)
    },
  })

  const isEdit: ComputedRef<boolean> = computed(() => !!props.listener)

  const listenerRecord: Ref<Listener> = ref({} as Listener)

  const { t } = useI18nTl('Gateway')
  const {
    completeGatewayListenerTypeList,
    listenerTypeList,
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
  } = useListenerUtils()

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
  const SSLConfigKey: ComputedRef<string> = computed(() => (isDTLS.value ? 'dtls' : 'ssl'))
  const showWSConfig = computed(() => hasWSConfig(listenerRecord.value.type))

  const isLoading = ref(false)
  const loadListenerData = async () => {
    if (!props.listener) {
      return
    }
    try {
      isLoading.value = true
      const data = await queryListenerDetail(props.listener.id)
      const { name, type } = getListenerNameNTypeById(data.id)
      listenerRecord.value = { ...data, name, type }
    } catch (error) {
      //
    } finally {
      isLoading.value = false
    }
  }

  const submit = async () => {
    listenerRecord.value.id = createListenerId(listenerRecord.value, props.gatewayName)
    const input = cloneDeep(listenerRecord.value)
    if (listenerRecord.value.type === ListenerTypeForGateway.UDP) {
      input.acceptors = ''
    }
    if (props.doNotSubmitToBackend) {
      emit('submit', input)
      showDialog.value = false
      return
    }
    try {
      isSubmitting.value = true
      const data = normalizeStructure(input)
      props.gatewayName ? await submitGatewayListenerInfo(data) : await submitListener(data)
      ElMessage.success(t(`Base.${isEdit.value ? 'editSuccess' : 'createSuccess'}`))
      showDialog.value = false
      emit('submitted')
      isSubmitting.value = false
    } catch (error) {
      console.error(error)
      isSubmitting.value = false
    }
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

  watch(showDialog, (val) => {
    if (val) {
      if (props.listener) {
        listenerRecord.value = merge(createRawListener(), cloneDeep(props.listener))
        if (!props.gatewayName) {
          loadListenerData()
        }
      } else {
        const formData: { type?: ListenerTypeForGateway } = {}
        if (props.gatewayName) {
          formData.type = getDefaultListenerTypeByGateway()
        }
        listenerRecord.value = { ...createRawListener(), ...formData }
      }
    }
  })

  return {
    showDialog,
    isEdit,
    listenerRecord,
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
    submit,
  }
}
