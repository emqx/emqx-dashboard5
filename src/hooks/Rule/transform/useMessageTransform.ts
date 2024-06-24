import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { MessageTransformFailureAction, MessageTransformLogLevel } from '@/types/typeAlias'

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
  UserProperty = 'pub_props.User-Property',
  ClientAttrs = 'client_attrs',
  Timestamp = 'timestamp',
  Event = 'event',
  Username = 'username',
  ClientID = 'clientid',
  PeerHost = 'peerhost',
  PublishReceivedAt = 'publish_received_at',
  PubProps = 'pub_props',
  Node = 'node',
  ID = 'id',
  Retain = 'flags.retain',
  Dup = 'flags.dup',
}
export const TARGET_EXPRESSION = 'expression'

interface BelongOptItem {
  label: string
  value: string
  children?: Array<BelongOptItem>
}

type BelongOpts = Array<BelongOptItem>

export const useMessageTransformForm = () => {
  const { t, tl } = useI18nTl('RuleEngine')

  const availableKeyConf = [
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
      key: AvailableKey.Payload,
      label: t('Clients.payload'),
      canUseProp: true,
      allowSet: true,
      allowUse: true,
    },
    {
      key: AvailableKey.UserProperty,
      label: tl('userProperties'),
      canUseProp: true,
      allowSet: true,
      allowUse: true,
    },
    {
      key: AvailableKey.ClientAttrs,
      label: t('Clients.clientAttrs'),
      canUseProp: true,
      allowSet: false,
      allowUse: true,
    },
    {
      key: AvailableKey.Timestamp,
      label: tl('timestamp'),
      allowSet: false,
      allowUse: true,
    },
    {
      key: AvailableKey.Event,
      label: tl('event'),
      allowSet: false,
      allowUse: true,
      advanced: true,
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
      canUseProp: true,
      keys: [
        'Message-Expiry-Interval',
        'Topic-Alias',
        'User-Property',
        'User-Property-Pairs',
        'Subscription-Identifier',
        'Response-Topic',
        'Correlation-Data',
        'Content-Type',
      ],
      allowSet: false,
      allowUse: true,
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
      label: t('Base.msgId'),
      allowSet: false,
      allowUse: true,
      advanced: true,
    },
    {
      key: AvailableKey.Retain,
      label: 'Retain',
      allowSet: true,
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

  const propBelongs = Object.values(AvailableKey).reduce((arr: Array<AvailableKey>, value) => {
    const conf = availablePropKeyMap.get(value)
    if (conf?.allowUse) {
      arr.push(value)
    }
    return arr
  }, [])

  const targetBelongs = Object.values(AvailableKey).reduce((arr: Array<AvailableKey>, value) => {
    const conf = availablePropKeyMap.get(value)
    if (conf?.allowSet) {
      arr.push(value)
    }
    return arr
  }, [])

  const propsCanUseSub = availableKeyConf.reduce((arr: Array<AvailableKey>, item) => {
    if (item.canUseProp) {
      arr.push(item.key)
    }
    return arr
  }, [])
  const targetsCanSetSub = [...propsCanUseSub.map((target) => `${target}.`)]
  /**
   * All the available values for prop belong
   */
  const propBelongArr = [...propBelongs]
  /**
   * All the available values for target belong
   */
  const targetBelongArr = targetBelongs.reduce((acc: Array<string>, cur, index) => {
    acc.push(cur)
    if (propsCanUseSub.includes(cur)) {
      acc.push(`${cur}.`)
    }
    return acc
  }, [])

  const ADVANCED_ITEM_VALUE = 'advanced'

  const createOpts = (valueArr: Array<string>) => {
    return valueArr.reduce(
      (arr: BelongOpts, item) => {
        const conf = availablePropKeyMap.get(item)
        const optItem = { label: conf?.label || item, value: item }
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
      },
      [{ label: tl('expression'), value: TARGET_EXPRESSION }],
    )
  }

  const propBelongOpts = createOpts(propBelongArr)
  const targetBelongOpts = createOpts(targetBelongArr)

  const canGetSubProp = (prop: AvailableKey) => propsCanUseSub.includes(prop)
  const canSetSubTarget = (target: string) =>
    targetsCanSetSub.includes(target) || target === TARGET_EXPRESSION

  const subPropReg = new RegExp(`^(${propBelongArr.join('|')})\\.`)
  const targetBelongReg = new RegExp(`^(${targetsCanSetSub.join('|')})`)

  return {
    availablePropKeyMap,
    propBelongArr,
    propBelongOpts,
    targetBelongArr,
    targetBelongOpts,
    subPropReg,
    targetBelongReg,
    canGetSubProp,
    canSetSubTarget,
  }
}
