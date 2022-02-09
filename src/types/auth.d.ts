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
