import { NodeStatus } from '@/types/enum'

const statsItem = {
  'channels.count': 2,
  'channels.max': 2,
  'connections.count': 2,
  'connections.max': 2,
  'delayed.count': 4,
  'delayed.max': 4,
  'live_connections.count': 1,
  'live_connections.max': 2,
  node: 'emqx@127.0.0.1',
  'retained.count': 3,
  'retained.max': 3,
  'routes.count': 1,
  'routes.max': 3,
  'sessions.count': 2,
  'sessions.max': 2,
  'suboptions.count': 1,
  'suboptions.max': 3,
  'subscribers.count': 1,
  'subscribers.max': 3,
  'subscriptions.count': 1,
  'subscriptions.max': 3,
  'subscriptions.shared.count': 0,
  'subscriptions.shared.max': 0,
  'topics.count': 1,
  'topics.max': 3,
}

const nodeItem = {
  connections: 2,
  load1: '0.00',
  load15: '0.00',
  load5: '0.00',
  log_path: 'not found',
  max_fds: 1024,
  memory_total: '330.37M',
  memory_used: '253.98M',
  node: 'emqx@127.0.0.1',
  node_status: 'Running',
  otp_release: '23.3.1/11.2',
  process_available: 2097152,
  process_used: 477,
  role: 'core',
  sys_path: '/home/ubuntu/DDDHuang/emqx/_build/emqx/rel/emqx',
  uptime: 1028000536,
  version: '5.0.0-beta.4-9a4a8ec0',
}

const length = 6

const nodes = []
const stats = []
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
