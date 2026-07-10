export type FeatureGatePreset = 'full' | 'essential' | 'custom' | string

export type FeatureName =
  | 'dashboard'
  | 'data_integration'
  | 'message_transformation'
  | 'schema_validation'
  | 'schema_registry'
  | 'gateways'
  | 'cluster_link'
  | 'multi_tenancy'
  | 'plugins'
  | 'ai'
  | 'metrics'
  | 'mqtt_extensions'
  | 'file_transfer'
  | 'gcp_device'
  | 'exhook'
  | 'opentelemetry'

export interface FeatureGateInfo {
  preset?: FeatureGatePreset
  enabled?: FeatureName[]
  disabled?: FeatureName[]
}

export interface FeatureGateState {
  initialized: boolean
  preset: FeatureGatePreset | null
  enabled: FeatureName[]
  disabled: FeatureName[]
  fallbackFull: boolean
}
