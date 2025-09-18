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
  EmqxGatewayApiGatewayOverview,
} from './schemas/gateways.schemas'
import type { Merge, ValueOf } from 'type-fest'
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
  GetCluster200,
  PutClusterLinksLinkNameBody,
} from './schemas/cluster.schemas'
import {
  SchemaRegistryConfluentSchemaRegistryType,
  SchemaRegistryProtobufBundleSourceType,
} from './schemas/schemaRegistry.schemas'
import type {
  GetSchemaRegistryName200,
  PostSchemaRegistryProtobufBundleBody,
  SchemaRegistryExternalRegistryApiCreateConfluentSchemaRegistry,
  SchemaRegistryGetExternalHttp,
  SchemaRegistryGetProtobuf,
  SchemaRegistryPostExternalHttp,
} from './schemas/schemaRegistry.schemas'
import type { OpentelemetryE2eTracingOptions } from './schemas/monitor.schemas'
import { type DashboardUser, DashboardUserMfa } from './schemas/dashboard.schemas'
import {
  GetMtManagedNsListParams,
  MtConfigOut,
  MtNsWithDetailsOut,
} from './schemas/multiTenancy.schemas'
import { RuleEngineActionDetails } from './schemas/rules.schemas'
import type { PluginsHealthStatus } from './schemas/plugins.schemas'
import { PluginsHealthStatusStatus } from './schemas/plugins.schemas'
import type {
  AiAnthropicProviderApiPut,
  AiOpenaiProviderApiPut,
  AiOpenaiProvider,
  AiAnthropicProvider,
  PostAiCompletionProfilesBody,
  AiOpenaiProviderType,
  AiAnthropicCompletionProfile,
  AiOpenaiCompletionProfile,
} from './schemas/aiCompletion.schemas'
import {
  AiAnthropicProviderApiPutAnthropicVersion,
  AiAnthropicProviderType,
} from './schemas/aiCompletion.schemas'
import { PostLogin200 } from './schemas/dashboard.schemas'
import type {
  MqApiConfigPut,
  MqMessageQueueRegularApiPost,
  MqMessageQueueLastvalueApiPost,
  MqMessageQueueRegularApiPostDispatchStrategy,
} from './schemas/messageQueue.schemas'
import { MqMessageQueueRegularApiPostDispatchStrategy as MqMessageQueueDispatchStrategyValue } from './schemas/messageQueue.schemas'
import type { GetTraceNameLog200, GetTraceNameLogParams } from './schemas/trace.schemas'

/* BASE */
export interface LoginResponse extends PostLogin200 {
  namespace?: string | null
}

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

/* INTERNAL SCHEMA REGISTRY */
export type SchemaRegistryProtobufBundle = PostSchemaRegistryProtobufBundleBody
export const ProtobufBundleSourceType = SchemaRegistryProtobufBundleSourceType
export type SchemaRegistryDetail = GetSchemaRegistryName200
export type SchemaRegistryProtobufDetail = SchemaRegistryGetProtobuf

/* MONITOR */
export type OpenTelemetryE2EConfigs = OpentelemetryE2eTracingOptions

/* DASHBOARD */
export type User = DashboardUser
export const UserMFA = DashboardUserMfa

/*  CLUSTER */
export type ClusterInfo = GetCluster200

/* SCHEMA REGISTRY */
export type SchemaRegistryExternalHttp = SchemaRegistryPostExternalHttp
export type SchemaRegistryExternalHttpDetail = SchemaRegistryGetExternalHttp

/* MULTI-TENANCY */
export type NamespaceConfig = MtConfigOut

/* RULE */
export type RuleActionStatus = RuleEngineActionDetails

/* PLUGINS */
export type PluginHealthStatusObj = PluginsHealthStatus
export const PluginsHealthStatusVal = PluginsHealthStatusStatus
export type PluginHealthStatusValueType = ValueOf<typeof PluginsHealthStatusVal>

/* AI COMPLETION */
export type AIProviderForm = AiOpenaiProvider | AiAnthropicProvider
export type PutAIProviderForm = AiAnthropicProviderApiPut | AiOpenaiProviderApiPut
export const AIProviderType = AiAnthropicProviderType
export type AIProviderTypeValueType = AiOpenaiProviderType
export type AnthropicCompletion = AiAnthropicCompletionProfile
export type OpenAICompletion = AiOpenaiCompletionProfile
export type AICompletionProfile = PostAiCompletionProfilesBody
export const AnthropicVersion = AiAnthropicProviderApiPutAnthropicVersion

/* MULTI-TENANCY */
export type GetNamespaceListParams = GetMtManagedNsListParams
export type NamespaceDetailItem = Merge<
  MtNsWithDetailsOut,
  {
    created_at: number
  }
>

/* GATEWAY */
export type GatewayItem = EmqxGatewayApiGatewayOverview

/* MESSAGE QUEUE */
export type MessageQueueRegular = MqMessageQueueRegularApiPost
export type MessageQueueLastValue = MqMessageQueueLastvalueApiPost
export type MessageQueue = MessageQueueRegular | MessageQueueLastValue
export type MessageQueueDispatchStrategy = MqMessageQueueRegularApiPostDispatchStrategy
export const MessageQueueDispatchStrategyValue = MqMessageQueueDispatchStrategyValue
export type MessageQueueConfig = MqApiConfigPut & {
  find_queue_retry_interval: string
}

/* LOG TRACE */
export type GetTraceContentParams = GetTraceNameLogParams
export type GetTraceContentResponse = GetTraceNameLog200
