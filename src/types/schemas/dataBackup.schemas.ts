export type PostDataImport400Code =
  (typeof PostDataImport400Code)[keyof typeof PostDataImport400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostDataImport400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostDataImport400 = {
  code?: PostDataImport400Code
  message?: string
}

export type DeleteDataFilesFilename404Code =
  (typeof DeleteDataFilesFilename404Code)[keyof typeof DeleteDataFilesFilename404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteDataFilesFilename404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteDataFilesFilename404 = {
  code?: DeleteDataFilesFilename404Code
  message?: string
}

export type DeleteDataFilesFilename400Code =
  (typeof DeleteDataFilesFilename400Code)[keyof typeof DeleteDataFilesFilename400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteDataFilesFilename400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteDataFilesFilename400 = {
  code?: DeleteDataFilesFilename400Code
  message?: string
}

export type DeleteDataFilesFilenameParams = {
  node?: string
}

export type GetDataFilesFilename404Code =
  (typeof GetDataFilesFilename404Code)[keyof typeof GetDataFilesFilename404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetDataFilesFilename404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetDataFilesFilename404 = {
  code?: GetDataFilesFilename404Code
  message?: string
}

export type GetDataFilesFilename400Code =
  (typeof GetDataFilesFilename400Code)[keyof typeof GetDataFilesFilename400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetDataFilesFilename400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetDataFilesFilename400 = {
  code?: GetDataFilesFilename400Code
  message?: string
}

export type GetDataFilesFilename200 =
  (typeof GetDataFilesFilename200)[keyof typeof GetDataFilesFilename200]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetDataFilesFilename200 = {
  binary: 'binary',
} as const

export type GetDataFilesFilenameParams = {
  node?: string
}

export type PostDataFiles400Code = (typeof PostDataFiles400Code)[keyof typeof PostDataFiles400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostDataFiles400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostDataFiles400 = {
  code?: PostDataFiles400Code
  message?: string
}

export type PostDataFilesBody = {
  filename?: Blob
}

export type PostDataExport500Code =
  (typeof PostDataExport500Code)[keyof typeof PostDataExport500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostDataExport500Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostDataExport500 = {
  code?: PostDataExport500Code
  message?: string
}

export type PostDataExport400Code =
  (typeof PostDataExport400Code)[keyof typeof PostDataExport400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostDataExport400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostDataExport400 = {
  code?: PostDataExport400Code
  message?: string
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetDataFilesParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export interface PublicMeta {
  /** @minimum 0 */
  count?: number
  hasnext: boolean
  /**
   * @minimum 1
   * @maximum 10000
   */
  limit?: number
  /** @minimum 1 */
  page?: number
}

export interface EmqxMgmtApiDataBackupImportRequestBody {
  filename: string
  node?: string
}

export interface EmqxMgmtApiDataBackupFilesResponse {
  data?: EmqxMgmtApiDataBackupBackupFileInfo[]
  meta?: PublicMeta
}

export interface EmqxMgmtApiDataBackupExportRequestBody {
  root_keys?: string[]
  table_sets?: string[]
}

export interface EmqxMgmtApiDataBackupBackupFileInfo {
  created_at: string
  filename: string
  node: string
}
