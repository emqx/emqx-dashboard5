export type PostGatewaysLwm2mClientsClientidWrite404Code =
  typeof PostGatewaysLwm2mClientsClientidWrite404Code[keyof typeof PostGatewaysLwm2mClientsClientidWrite404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysLwm2mClientsClientidWrite404Code = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
} as const

export type PostGatewaysLwm2mClientsClientidWrite404 = {
  code?: PostGatewaysLwm2mClientsClientidWrite404Code
  message?: string
}

export type PostGatewaysLwm2mClientsClientidWriteType =
  typeof PostGatewaysLwm2mClientsClientidWriteType[keyof typeof PostGatewaysLwm2mClientsClientidWriteType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysLwm2mClientsClientidWriteType = {
  Integer: 'Integer',
  Float: 'Float',
  Time: 'Time',
  String: 'String',
  Boolean: 'Boolean',
  Opaque: 'Opaque',
  Objlnk: 'Objlnk',
} as const

export type PostGatewaysLwm2mClientsClientidWriteParams = {
  path: string
  type: PostGatewaysLwm2mClientsClientidWriteType
  value: string
}

export type PostGatewaysLwm2mClientsClientidRead404Code =
  typeof PostGatewaysLwm2mClientsClientidRead404Code[keyof typeof PostGatewaysLwm2mClientsClientidRead404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysLwm2mClientsClientidRead404Code = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
} as const

export type PostGatewaysLwm2mClientsClientidRead404 = {
  code?: PostGatewaysLwm2mClientsClientidRead404Code
  message?: string
}

export type PostGatewaysLwm2mClientsClientidReadParams = {
  path: string
}

export type PostGatewaysLwm2mClientsClientidObserve404Code =
  typeof PostGatewaysLwm2mClientsClientidObserve404Code[keyof typeof PostGatewaysLwm2mClientsClientidObserve404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysLwm2mClientsClientidObserve404Code = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
} as const

export type PostGatewaysLwm2mClientsClientidObserve404 = {
  code?: PostGatewaysLwm2mClientsClientidObserve404Code
  message?: string
}

export type PostGatewaysLwm2mClientsClientidObserveParams = {
  path: string
  enable: boolean
}

export type GetGatewaysLwm2mClientsClientidLookup404Code =
  typeof GetGatewaysLwm2mClientsClientidLookup404Code[keyof typeof GetGatewaysLwm2mClientsClientidLookup404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysLwm2mClientsClientidLookup404Code = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
} as const

export type GetGatewaysLwm2mClientsClientidLookup404 = {
  code?: GetGatewaysLwm2mClientsClientidLookup404Code
  message?: string
}

export type GetGatewaysLwm2mClientsClientidLookup200 = {
  clientid?: string
  path?: string
  action?: string
  codeMsg?: string
  content?: Lwm2mResource[]
}

export type GetGatewaysLwm2mClientsClientidLookupParams = {
  path: string
  action: string
}

export type Lwm2mResourceDataType = typeof Lwm2mResourceDataType[keyof typeof Lwm2mResourceDataType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Lwm2mResourceDataType = {
  Integer: 'Integer',
  Float: 'Float',
  Time: 'Time',
  String: 'String',
  Boolean: 'Boolean',
  Opaque: 'Opaque',
  Objlnk: 'Objlnk',
} as const

export interface Lwm2mResource {
  dataType?: Lwm2mResourceDataType
  name?: string
  operations?: string
  path?: string
}
