export interface AuthzSetting {
  cache: {
    ttl: string
    unit?: string
  }
}

export interface AuthzSourceItem {
  type: string
  enable: boolean
  rules?: string
  header: {
    [key: string]: string
  }
  img?: string
}

export interface AuthnItem {
  id: string
  mechanism: string
  backend: string
  img?: string
}

export interface BuiltInDBRule {
  permission: string
  action: string
  topic: string
}

export interface BuiltInDBItem {
  rules: BuiltInDBRule[]
  clientid: string
  username: string
}

export type BuiltInDBType = 'username' | 'clientid' | 'all'

export interface DataManagerItem {
  user_id: string
  password: string
  is_superuser: boolean
}
