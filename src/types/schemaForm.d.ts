import { FormRules } from './common'

export type InjectSchema = Ref<any> | undefined

export interface Property {
  $ref?: string
  description: string
  /**
   * If `deprecated` has a value, it means that the component here has been deprecated before
   * or will be deprecated at some later date.
   */
  deprecated: string | boolean
  label: string
  labelKey?: string
  // for block title
  title?: string
  default: any
  symbols?: Array<string | number | boolean>
  type: string
  maximum?: number | string
  minimum?: number | string
  key?: string
  path?: string
  readOnly?: boolean
  items: Properties[string]
  component: string
  clearable: boolean
  oneOf?: Properties[string][]
  properties?: Properties
  // these two is for oneof
  selectedOneof?: Properties
  useNewCom?: boolean
  format?: string
  is_template?: boolean
  /**
   * It is possible to customize the props of component here, with the highest priority.
   */
  componentProps: Record<string, any>
  /**
   * exist in oneof refs item
   */
  rules?: FormRules | any
  placeholder?: string
}

export interface Properties {
  [key: string]: Property
}

export interface Component {
  type: string
  properties: Properties
  required?: Array<string>
}

export interface Components {
  schemas: {
    [key: string]: {
      type: string
      properties: Properties
      required?: string[]
    }
  }
}

export interface Schema {
  components: Components
  paths: {
    [key: string]: {
      get: {
        type: string
        properties: Properties
        $ref?: string
      }
      put: {
        $ref: string
      }
    }
  }
}
