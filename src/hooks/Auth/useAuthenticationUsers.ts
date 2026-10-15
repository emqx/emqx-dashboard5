import {
  createAuthnUsers,
  deleteAuthnUser,
  loadAuthnUsers,
  rotateAuthnUserPassword,
  updateAuthnUser,
} from '@/api/auth'
import {
  addGatewayUserManagement,
  deleteGatewayUser,
  getGatewayUserManagement,
  rotateGatewayUserPassword,
  updateGatewayUser,
} from '@/api/gateway'
import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { NsParams } from '@/types/rule'
import type {
  AuthenticationUserCreateRequest,
  AuthenticationUserUpdateRequest,
} from '@/types/typeAlias'

export interface AuthenticationUserContext {
  authenticatorId: string
  gateway?: string
  listenerId?: string
}

export default function useAuthenticationUsers(
  context: MaybeRefOrGetter<AuthenticationUserContext>,
) {
  const listAuthenticationUsers = (params = {}) => {
    const currentContext = toValue(context)
    return currentContext.gateway
      ? getGatewayUserManagement(currentContext.gateway, params, currentContext.listenerId)
      : loadAuthnUsers(currentContext.authenticatorId, params)
  }

  const addAuthenticationUser = (body: AuthenticationUserCreateRequest) => {
    const currentContext = toValue(context)
    return currentContext.gateway
      ? addGatewayUserManagement(currentContext.gateway, body, currentContext.listenerId)
      : createAuthnUsers(currentContext.authenticatorId, body)
  }

  const editAuthenticationUser = (
    userId: string,
    body: AuthenticationUserUpdateRequest,
    params?: NsParams,
  ) => {
    const currentContext = toValue(context)
    return currentContext.gateway
      ? updateGatewayUser(currentContext.gateway, userId, body, currentContext.listenerId)
      : updateAuthnUser(currentContext.authenticatorId, userId, body, params)
  }

  // Confirmation dialogs may outlive the current page context; allow callers to retain its snapshot.
  const removeAuthenticationUser = (
    userId: string,
    params?: NsParams,
    currentContext = toValue(context),
  ) => {
    return currentContext.gateway
      ? deleteGatewayUser(currentContext.gateway, userId, currentContext.listenerId)
      : deleteAuthnUser(currentContext.authenticatorId, userId, params)
  }

  const rotateAuthenticationUserPassword = (
    userId: string,
    params?: NsParams,
    currentContext = toValue(context),
  ) => {
    return currentContext.gateway
      ? rotateGatewayUserPassword(currentContext.gateway, userId, currentContext.listenerId)
      : rotateAuthnUserPassword(currentContext.authenticatorId, userId, params)
  }

  return {
    listAuthenticationUsers,
    addAuthenticationUser,
    editAuthenticationUser,
    removeAuthenticationUser,
    rotateAuthenticationUserPassword,
  }
}
