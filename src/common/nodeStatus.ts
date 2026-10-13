import type { NodeInfo } from '@/types/dashboard'
import { NodeStatus } from '@/types/enum'

export const NODE_STATUSES = [NodeStatus.Running, NodeStatus.Stopped, NodeStatus.Unreachable]

export type NodeCounts = Record<NodeStatus, number>

export function isNodeStatus(status?: string): status is NodeStatus {
  return NODE_STATUSES.includes(status as NodeStatus)
}

export function countNodeStatuses(nodes: NodeInfo[]): NodeCounts {
  const counts: NodeCounts = { running: 0, stopped: 0, unreachable: 0 }
  for (const { node_status } of nodes) {
    if (isNodeStatus(node_status)) counts[node_status]++
  }
  return counts
}

export function groupNodesByRole<T extends NodeInfo>(
  nodes: T[],
): Record<'core' | 'replicant' | 'unknown', T[]> {
  const groups: Record<'core' | 'replicant' | 'unknown', T[]> = {
    core: [],
    replicant: [],
    unknown: [],
  }
  for (const node of nodes) {
    const role = node.role === 'core' || node.role === 'replicant' ? node.role : 'unknown'
    groups[role].push(node)
  }
  return groups
}

export function hasNodeMemory(node: Partial<NodeInfo>): boolean {
  return node.memory_total !== undefined && ![0, '0'].includes(node.memory_total)
}
