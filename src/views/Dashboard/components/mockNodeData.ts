import { NodeStatus } from '@/types/enum'

const nodeItem = {
  connections: 0,
  load1: '6.42',
  load15: '3.70',
  load5: '3.91',
  log_path: 'not found',
  max_fds: 256,
  memory_total: '124.81M',
  memory_used: '83.57M',
  node: 'emqx@127.0.0.1',
  node_status: 'Running',
  otp_release: '24.2.1-1/12.2.1',
  process_available: 2097152,
  process_used: 695,
  role: 'core',
  sys_path: '/Users/reedkinple/EMQX/backend/emqx/_build/emqx/rel/emqx',
  uptime: 2732915,
  version: '5.0.0-rc.1-9ed44e3b',
}

const statsItem = {
  'channels.count': 0,
  'channels.max': 0,
  'connections.count': 0,
  'connections.max': 0,
  'delayed.count': 0,
  'delayed.max': 0,
  'live_connections.count': 0,
  'live_connections.max': 0,
  node: 'emqx@127.0.0.1',
  'retained.count': 3,
  'retained.max': 3,
  'routes.count': 0,
  'routes.max': 0,
  'sessions.count': 0,
  'sessions.max': 0,
  'suboptions.count': 0,
  'suboptions.max': 0,
  'subscribers.count': 0,
  'subscribers.max': 0,
  'subscriptions.count': 0,
  'subscriptions.max': 0,
  'subscriptions.shared.count': 0,
  'subscriptions.shared.max': 0,
  'topics.count': 0,
  'topics.max': 0,
}

const nodes = []
const stats = []
const length = 5
for (let i = 0; i < length; i += 1) {
  const node = `emqx${i}${i}${i}@127.0.0.1`
  nodes.push({
    ...nodeItem,
    node,
    node_status: Math.random() > 0.5 ? NodeStatus.Running : NodeStatus.Stopped,
  })
  stats.push({ ...statsItem, node })
}

export const nodesData = nodes
export const statsData = stats
