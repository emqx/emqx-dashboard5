export type InjectSchema = Ref<any> | undefined

export interface Properties {
  [key: string]: {
    $ref?: string
    description: string
    label: string
    default: any
    symbols?: string[]
    type: string
    maximum?: number
    minimum?: number
    path?: string
    readOnly?: boolean
    items: Properties[string]
    oneOf: Properties[string][]
    properties?: Properties
  }
}

export interface Component {
  type: string
  properties: Properties
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
