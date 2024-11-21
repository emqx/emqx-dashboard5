export type PutSchemaRegistryExternalRegistryName404Code =
  typeof PutSchemaRegistryExternalRegistryName404Code[keyof typeof PutSchemaRegistryExternalRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaRegistryExternalRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSchemaRegistryExternalRegistryName404 = {
  code?: PutSchemaRegistryExternalRegistryName404Code
  message?: string
}

export type GetSchemaRegistryExternalRegistryName404Code =
  typeof GetSchemaRegistryExternalRegistryName404Code[keyof typeof GetSchemaRegistryExternalRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSchemaRegistryExternalRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSchemaRegistryExternalRegistryName404 = {
  code?: GetSchemaRegistryExternalRegistryName404Code
  message?: string
}

export type PostSchemaRegistryExternal400Code =
  typeof PostSchemaRegistryExternal400Code[keyof typeof PostSchemaRegistryExternal400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaRegistryExternal400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostSchemaRegistryExternal400 = {
  code?: PostSchemaRegistryExternal400Code
  message?: string
}

export type GetSchemaRegistryExternal200Name = {
  $name?: SchemaRegistryConfluentSchemaRegistry
}

export type GetSchemaRegistryExternal200 = {
  $name?: GetSchemaRegistryExternal200Name
}

export type DeleteSchemaRegistryName404Code =
  typeof DeleteSchemaRegistryName404Code[keyof typeof DeleteSchemaRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSchemaRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteSchemaRegistryName404 = {
  code?: DeleteSchemaRegistryName404Code
  message?: string
}

export type PutSchemaRegistryName404Code =
  typeof PutSchemaRegistryName404Code[keyof typeof PutSchemaRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSchemaRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutSchemaRegistryName404 = {
  code?: PutSchemaRegistryName404Code
  message?: string
}

export type PutSchemaRegistryName200 =
  | SchemaRegistryJson
  | SchemaRegistryProtobuf
  | SchemaRegistryAvro

export type PutSchemaRegistryNameBody =
  | SchemaRegistryJson
  | SchemaRegistryProtobuf
  | SchemaRegistryAvro

export type GetSchemaRegistryName404Code =
  typeof GetSchemaRegistryName404Code[keyof typeof GetSchemaRegistryName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSchemaRegistryName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetSchemaRegistryName404 = {
  code?: GetSchemaRegistryName404Code
  message?: string
}

export type PostSchemaRegistry400Code =
  typeof PostSchemaRegistry400Code[keyof typeof PostSchemaRegistry400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSchemaRegistry400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostSchemaRegistry400 = {
  code?: PostSchemaRegistry400Code
  message?: string
}

export type SchemaRegistryProtobufType =
  typeof SchemaRegistryProtobufType[keyof typeof SchemaRegistryProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryProtobufType = {
  protobuf: 'protobuf',
} as const

export interface SchemaRegistryProtobuf {
  type: SchemaRegistryProtobufType
  source: string
  description?: string
}

export type SchemaRegistryJsonType =
  typeof SchemaRegistryJsonType[keyof typeof SchemaRegistryJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryJsonType = {
  json: 'json',
} as const

export interface SchemaRegistryJson {
  type: SchemaRegistryJsonType
  source: string
  description?: string
}

export type SchemaRegistryGetProtobufType =
  typeof SchemaRegistryGetProtobufType[keyof typeof SchemaRegistryGetProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetProtobufType = {
  protobuf: 'protobuf',
} as const

export interface SchemaRegistryGetProtobuf {
  name: string
  type: SchemaRegistryGetProtobufType
  source: string
  description?: string
}

export type SchemaRegistryGetJsonType =
  typeof SchemaRegistryGetJsonType[keyof typeof SchemaRegistryGetJsonType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetJsonType = {
  json: 'json',
} as const

export interface SchemaRegistryGetJson {
  name: string
  type: SchemaRegistryGetJsonType
  source: string
  description?: string
}

export type PostSchemaRegistryBody =
  | SchemaRegistryGetJson
  | SchemaRegistryGetProtobuf
  | SchemaRegistryGetAvro

export type SchemaRegistryGetAvroType =
  typeof SchemaRegistryGetAvroType[keyof typeof SchemaRegistryGetAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryGetAvroType = {
  avro: 'avro',
} as const

export interface SchemaRegistryGetAvro {
  name: string
  type: SchemaRegistryGetAvroType
  source: string
  description?: string
}

export type GetSchemaRegistryName200 =
  | SchemaRegistryGetJson
  | SchemaRegistryGetProtobuf
  | SchemaRegistryGetAvro

export type PostSchemaRegistry201 =
  | SchemaRegistryGetJson
  | SchemaRegistryGetProtobuf
  | SchemaRegistryGetAvro

export type GetSchemaRegistry200Item =
  | SchemaRegistryGetJson
  | SchemaRegistryGetProtobuf
  | SchemaRegistryGetAvro

export type SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType =
  typeof SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType[keyof typeof SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType = {
  confluent: 'confluent',
} as const

export interface SchemaRegistryConfluentSchemaRegistryAuthBasic {
  username: string
  password: string
}

export type SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryAuth =
  | SchemaRegistryConfluentSchemaRegistryAuthBasic
  | 'none'

export interface SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistry {
  name: string
  type?: SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryType
  url: string
  auth?: SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistryAuth
}

export type SchemaRegistryConfluentSchemaRegistryAuth =
  | SchemaRegistryConfluentSchemaRegistryAuthBasic
  | 'none'

export type SchemaRegistryConfluentSchemaRegistryType =
  typeof SchemaRegistryConfluentSchemaRegistryType[keyof typeof SchemaRegistryConfluentSchemaRegistryType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryConfluentSchemaRegistryType = {
  confluent: 'confluent',
} as const

export interface SchemaRegistryConfluentSchemaRegistry {
  type?: SchemaRegistryConfluentSchemaRegistryType
  url: string
  auth?: SchemaRegistryConfluentSchemaRegistryAuth
}

export type SchemaRegistryAvroType =
  typeof SchemaRegistryAvroType[keyof typeof SchemaRegistryAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SchemaRegistryAvroType = {
  avro: 'avro',
} as const

export interface SchemaRegistryAvro {
  type: SchemaRegistryAvroType
  source: string
  description?: string
}
