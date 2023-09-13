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
  | EmqxSchemaRegistrySchemaProtobuf
  | EmqxSchemaRegistrySchemaAvro

export type PutSchemaRegistryNameBody =
  | EmqxSchemaRegistrySchemaProtobuf
  | EmqxSchemaRegistrySchemaAvro

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

export type GetSchemaRegistryName200 =
  | EmqxSchemaRegistrySchemaGetProtobuf
  | EmqxSchemaRegistrySchemaGetAvro

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

export type PostSchemaRegistry201 =
  | EmqxSchemaRegistrySchemaGetProtobuf
  | EmqxSchemaRegistrySchemaGetAvro

export type GetSchemaRegistry200Item =
  | EmqxSchemaRegistrySchemaGetProtobuf
  | EmqxSchemaRegistrySchemaGetAvro

export type EmqxSchemaRegistrySchemaProtobufType =
  typeof EmqxSchemaRegistrySchemaProtobufType[keyof typeof EmqxSchemaRegistrySchemaProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSchemaRegistrySchemaProtobufType = {
  protobuf: 'protobuf',
} as const

export interface EmqxSchemaRegistrySchemaProtobuf {
  type: EmqxSchemaRegistrySchemaProtobufType
  source: string
  description?: string
}

export type EmqxSchemaRegistrySchemaGetProtobufType =
  typeof EmqxSchemaRegistrySchemaGetProtobufType[keyof typeof EmqxSchemaRegistrySchemaGetProtobufType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSchemaRegistrySchemaGetProtobufType = {
  protobuf: 'protobuf',
} as const

export interface EmqxSchemaRegistrySchemaGetProtobuf {
  name: string
  type: EmqxSchemaRegistrySchemaGetProtobufType
  source: string
  description?: string
}

export type EmqxSchemaRegistrySchemaGetAvroType =
  typeof EmqxSchemaRegistrySchemaGetAvroType[keyof typeof EmqxSchemaRegistrySchemaGetAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSchemaRegistrySchemaGetAvroType = {
  avro: 'avro',
} as const

export interface EmqxSchemaRegistrySchemaGetAvro {
  name: string
  type: EmqxSchemaRegistrySchemaGetAvroType
  source: string
  description?: string
}

export type PostSchemaRegistryBody =
  | EmqxSchemaRegistrySchemaGetProtobuf
  | EmqxSchemaRegistrySchemaGetAvro

export type EmqxSchemaRegistrySchemaAvroType =
  typeof EmqxSchemaRegistrySchemaAvroType[keyof typeof EmqxSchemaRegistrySchemaAvroType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSchemaRegistrySchemaAvroType = {
  avro: 'avro',
} as const

export interface EmqxSchemaRegistrySchemaAvro {
  type: EmqxSchemaRegistrySchemaAvroType
  source: string
  description?: string
}
