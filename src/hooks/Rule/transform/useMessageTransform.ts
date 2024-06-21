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
  Qos = 'qos',
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

const availableKeyConf = [
  {
    key: AvailableKey.Topic,
    allowSet: true,
    allowUse: true,
  },
  {
    key: AvailableKey.Qos,
    allowSet: true,
    allowUse: true,
  },
  {
    key: AvailableKey.Payload,
    canUseProp: true,
    keys: '*',
    allowSet: true,
    allowUse: true,
  },
  {
    key: AvailableKey.UserProperty,
    configKey: 'pub_props.User-Property.{key}',
    canUseProp: true,
    keys: '*',
    allowSet: true,
    allowUse: true,
  },
  {
    key: AvailableKey.ClientAttrs,
    configKey: 'client_attrs.{key}',
    canUseProp: true,
    keys: '*',
    allowSet: false,
    allowUse: true,
  },
  {
    key: AvailableKey.Timestamp,
    allowSet: false,
    allowUse: true,
  },
  {
    key: AvailableKey.Event,
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.Username,
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.ClientID,
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.PeerHost,
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.PublishReceivedAt,
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.PubProps,
    configKey: 'pub_props.{key}',
    canUseProp: true,
    // MQTT 发布属性
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
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.ID,
    allowSet: false,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.Retain,
    allowSet: true,
    allowUse: true,
    advanced: true,
  },
  {
    key: AvailableKey.Dup,
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

export const useMessageTransformForm = () => {
  const propsCanUseSub = availableKeyConf.reduce((arr: Array<AvailableKey>, item) => {
    if (item.canUseProp) {
      arr.push(item.key)
    }
    return arr
  }, [])
  const targetsCanSetSub = [...propsCanUseSub.map((target) => `${target}.`)]

  const propBelongOpts = [...propBelongs]
  const targetBelongOpts = targetBelongs.reduce((acc: Array<string>, cur, index) => {
    acc.push(cur)
    if (propsCanUseSub.includes(cur)) {
      acc.push(`${cur}.`)
    }
    if (index === targetBelongs.length - 1) {
      acc.push(TARGET_EXPRESSION)
    }
    return acc
  }, [])

  const canGetSubProp = (prop: AvailableKey) => propsCanUseSub.includes(prop)
  const canSetSubTarget = (target: string) =>
    targetsCanSetSub.includes(target) || target === TARGET_EXPRESSION

  const subPropReg = new RegExp(`^(${propBelongOpts.join('|')})\\.`)
  const targetBelongReg = new RegExp(`^(${targetsCanSetSub.join('|')})`)

  return {
    propBelongOpts,
    targetBelongOpts,
    subPropReg,
    targetBelongReg,
    canGetSubProp,
    canSetSubTarget,
  }
}
