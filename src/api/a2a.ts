import http from '@/common/http'
import { A2ACardListParams, A2ACardOut, A2ARegisterCardIn } from '@/types/typeAlias'

export function listA2ACards(params?: A2ACardListParams): Promise<Array<A2ACardOut>> {
  return http.get('/a2a/cards/list', { params })
}

export function getA2ACard(orgId: string, unitId: string, agentId: string): Promise<A2ACardOut> {
  return http.get(
    `/a2a/cards/card/${encodeURIComponent(orgId)}/${encodeURIComponent(unitId)}/${encodeURIComponent(agentId)}`,
  )
}

export function registerA2ACard(
  orgId: string,
  unitId: string,
  agentId: string,
  body: A2ARegisterCardIn,
): Promise<void> {
  return http.post(
    `/a2a/cards/card/${encodeURIComponent(orgId)}/${encodeURIComponent(unitId)}/${encodeURIComponent(agentId)}`,
    body,
  )
}

export function deleteA2ACard(orgId: string, unitId: string, agentId: string): Promise<void> {
  return http.delete(
    `/a2a/cards/card/${encodeURIComponent(orgId)}/${encodeURIComponent(unitId)}/${encodeURIComponent(agentId)}`,
  )
}
