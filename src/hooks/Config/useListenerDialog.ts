import { GATEWAY_DISABLED_LISTENER_TYPE_MAP } from '@/common/constants'
import { GatewayName, ListenerType, ListenerTypeForGateway } from '@/types/enum'
import { Listener } from '@/types/listener'
import { computed, ref, ComputedRef, Ref, WritableComputedRef } from 'vue'
import { cloneDeep } from 'lodash'
import { addGatewayListener, updateGatewayListener } from '@/api/gateway'
import { ElMessage } from 'element-plus'
import useI18nTl from '../useI18nTl'
import useListenerUtils from './useListenerUtils'
import { addListener, updateListener } from '@/api/listener'

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
  submit: () => Promise<void>
}

export default (props: Props, emit: Emit): UseListenerDialogReturns => {
  const completeGatewayListenerTypeList = [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
  ]

  const listenerTypeList = [
    ListenerType.QUIC,
    ListenerType.TCP,
    ListenerType.SSL,
    ListenerType.WS,
    ListenerType.WSS,
  ]

  const showDialog = computed({
    get: () => props.modelValue,
    set: (val: boolean) => {
      emit('update:modelValue', val)
    },
  })

  const isEdit: ComputedRef<boolean> = computed(() => !!props.listener)

  const listenerRecord: Ref<Listener> = ref({} as Listener)

  const { t } = useI18nTl('Gateway')
  const { ID_SEPARATOR, createRawListener, normalizeStructure } = useListenerUtils()

  const listenerTypeOptList = computed(() => {
    if (props.gatewayName) {
      if (props.gatewayName in GATEWAY_DISABLED_LISTENER_TYPE_MAP) {
        const disabledList = GATEWAY_DISABLED_LISTENER_TYPE_MAP[props.gatewayName]
        return completeGatewayListenerTypeList.filter((type) => {
          !disabledList.includes(type)
        })
      }
      return completeGatewayListenerTypeList
    }
    return listenerTypeList
  })

  const defaultListener = ref(createRawListener())

  const isSubmitting = ref(false)
  const submit = async () => {
    listenerRecord.value.id = [
      props.gatewayName,
      listenerRecord.value.type,
      listenerRecord.value.name,
    ].join(ID_SEPARATOR)
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
      props.gatewayName ? await submitGatewayListenerInfo(data) : submitListener(data)
      ElMessage.success(t(`Base.${isEdit.value ? 'editSuccess' : 'createSuccess'}`))
      showDialog.value = false
      emit('submitted')
      isSubmitting.value = false
    } catch (error) {
      //
      console.error(error)
      isSubmitting.value = false
    }
  }

  const submitGatewayListenerInfo = async function (data: Listener) {
    const gatewayName: string = props.gatewayName as string
    try {
      isEdit.value
        ? await updateGatewayListener(gatewayName, data.id, data)
        : await addGatewayListener(gatewayName, data)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const submitListener = async (data: Listener) => {
    try {
      isEdit.value ? await addListener(data, data.id) : await updateListener(data, data.id)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  return {
    showDialog,
    isEdit,
    listenerRecord,
    listenerTypeOptList,
    defaultListener,
    isSubmitting,
    submit,
  }
}
