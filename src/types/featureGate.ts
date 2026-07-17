import type { FeatureName } from './enum'

export type FeatureGatePreset = 'full' | 'essential' | 'custom' | string

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
