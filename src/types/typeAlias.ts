import { GetAuthentication200Item, AuthnBuiltinDb } from './schemas/authentication.schemas'
import {
  EmqxAuthzApiMnesiaRuleItemAction,
  EmqxAuthzApiMnesiaRuleItemPermission,
} from './schemas/authorization.schemas'
import { PostGatewaysNameListenersBody } from './schemas/gatewayListeners.schemas'
import {
  EmqxGatewayApiUpdateCoap,
  EmqxGatewayApiUpdateExproto,
  EmqxGatewayApiUpdateStomp,
  EmqxGatewayApiUpdateLwm2m,
  EmqxGatewayApiUpdateMqttsn,
} from './schemas/gateways.schemas'

/* GATEWAY */
export type StompGatewayConfig = EmqxGatewayApiUpdateStomp
export type CoapGatewayConfig = EmqxGatewayApiUpdateCoap
export type ExprotoGatewayConfig = EmqxGatewayApiUpdateExproto
export type Lwm2mGatewayConfig = EmqxGatewayApiUpdateLwm2m
export type MqttsnGatewayConfig = EmqxGatewayApiUpdateMqttsn

export type GatewayListener = PostGatewaysNameListenersBody

/* AUTHENTICATION */
export type AuthenticationBuiltInDbConfig = AuthnBuiltinDb
export type AuthenticationConfig = GetAuthentication200Item & { id: string }

/* AUTHORIZATION */
export const AuthzRulePermission = EmqxAuthzApiMnesiaRuleItemPermission
export const AuthzRuleAction = EmqxAuthzApiMnesiaRuleItemAction
