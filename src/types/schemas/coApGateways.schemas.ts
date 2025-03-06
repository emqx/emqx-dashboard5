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
  get: 'get',
  put: 'put',
  post: 'post',
  delete: 'delete',
} as const

export type PostGatewaysCoapClientsClientidRequestBodyContentType =
  (typeof PostGatewaysCoapClientsClientidRequestBodyContentType)[keyof typeof PostGatewaysCoapClientsClientidRequestBodyContentType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGatewaysCoapClientsClientidRequestBodyContentType = {
  'text/plain': 'text/plain',
  'application/json': 'application/json',
  'application/octet-stream': 'application/octet-stream',
} as const

export type PostGatewaysCoapClientsClientidRequestBody = {
  content_type?: PostGatewaysCoapClientsClientidRequestBodyContentType
  method?: PostGatewaysCoapClientsClientidRequestBodyMethod
  payload?: string
  timeout?: string
  token?: string
}
