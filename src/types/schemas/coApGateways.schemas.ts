export type PostGatewaysCoapClientsClientidRequest504Code =
  (typeof PostGatewaysCoapClientsClientidRequest504Code)[keyof typeof PostGatewaysCoapClientsClientidRequest504Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequest504Code = {
  CLIENT_NOT_RESPONSE: 'CLIENT_NOT_RESPONSE',
} as const

export type PostGatewaysCoapClientsClientidRequest504 = {
  code?: PostGatewaysCoapClientsClientidRequest504Code
  message?: string
}

export type PostGatewaysCoapClientsClientidRequest502Code =
  (typeof PostGatewaysCoapClientsClientidRequest502Code)[keyof typeof PostGatewaysCoapClientsClientidRequest502Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequest502Code = {
  CLIENT_BAD_RESPONSE: 'CLIENT_BAD_RESPONSE',
} as const

export type PostGatewaysCoapClientsClientidRequest502 = {
  code?: PostGatewaysCoapClientsClientidRequest502Code
  message?: string
}

export type PostGatewaysCoapClientsClientidRequest404Code =
  (typeof PostGatewaysCoapClientsClientidRequest404Code)[keyof typeof PostGatewaysCoapClientsClientidRequest404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequest404Code = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
} as const

export type PostGatewaysCoapClientsClientidRequest404 = {
  code?: PostGatewaysCoapClientsClientidRequest404Code
  message?: string
}

export type PostGatewaysCoapClientsClientidRequest400Code =
  (typeof PostGatewaysCoapClientsClientidRequest400Code)[keyof typeof PostGatewaysCoapClientsClientidRequest400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequest400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostGatewaysCoapClientsClientidRequest400 = {
  code?: PostGatewaysCoapClientsClientidRequest400Code
  message?: string
}

export type PostGatewaysCoapClientsClientidRequest200 = {
  id?: number
  method?: string
  payload?: string
  token?: string
}

export type PostGatewaysCoapClientsClientidRequestBodyMethod =
  (typeof PostGatewaysCoapClientsClientidRequestBodyMethod)[keyof typeof PostGatewaysCoapClientsClientidRequestBodyMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequestBodyMethod = {
  delete: 'delete',
  get: 'get',
  post: 'post',
  put: 'put',
} as const

export type PostGatewaysCoapClientsClientidRequestBodyContentType =
  (typeof PostGatewaysCoapClientsClientidRequestBodyContentType)[keyof typeof PostGatewaysCoapClientsClientidRequestBodyContentType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequestBodyContentType = {
  'application/json': 'application/json',
  'application/octet-stream': 'application/octet-stream',
  'text/plain': 'text/plain',
} as const

export type PostGatewaysCoapClientsClientidRequestBody = {
  content_type?: PostGatewaysCoapClientsClientidRequestBodyContentType
  method?: PostGatewaysCoapClientsClientidRequestBodyMethod
  payload?: string
  timeout?: string
  token?: string
}
