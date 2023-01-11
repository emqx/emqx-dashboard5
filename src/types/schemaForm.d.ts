export type InjectSchema = Ref<any> | undefined

export interface Property {
  $ref?: string
  description: string
  /**
   * If `deprecated` has a value, it means that the component here has been deprecated before
   * or will be deprecated at some later date.
   */
  deprecated: string
  label: string
  default: any
  symbols?: string[]
  type: string
  maximum?: number
  minimum?: number
  path?: string
  readOnly?: boolean
  items: Properties[string]
  component: string
  clearable: boolean
  oneOf: Properties[string][]
  properties?: Properties
  format?: string
  /**
   * It is possible to customize the props of component here, with the highest priority.
   */
  componentProps: Record<string, any>
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
