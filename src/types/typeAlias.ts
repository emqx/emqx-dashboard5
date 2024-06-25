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
} from './schemas/messageTransformation.schemas'
import type { SsoOidc } from './schemas/dashboardSingleSignOn.schemas'
import {
  SsoOidcPreferredAuthMethodsItem,
  SsoOidcProvider,
  SsoOidcBackend,
} from './schemas/dashboardSingleSignOn.schemas'

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
    payload_decoder: { type: string; schema?: string }
    payload_encoder: { type: string }
  }
>
export type MessageTransformOperation = MessageTransformationOperation
export const MessageTransformFailureAction = MessageTransformationTransformationFailureAction
export const MessageTransformLogLevel = MessageTransformationLogFailureLevel
