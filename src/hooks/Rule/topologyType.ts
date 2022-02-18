import { RuleOutput } from '@/types/enum'

/**
 * except console & republish
 */
export enum OtherNodeType {
  Bridge = 'bridge',
  Event = 'event',
  Rule = 'rule',
  Topic = 'topic',
}
export type RuleInputType = OtherNodeType.Bridge | OtherNodeType.Event | OtherNodeType.Topic
export type RuleOutputType = OtherNodeType.Bridge | RuleOutput
export type NodeType = OtherNodeType | RuleOutput

export interface EdgeItem {
  source: string
  target: string
}
export interface NodeItem {
  id: string
  label: string
  img: SVGElement
  style?: {
    cursor: 'pointer'
  }
  labelCfg?: {
    style?: {
      cursor: 'pointer'
    }
  }
}
