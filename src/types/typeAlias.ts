import {
  AuditAudit,
  GetAuditFrom,
  GetAuditOperationResult,
  GetAuditParams as GetAuditParamsType,
} from './schemas/audit.schemas'
import { EmqxLog } from './schemas/configs.schemas'
import {
  DashboardIframeBackend,
  SsoLdap,
  DashboardIframe,
} from './schemas/dashboardSingleSignOn.schemas'
import { FileTransferFileTransfer } from './schemas/fileTransfer.schemas'

/* CONF */
export type FileTransferConf = FileTransferFileTransfer
export type LogConf = EmqxLog

/* AUDIT */
export type GetAuditParams = GetAuditParamsType
export type AuditLogItem = AuditAudit
export const AuditLogFrom = GetAuditFrom
export const AuditLogOperationResult = GetAuditOperationResult

export const SSOIframeBackend = DashboardIframeBackend
export type SSOLdapForm = SsoLdap
export type IframeForm = DashboardIframe
