import http from '@/common/http'
import type {
  CurrentUser,
  CurrentUserPasswordUpdate,
  CurrentUserMFAUpdate,
} from '@/types/typeAlias'
import { ListDataWithPagination } from '@/types/common'
import {
  BannedFormForCreate,
  BannedItem,
  UserFormForCreate,
  UserFormForUpdate,
  UserItem,
} from '@/types/systemModule'

export function loadUser(): Promise<Array<UserItem>> {
  return http.get('/users')
}

export function createUser(body: UserFormForCreate): Promise<UserItem> {
  return http.post(`/users`, body)
}

export function updateUser(
  username: string,
  body: UserFormForUpdate,
  backend?: string,
): Promise<UserItem> {
  return http.put(
    `/users/${encodeURIComponent(username)}`,
    body,
    backend ? { params: { backend } } : undefined,
  )
}

export function loadCurrentUser(): Promise<CurrentUser> {
  return http.get('/current_user')
}

export function changePassword(body: CurrentUserPasswordUpdate): Promise<void> {
  return http.post('/current_user/change_pwd', body)
}

export function updateCurrentUserMfa(body: CurrentUserMFAUpdate): Promise<void> {
  return http.post('/current_user/mfa', body)
}

export function deleteCurrentUserMfa(): Promise<void> {
  return http.delete('/current_user/mfa')
}

export function destroyUser(username: string, backend?: string): Promise<void> {
  return http.delete(
    `/users/${encodeURIComponent(username)}`,
    backend ? { params: { backend } } : undefined,
  )
}

export function updateUserMfa(
  username: string,
  body: { mechanism: string },
  query?: { backend?: string },
): Promise<void> {
  return http.post(
    `/users/${encodeURIComponent(username)}/mfa`,
    body,
    query ? { params: query } : undefined,
  )
}

export function deleteUserMfa(
  username: string,
  params?: { reset?: boolean; backend?: string },
): Promise<void> {
  return http.delete(`/users/${encodeURIComponent(username)}/mfa`, params ? { params } : undefined)
}

export function loadBannedClient(params = {}): Promise<ListDataWithPagination<BannedItem>> {
  return http.get('/banned', { params })
}

export function createBannedClient(body: BannedFormForCreate): Promise<BannedItem> {
  return http.post('/banned', body)
}

export function deleteBannedClient({ who, as }: Pick<BannedItem, 'who' | 'as'>): Promise<void> {
  return http.delete(`/banned/${as}/${encodeURIComponent(who)}`)
}

export function clearAllBannedClients(): Promise<void> {
  return http.delete('/banned')
}

export default {}
