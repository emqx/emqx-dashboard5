export interface UserInfo {
  username?: string
  password?: string
  token?: string
  logOut?: boolean
  is_superuser?: boolean
  [key: string]: any
}

export interface VersionInfo {
  latestVersion: string
  isMutiVersion: boolean // Retaining 'isMutiVersion' as used in the component
}

export type Target = '_self' | '_blank' | '_parent' | '_top'

export interface KV<V = any> {
  [key: string]: V
}

/**
 * tree data
 */
// ... (rest of the file if any)
