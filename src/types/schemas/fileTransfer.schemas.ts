export type GetFileTransferFilesClientidFileid503Code =
  typeof GetFileTransferFilesClientidFileid503Code[keyof typeof GetFileTransferFilesClientidFileid503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFilesClientidFileid503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetFileTransferFilesClientidFileid503 = {
  code?: GetFileTransferFilesClientidFileid503Code
  message?: string
}

export type GetFileTransferFilesClientidFileid404Code =
  typeof GetFileTransferFilesClientidFileid404Code[keyof typeof GetFileTransferFilesClientidFileid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFilesClientidFileid404Code = {
  FILES_NOT_FOUND: 'FILES_NOT_FOUND',
} as const

export type GetFileTransferFilesClientidFileid404 = {
  code?: GetFileTransferFilesClientidFileid404Code
  message?: string
}

export type GetFileTransferFiles503Code =
  typeof GetFileTransferFiles503Code[keyof typeof GetFileTransferFiles503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFiles503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetFileTransferFiles503 = {
  code?: GetFileTransferFiles503Code
  message?: string
}

export type GetFileTransferFiles400Code =
  typeof GetFileTransferFiles400Code[keyof typeof GetFileTransferFiles400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFiles400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetFileTransferFiles400 = {
  code?: GetFileTransferFiles400Code
  message?: string
}

export type GetFileTransferFilesParams = {
  following?: FileTransferFollowingParameter
  limit?: PublicLimitParameter
}

export type GetFileTransferFile503Code =
  typeof GetFileTransferFile503Code[keyof typeof GetFileTransferFile503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFile503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetFileTransferFile503 = {
  code?: GetFileTransferFile503Code
  message?: string
}

export type GetFileTransferFile404Code =
  typeof GetFileTransferFile404Code[keyof typeof GetFileTransferFile404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFile404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetFileTransferFile404 = {
  code?: GetFileTransferFile404Code
  message?: string
}

export type GetFileTransferFileParams = {
  node: FileTransferFileNodeParameter
  fileref: FileTransferFileRefParameter
}

export type PublicLimitParameter = number

export type FileTransferFollowingParameter = string

export type FileTransferFileRefParameter = string

export type FileTransferFileNodeParameter = string
