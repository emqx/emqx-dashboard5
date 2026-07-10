import http from '@/common/http'
import type { FeatureGateInfo } from '@/types/featureGate'

const FEATURE_REQUEST_TIMEOUT = 10000

export const getFeatures = (): Promise<FeatureGateInfo> =>
  http.get('/features', { timeout: FEATURE_REQUEST_TIMEOUT })
