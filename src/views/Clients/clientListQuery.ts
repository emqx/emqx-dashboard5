export enum ClientListComparator {
  After = 'gte',
  Before = 'lte',
}

export enum ClientListSearchType {
  Exact = 'exact',
  Fuzzy = 'fuzzy',
}

export type ClientListQueryParams = {
  like_username?: string
  username?: string | string[]
  like_clientid?: string
  clientid?: string | string[]
  node?: string
  ip_address?: string
  conn_state?: string
  gte_connected_at?: string
  lte_connected_at?: string
}

const CONNECTED_AT_SUFFIX = '_connected_at'

const toArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value])

export const genClientListQueryParams = (params: Record<string, any>): ClientListQueryParams => {
  const {
    clientid,
    username,
    node,
    ip_address,
    conn_state,
    comparator,
    connected_at,
    usernameSearchType,
    clientidSearchType,
  } = params

  const addLikeParam = (key: string, value: string, searchType: string) => {
    if (!value) return undefined

    const isFuzzy = searchType === ClientListSearchType.Fuzzy
    const _key = isFuzzy ? `like_${key}` : key
    const _value = isFuzzy ? value : value.split(',')

    return { [_key]: _value }
  }

  const newParams: Record<string, any> = {
    ...addLikeParam('clientid', clientid, clientidSearchType),
    ...addLikeParam('username', username, usernameSearchType),
    node: node || undefined,
    ip_address: ip_address || undefined,
    conn_state: conn_state || undefined,
  }

  if (connected_at) {
    newParams[`${comparator}${CONNECTED_AT_SUFFIX}`] = new Date(connected_at).toISOString()
  }

  return newParams
}

export const doesClientMatchClientListQuery = (
  client: Record<string, any>,
  params: ClientListQueryParams,
): boolean => {
  const {
    username,
    node,
    ip_address,
    conn_state,
    like_username,
    gte_connected_at,
    lte_connected_at,
  } = params

  if (username && !toArray(username).includes(client.username)) {
    return false
  }
  if (node && client.node !== node) {
    return false
  }
  if (ip_address && client.ip_address !== ip_address) {
    return false
  }
  if (conn_state && client.connected !== (conn_state === 'connected')) {
    return false
  }
  if (like_username && client.username.indexOf(like_username) === -1) {
    return false
  }
  if (
    gte_connected_at &&
    new Date(client.connected_at).getTime() < new Date(gte_connected_at).getTime()
  ) {
    return false
  }
  if (
    lte_connected_at &&
    new Date(client.connected_at).getTime() > new Date(lte_connected_at).getTime()
  ) {
    return false
  }
  return true
}

export { CONNECTED_AT_SUFFIX }
