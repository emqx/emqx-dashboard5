/* eslint-disable @typescript-eslint/no-var-requires */
import { camelCase } from 'lodash'
import { loadEnv } from 'vite'
import filterTargetSchema from './scripts/transformer/filterTagsSchema.js'

const envVariables = loadEnv('development', process.cwd(), '')
const baseURL = envVariables.HOST_URL || 'http://localhost:18083'
const swaggerURL = `${baseURL}/api-docs/swagger.json`

const tagArr = [
  'Authentication',
  'Metrics',
  'MQTT',
  'LwM2M Gateways',
  'Plugins',
  'Bridges',
  'Status',
  'Topics',
  'Authorization',
  'Nodes',
  'ExHook',
  'Monitor',
  'Auto Subscribe',
  'Gateway Listeners',
  'Configs',
  'Clients',
  'Cluster',
  'Gateway Clients',
  'Publish',
  'Rules',
  'Gateways',
  'Trace',
  'Dashboard',
  'Listeners',
  'Gateway Authentication',
  'CoAP Gateways',
  'Retainer',
  'Subscriptions',
  'API Keys',
  'Banned',
  'Connectors',
  'Actions',
  'Sources',
]

const typesFolder = './src/types/schemas/'
const configs = tagArr.reduce((obj: Record<string, any>, tag: string) => {
  const key = camelCase(tag)
  const filePath = `${typesFolder}${key}.ts`
  obj[key] = {
    input: {
      target: swaggerURL,
      override: {
        transformer: (json) => filterTargetSchema(json, tag),
      },
      filters: { tags: [tag] },
    },
    output: {
      mode: 'split',
      target: filePath,
      override: { header: false },
    },
    hooks: {
      afterAllFilesWrite: ['prettier --write', `pnpm remove-orval-client ${filePath}`],
    },
  }
  return obj
}, {})

export default configs
