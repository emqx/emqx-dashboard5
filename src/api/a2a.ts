import http from '@/common/http'
import type {
  A2ACardListParams,
  A2ACardOut,
  A2ADeleteCardParams,
  A2AGetCardParams,
  A2ARegisterCardIn,
  A2ARegisterCardParams,
} from '@/types/typeAlias'

export function listA2ACards(params?: A2ACardListParams): Promise<Array<A2ACardOut>> {
  return http.get('/a2a/cards/list', { params })
}

export function getA2ACard(
  orgId: string,
  unitId: string,
  agentId: string,
  params?: A2AGetCardParams,
): Promise<A2ACardOut> {
  return http.get(
    `/a2a/cards/card/${encodeURIComponent(orgId)}/${encodeURIComponent(unitId)}/${encodeURIComponent(agentId)}`,
    { params },
  )
}

export function registerA2ACard(
  orgId: string,
  unitId: string,
  agentId: string,
  body: A2ARegisterCardIn,
  params?: A2ARegisterCardParams,
): Promise<void> {
  return http.post(
    `/a2a/cards/card/${encodeURIComponent(orgId)}/${encodeURIComponent(unitId)}/${encodeURIComponent(agentId)}`,
    body,
    { params },
  )
}

export function deleteA2ACard(
  orgId: string,
  unitId: string,
  agentId: string,
  params?: A2ADeleteCardParams,
): Promise<void> {
  return http.delete(
    `/a2a/cards/card/${encodeURIComponent(orgId)}/${encodeURIComponent(unitId)}/${encodeURIComponent(agentId)}`,
    { params },
  )
}

export interface A2ARegistryConfig {
  enable?: boolean
  validate_schema?: boolean
}

export function getA2ARegistryConfig(): Promise<A2ARegistryConfig> {
  return http.get('/configs/a2a_registry')
}

export function updateA2ARegistryConfig(data: A2ARegistryConfig): Promise<A2ARegistryConfig> {
  return http.put('/configs/a2a_registry', data)
}
