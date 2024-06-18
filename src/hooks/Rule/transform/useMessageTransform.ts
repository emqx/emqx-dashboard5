import { createRandomString, getLabelFromValueInOptionList } from '@/common/tools'
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

export enum PropBelong {
  Topic = 'topic',
  Payload = 'payload',
  ClientID = 'clientid',
}

export enum TargetBelong {
  ClientAttrs = 'client_attrs',
  Timestamp = 'timestamp',
  Expression = 'expression',
}

export const useMessageTransformForm = () => {
  const propBelongOpts = Object.values(PropBelong)
  const targetBelongOpts = Object.values(TargetBelong)

  const propsCanGetSub = [PropBelong.Payload]
  const targetsCanSetSub = [TargetBelong.ClientAttrs]

  const canGetSubProp = (prop: PropBelong) => propsCanGetSub.includes(prop)
  const canSetSubTarget = (target: TargetBelong) => targetsCanSetSub.includes(target)

  const subPropReg = new RegExp(`^(${propBelongOpts.join('|')})\\.`)
  const targetBelongReg = new RegExp(`^(${Object.values(TargetBelong).join('|')})\\.`)

  return {
    propBelongOpts,
    targetBelongOpts,
    subPropReg,
    targetBelongReg,
    canGetSubProp,
    canSetSubTarget,
  }
}
