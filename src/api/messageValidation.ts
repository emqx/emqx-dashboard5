import http from '@/common/http'
import {
  MessageValidation,
  ReorderValidationParams,
  MessageValidationMetrics,
} from '@/types/typeAlias'

export const postMessageValidation = (
  validation: MessageValidation,
): Promise<MessageValidation> => {
  return http.post(`/schema_validations`, validation)
}

export const getMessageValidations = (): Promise<Array<MessageValidation>> => {
  return http.get(`/schema_validations`)
}

export const putMessageValidation = (validation: MessageValidation): Promise<MessageValidation> => {
  return http.put(`/schema_validations`, validation)
}

export const deleteValidation = (name: string): Promise<void> => {
  return http.delete(`/schema_validations/validation/${name}`)
}

export const getMessageValidationDetail = (name: string): Promise<MessageValidation> => {
  return http.get(`/schema_validations/validation/${name}`)
}

export const enableDisableValidation = (name: string, enable: boolean): Promise<void> => {
  return http.post(`/schema_validations/validation/${name}/enable/${enable}`)
}

export const getValidationMetrics = (name: string): Promise<MessageValidationMetrics> => {
  return http.get(`/schema_validations/validation/${name}/metrics`)
}

export const resetValidationMetrics = (name: string): Promise<void> => {
  return http.post(`/schema_validations/validation/${name}/metrics/reset`)
}

export const reorderAllValidations = (validation: ReorderValidationParams): Promise<void> => {
  return http.post(`/schema_validations/reorder`, validation)
}
