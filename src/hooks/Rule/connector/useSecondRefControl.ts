import { BridgeType } from '@/types/enum'
import { computed, ComputedRef, WritableComputedRef } from 'vue'
import { useConnectorSchema } from '../bridge/useBridgeTypeValue'

export const enum IoTDBDriver {
  RestAPI = 'restapi',
  Thrift = 'thrift',
}

export const IoTDBDrivers = [IoTDBDriver.RestAPI, IoTDBDriver.Thrift]
export const IoTDBKeyField = 'driver' as const

export const useIoTDBSecondRefControl = (
  formData: WritableComputedRef<Record<string, any>>,
): {
  currentRef: ComputedRef<string>
  keyField: string
} => {
  const keyField = IoTDBKeyField
  const { typeWithMultipleRefKeyMap } = useConnectorSchema()
  const IoTDBRefArr = typeWithMultipleRefKeyMap.get(BridgeType.IoTDB) || []
  const fieldRefMap: Record<IoTDBDriver, string> = {
    [IoTDBDriver.RestAPI]:
      IoTDBRefArr.find((item) => new RegExp(IoTDBDriver.RestAPI).test(item)) ?? '',
    [IoTDBDriver.Thrift]:
      IoTDBRefArr.find((item) => new RegExp(IoTDBDriver.Thrift).test(item)) ?? '',
  }
  const keyFieldValue = computed<IoTDBDriver>(() => formData.value?.[keyField])
  const currentRef = computed(() => {
    if (keyFieldValue.value === undefined) {
      return fieldRefMap[IoTDBDriver.RestAPI]
    }
    return fieldRefMap[keyFieldValue.value]
  })

  return { currentRef, keyField }
}
