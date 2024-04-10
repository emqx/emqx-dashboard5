import { FileTransferFileTransfer } from './schemas/fileTransfer.schemas'
import {
  GetAuditParams as GetAuditParamsType,
  AuditAudit,
  GetAuditFrom,
  GetAuditOperationResult,
} from './schemas/audit.schemas'
import { EmqxLog } from './schemas/configs.schemas'
import type {
  MessageValidationValidation,
  MessageValidationHttpApiReorder,
  MessageValidationHttpApiGetMetrics,
  MessageValidationValidationChecksItem,
} from './schemas/messageValidation.schemas'
import {
  MessageValidationValidationFailureAction,
  MessageValidationValidationStrategy,
  MessageValidationLogFailureLevel,
} from './schemas/messageValidation.schemas'

/* CONF */
export type FileTransferConf = FileTransferFileTransfer
export type LogConf = EmqxLog

/* AUDIT */
export type GetAuditParams = GetAuditParamsType
export type AuditLogItem = AuditAudit
export const AuditLogFrom = GetAuditFrom
export const AuditLogOperationResult = GetAuditOperationResult

/* MESSAGE VALIDATION */
export type MessageValidation = MessageValidationValidation
export type ReorderValidationParams = MessageValidationHttpApiReorder
export type MessageValidationMetrics = MessageValidationHttpApiGetMetrics
export type MessageValidationCheckItem = MessageValidationValidationChecksItem
export const MessageValidationFailureAction = MessageValidationValidationFailureAction
export const MessageValidationStrategy = MessageValidationValidationStrategy
export const MessageValidationLogLevel = MessageValidationLogFailureLevel
