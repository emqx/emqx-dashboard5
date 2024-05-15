import http from '@/common/http'
import {
  SchemaValidation,
  ReorderValidationParams,
  SchemaValidationMetrics,
} from '@/types/typeAlias'

export const postSchemaValidation = (validation: SchemaValidation): Promise<SchemaValidation> => {
  return http.post(`/schema_validations`, validation)
}

export const getSchemaValidations = (): Promise<Array<SchemaValidation>> => {
  return http.get(`/schema_validations`)
}

export const putSchemaValidation = (validation: SchemaValidation): Promise<SchemaValidation> => {
  return http.put(`/schema_validations`, validation)
}

export const deleteValidation = (name: string): Promise<void> => {
  return http.delete(`/schema_validations/validation/${name}`)
}

export const getSchemaValidationDetail = (name: string): Promise<SchemaValidation> => {
  return http.get(`/schema_validations/validation/${name}`)
}

export const enableDisableValidation = (name: string, enable: boolean): Promise<void> => {
  return http.post(`/schema_validations/validation/${name}/enable/${enable}`)
}

export const getValidationMetrics = (name: string): Promise<SchemaValidationMetrics> => {
  return http.get(`/schema_validations/validation/${name}/metrics`)
}

export const resetValidationMetrics = (name: string): Promise<void> => {
  return http.post(`/schema_validations/validation/${name}/metrics/reset`)
}

export const reorderAllValidations = (validation: ReorderValidationParams): Promise<void> => {
  return http.post(`/schema_validations/reorder`, validation)
}
