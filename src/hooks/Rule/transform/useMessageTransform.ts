import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import {
  MessageTransform,
  MessageTransformFailureAction,
  MessageTransformLogLevel,
} from '@/types/typeAlias'
import { cloneDeep } from 'lodash'

export type TypeMessageTransformFailureAction =
  typeof MessageTransformFailureAction[keyof typeof MessageTransformFailureAction]

export type TypeMessageTransformLogLevel =
  typeof MessageTransformLogLevel[keyof typeof MessageTransformLogLevel]

export const useFailureAction = (): {
  failureActionOpts: { label: string; value: TypeMessageTransformFailureAction }[]
  getLabelByValue: (value: TypeMessageTransformFailureAction) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const failureActionOpts: Array<{ label: string; value: TypeMessageTransformFailureAction }> = [
    { label: tl('dropMsg'), value: MessageTransformFailureAction.drop },
    { label: tl('disconnect'), value: MessageTransformFailureAction.disconnect },
    { label: tl('ignore'), value: MessageTransformFailureAction.ignore },
  ]

  const getLabelByValue = (value: TypeMessageTransformFailureAction) =>
    getLabelFromValueInOptionList(value, failureActionOpts)

  return { failureActionOpts, getLabelByValue }
}

export const useMessageTransformLogLevel = (): {
  messageTransformLogLevelOpts: { label: string; value: TypeMessageTransformLogLevel }[]
  getLabelByValue: (value: TypeMessageTransformLogLevel) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const messageTransformLogLevelOpts: Array<{
    label: string
    value: TypeMessageTransformLogLevel
  }> = [
    { label: 'error', value: MessageTransformLogLevel.error },
    { label: 'warning', value: MessageTransformLogLevel.warning },
    { label: 'notice', value: MessageTransformLogLevel.notice },
    { label: 'info', value: MessageTransformLogLevel.info },
    { label: 'debug', value: MessageTransformLogLevel.debug },
    { label: tl('logLevelNone'), value: MessageTransformLogLevel.none },
  ]

  const getLabelByValue = (value: TypeMessageTransformLogLevel) =>
    getLabelFromValueInOptionList(value, messageTransformLogLevelOpts)

  return { messageTransformLogLevelOpts, getLabelByValue }
}

export enum AvailableKey {
  Topic = 'topic',
  QoS = 'qos',
  Payload = 'payload',
  UserProperty = 'user_property',
  ClientAttrs = 'client_attrs',
  Timestamp = 'timestamp',
  Username = 'username',
  ClientID = 'clientid',
  PeerHost = 'peername',
  PublishReceivedAt = 'publish_received_at',
  PubProps = 'pub_props',
  Node = 'node',
  ID = 'id',
  Retain = 'retain',
  Dup = 'flags.dup',
}
export const TARGET_EXPRESSION = 'expression'

export const MESSAGE_TYPE_NONE = 'none'

interface BelongOptItem {
  label: string
  value: string
  children?: Array<BelongOptItem>
}

type BelongOpts = Array<BelongOptItem>

interface AvailableKeyConf {
  key: AvailableKey
  label: string
  configKey?: string
  keys?: Array<string>
  allowSet: boolean
  canSetSubProp?: boolean
  allowUse: boolean
  canUseSubProp?: boolean
  advanced?: boolean
}

type UseMessageTransformFormReturn = {
  availablePropKeyMap: Map<AvailableKey, AvailableKeyConf>
  propBelongArr: Array<AvailableKey>
  propBelongOpts: BelongOpts
  targetBelongArr: Array<string>
  targetBelongOpts: BelongOpts
  subPropReg: RegExp
  targetBelongReg: RegExp
  canSetSubProp: (prop: AvailableKey) => boolean
  canGetSubTarget: (target: string) => boolean
  detectCanSetToPayload: (inType?: string, outType?: string) => boolean
  detectCanSetToPayloadSub: (inType?: string, outType?: string) => boolean
}

export const useMessageTransformForm = (): UseMessageTransformFormReturn => {
  const { t, tl } = useI18nTl('RuleEngine')

  const availableKeyConf = [
    {
      key: AvailableKey.Payload,
      label: t('Clients.payload'),
      allowSet: true,
      canGetSubProp: true,
      allowUse: true,
      canUseSubProp: true,
    },
    {
      key: AvailableKey.Topic,
      label: t('Base.topic'),
      allowSet: true,
      allowUse: true,
    },
    {
      key: AvailableKey.QoS,
      label: 'QoS',
      allowSet: true,
      allowUse: true,
    },
    {
      key: AvailableKey.Retain,
      label: 'Retain',
      allowSet: true,
      allowUse: true,
    },
    {
      key: AvailableKey.UserProperty,
      label: tl('userProperties'),
      /**
       * ‼️ for user property, just can set sub prop
       */
      canSetSubProp: true,
      allowSet: true,
      allowUse: true,
      canUseSubProp: true,
    },
    {
      key: AvailableKey.ClientAttrs,
      label: t('Clients.clientAttrs'),
      allowSet: false,
      allowUse: true,
      canUseSubProp: true,
    },
    {
      key: AvailableKey.Timestamp,
      label: tl('timestamp'),
      allowSet: false,
      allowUse: true,
    },
    {
      key: AvailableKey.Username,
      label: t('Base.username'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.ClientID,
      label: t('Base.clientid'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.PeerHost,
      label: tl('peerHost'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.PublishReceivedAt,
      label: tl('publishedTime'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.PubProps,
      label: tl('pubProps'),
      configKey: 'pub_props.{key}',
      keys: [
        'Message-Expiry-Interval',
        'Topic-Alias',
        'User-Property',
        'Subscription-Identifier',
        'Response-Topic',
        'Correlation-Data',
        'Content-Type',
        'Payload-Format-Indicator',
      ],
      allowSet: false,
      allowUse: true,
      canUseSubProp: true,
      advanced: true,
    },
    {
      key: AvailableKey.Node,
      label: t('Base.node'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.ID,
      label: t('Clients.msgId'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.Dup,
      label: 'Dup',
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
  ]

  const availablePropKeyMap = availableKeyConf.reduce((map, cur) => {
    map.set(cur.key, cur)
    return map
  }, new Map())

  const propBelongs = availableKeyConf.reduce((arr: Array<AvailableKey>, { key: value }) => {
    const conf = availablePropKeyMap.get(value)
    if (conf?.allowSet) {
      arr.push(value)
    }
    return arr
  }, [])

  const targetBelongs = availableKeyConf.reduce((arr: Array<AvailableKey>, { key: value }) => {
    const conf = availablePropKeyMap.get(value)
    if (conf?.allowUse) {
      arr.push(value)
    }
    return arr
  }, [])

  const propsCanSetSub = availableKeyConf.reduce((arr: Array<AvailableKey>, item) => {
    if (item.canSetSubProp) {
      arr.push(item.key)
    }
    return arr
  }, [])
  const targetArrCanUseSub = availableKeyConf.reduce((arr: Array<AvailableKey>, item) => {
    if (item.canUseSubProp) {
      arr.push(item.key)
    }
    return arr
  }, [])
  const targetsCanUseSub = targetArrCanUseSub.map((item) => `${item}.`)

  /**
   * All the available values for prop belong
   */
  const propBelongArr = [...propBelongs]
  /**
   * All the available values for target belong
   */
  const targetBelongArr = targetBelongs.reduce((acc: Array<string>, cur) => {
    acc.push(cur)
    if (targetArrCanUseSub.includes(cur)) {
      acc.push(`${cur}.`)
    }
    return acc
  }, [])

  const ADVANCED_ITEM_VALUE = 'advanced'

  const createOpts = (valueArr: Array<string>) => {
    const ret = valueArr.reduce((arr: BelongOpts, item) => {
      const isParentOpt = item.endsWith('.')
      const keyForGetConf = isParentOpt ? item.slice(0, -1) : item
      const conf = availablePropKeyMap.get(keyForGetConf)
      const label = isParentOpt ? `${item}*` : item
      const optItem = { label, value: item }
      if (conf?.advanced) {
        const advancedItem = arr.find((item) => item.value === ADVANCED_ITEM_VALUE)
        if (!advancedItem) {
          arr.push({ label: tl('moreProp'), value: ADVANCED_ITEM_VALUE, children: [optItem] })
        } else {
          advancedItem.children?.push(optItem)
        }
      } else {
        arr.push(optItem)
      }
      return arr
    }, [])
    // put advanced item to the end
    const advancedItemIndex = ret.findIndex((item) => item.value === ADVANCED_ITEM_VALUE)
    if (advancedItemIndex > -1 && advancedItemIndex < ret.length - 1) {
      const advancedItem = ret[advancedItemIndex]
      ret.splice(advancedItemIndex, 1)
      ret.push(advancedItem)
    }
    return ret
  }

  const propBelongOpts = createOpts(propBelongArr)
  const targetBelongOpts = [
    { label: tl('expression'), value: TARGET_EXPRESSION },
    ...createOpts(targetBelongArr),
  ]

  const canSetSubProp = (prop: AvailableKey) => propsCanSetSub.includes(prop)
  const canGetSubTarget = (target: string) =>
    targetsCanUseSub.includes(target) || target === TARGET_EXPRESSION

  const subPropReg = new RegExp(`^(${propBelongArr.join('|')})\\.`)
  const targetBelongReg = new RegExp(`^(${targetsCanUseSub.join('|')})`)

  /* 
  |                      | none (to encoder) | json              | arvo              | protobuf          |
  | -------------------- | ----------------- | ----------------- | ----------------- | ----------------- |
  | none (from decoder)  | only payload      | only payload      | ✘                 | ✘                 |
  | json                 | all               | all               | all               | all               |
  | arvo                 | ✘                 | only payload.x    | only payload.x    | only payload.x    |
  | protobuf             | ✘                 | only payload.x    | only payload.x    | only payload.x    |
   */
  const detectCanSetToPayload = (inType?: string, outType?: string) => {
    if (!inType || !outType) {
      return true
    }

    return ![SchemaRegistryType.Avro, SchemaRegistryType.Protobuf].includes(
      inType as SchemaRegistryType,
    )
  }

  const detectCanSetToPayloadSub = (inType?: string, outType?: string) => {
    if (!inType || !outType) {
      return true
    }
    return !(
      inType === MESSAGE_TYPE_NONE && [MESSAGE_TYPE_NONE, SchemaRegistryType.JSON].includes(outType)
    )
  }

  return {
    availablePropKeyMap,
    propBelongArr,
    propBelongOpts,
    targetBelongArr,
    targetBelongOpts,
    subPropReg,
    targetBelongReg,
    canSetSubProp,
    canGetSubTarget,
    detectCanSetToPayload,
    detectCanSetToPayloadSub,
  }
}

export const handleTransformData = (): {
  handleDataBeforeSubmit: (data: MessageTransform) => MessageTransform
  handleFetchedData: (data: MessageTransform) => MessageTransform
} => {
  const handleDataBeforeSubmit = (data: MessageTransform): MessageTransform => {
    const ret = cloneDeep(data)
    if (ret.operations?.length === 0) {
      Reflect.deleteProperty(ret, 'operations')
    }
    return ret
  }
  const handleFetchedData = (data: MessageTransform): MessageTransform => {
    if (!data.operations) {
      data.operations = []
    }
    return data
  }
  return {
    handleDataBeforeSubmit,
    handleFetchedData,
  }
}
