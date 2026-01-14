import { BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

const AGGREGATED_UPLOAD_TYPES = [BridgeType.Snowflake, BridgeType.S3Tables]

// Action types that support aggregated upload
const CAN_AGGREGATED_UPLOAD_TYPES = [
  ...AGGREGATED_UPLOAD_TYPES,
  BridgeType.S3,
  BridgeType.AzureBlobStorage,
]

const AGGREGATED = 'aggregated'

const useDetectAggregatedAction = () => {
  const detectAggregatedCon = (action: BridgeItem) => get(action, 'parameters.mode') === AGGREGATED

  const detectAggregatedAction = (action: BridgeItem) => {
    if (!CAN_AGGREGATED_UPLOAD_TYPES.includes(action.type)) {
      return false
    }
    return AGGREGATED_UPLOAD_TYPES.includes(action.type) || detectAggregatedCon(action)
  }
  return {
    detectAggregatedAction,
  }
}

export default useDetectAggregatedAction
