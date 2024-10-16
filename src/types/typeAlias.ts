import { GetAuthentication200Item, AuthnBuiltinDb } from './schemas/authentication.schemas'
import { PostGatewaysNameListenersBody } from './schemas/gatewayListeners.schemas'
import {
  EmqxGatewayApiUpdateCoap,
  EmqxGatewayApiUpdateExproto,
  EmqxGatewayApiUpdateStomp,
  EmqxGatewayApiUpdateLwm2m,
  EmqxGatewayApiUpdateMqttsn,
} from './schemas/gateways.schemas'
import type { Merge } from 'type-fest'
import { FileTransferFileTransfer } from './schemas/fileTransfer.schemas'
import {
  GetAuditParams as GetAuditParamsType,
  AuditAudit,
  GetAuditFrom,
  GetAuditOperationResult,
} from './schemas/audit.schemas'
import { EmqxLog } from './schemas/configs.schemas'
import type {
  SchemaValidationValidation,
  SchemaValidationHttpApiReorder,
  SchemaValidationHttpApiGetMetrics,
  SchemaValidationValidationChecksItem,
} from './schemas/schemaValidation.schemas'
import {
  SchemaValidationValidationFailureAction,
  SchemaValidationValidationStrategy,
  SchemaValidationLogFailureLevel,
} from './schemas/schemaValidation.schemas'
import type {
  MessageTransformationTransformation,
  MessageTransformationOperation,
} from './schemas/messageTransformation.schemas'
import {
  MessageTransformationTransformationFailureAction,
  MessageTransformationLogFailureLevel,
  MessageTransformationHttpApiDryrunTransformation,
} from './schemas/messageTransformation.schemas'
import type { SsoOidc } from './schemas/dashboardSingleSignOn.schemas'
import {
  SsoOidcPreferredAuthMethodsItem,
  SsoOidcProvider,
  SsoOidcBackend,
} from './schemas/dashboardSingleSignOn.schemas'
import type {
  PostRelupPackageUploadBody,
  RelupRunningStatus,
  RelupPackage,
  RelupRunningStatusStatus as TypeRelupRunningStatusStatus,
} from './schemas/relup.schemas'
import { RelupRunningStatusStatus } from './schemas/relup.schemas'
import type {
  ClusterLink,
  ClusterLinkLinkConfigResponse,
  ClusterLinkLinkMetricsResponse,
  PutClusterLinksLinkNameBody,
} from './schemas/cluster.schemas'
import { SchemaRegistryConfluentSchemaRegistryType } from './schemas/schemaRegistry.schemas'
import type { SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistry } from './schemas/schemaRegistry.schemas'

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

export type OverrideProperties<
  T,
  U extends Partial<Record<keyof T, unknown>> & {
    [Key in keyof U]: Key extends keyof T ? U[Key] : never
  },
> = Merge<T, U>

/* SSO */
export type OIDBForm = SsoOidc
export const OIDCPreferredAuthMethods = SsoOidcPreferredAuthMethodsItem
export const OIDCProvider = SsoOidcProvider
export const SSOOIDCBackend = SsoOidcBackend

/* CONF */
export type FileTransferConf = FileTransferFileTransfer
export type LogConf = EmqxLog

/* AUDIT */
export type GetAuditParams = GetAuditParamsType
export type AuditLogItem = AuditAudit
export const AuditLogFrom = GetAuditFrom
export const AuditLogOperationResult = GetAuditOperationResult

/* MESSAGE VALIDATION */
export type SchemaValidation = SchemaValidationValidation
export type ReorderValidationParams = SchemaValidationHttpApiReorder
export type SchemaValidationMetrics = SchemaValidationHttpApiGetMetrics
export type SchemaValidationCheckItem = SchemaValidationValidationChecksItem
export const SchemaValidationFailureAction = SchemaValidationValidationFailureAction
export const SchemaValidationStrategy = SchemaValidationValidationStrategy
export const SchemaValidationLogLevel = SchemaValidationLogFailureLevel

/* MESSAGE TRANSFORM */
export type MessageTransform = OverrideProperties<
  MessageTransformationTransformation,
  {
    payload_decoder: { type: string; schema?: string; message_type?: string }
    payload_encoder: { type: string; schema?: string; message_type?: string }
  }
>
export type MessageTransformOperation = MessageTransformationOperation
export type TestMessageTransformData = MessageTransformationHttpApiDryrunTransformation
export const MessageTransformFailureAction = MessageTransformationTransformationFailureAction
export const MessageTransformLogLevel = MessageTransformationLogFailureLevel

/* HOT UPGRADE */
export type HotUpgradePackageUploadBody = PostRelupPackageUploadBody
export type NodeUpgradeData = RelupRunningStatus
export type HotUpgradePackage = RelupPackage
export type TypeNodeUpgradeStatus = TypeRelupRunningStatusStatus
export const NodeUpgradeStatus = RelupRunningStatusStatus

/* CLUSTER LINK */
export type ClusterLinkingForm = ClusterLink
export type CreatedClusterLinking = ClusterLinkLinkConfigResponse
export type ClusterLinkingMetrics = ClusterLinkLinkMetricsResponse
export type ClusterLinkingFormForUpdate = PutClusterLinksLinkNameBody

/* EXTERNAL SCHEMA REGISTRY */

export const ExternalSchemaType = {
  Confluent: SchemaRegistryConfluentSchemaRegistryType.confluent,
}
export type ExternalSchema = SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistry
export type ExternalSchemaMap = Record<string, Omit<ExternalSchema, 'name'>>
