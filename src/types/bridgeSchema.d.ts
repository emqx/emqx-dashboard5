import { PropType } from '@/types/enum'

type Required = Array<string>

// TODO: move it to src/types/schemaForm.d.ts
export interface PropBase {
  description: string
  label: string
}

export interface PropArray extends PropBase {
  type: PropType.Array
  items: {
    $ref: string
  }
}

export interface PropEnum extends PropBase {
  type: PropType.Enum
  symbols: Array<string> | Array<number>
}

export interface PropString extends PropBase {
  type: PropType.String
  default?: string | number
}

export interface PropBoolean extends PropBase {
  type: PropType.Boolean
  default?: boolean
}

/**
 * use src/components/TimeInputWithUnitSelect.vue
 */
export interface PropDuration extends PropBase {
  type: PropType.Duration
  default?: string
}

export interface PropNumber extends PropBase {
  type: PropType.Number
  minium?: number
  default?: number
}

export interface PropIPPort extends PropBase {
  type: PropType.IPPort
}

/**
 * can use src/components/InputWithUnit.vue
 */
export interface PropByteSize extends PropBase {
  type: PropType.ByteSize
  default: string
}

type OneOfItem =
  | { $ref: string }
  | { type: string }
  | { symbols: Array<number>; type: PropType.Enum }
export interface PropOneOf extends PropBase {
  oneOf: Array<OneOfItem>
  example?: string
}

export type Properties = Record<
  string,
  | PropArray
  | PropEnum
  | PropString
  | PropBoolean
  | PropDuration
  | PropNumber
  | PropIPPort
  | PropByteSize
  | PropOneOf
>

export interface Component {
  required: Required
  properties: Properties
  // seems useless
  type: 'object'
}

export interface Schema {
  components: {
    schemas: Record<string, Component>
  }
  // useless blow
  info: {
    title: string
    version: string
  }
  paths: any
}
