import { compareVersions } from 'compare-versions'
import { loadNodes } from '@/api/common'
import { NodeInfo } from '@/types/dashboard'
import { getClusterNodes } from '@/api/common'
import type { GetCluster200 } from '@/types/schemas/cluster.schemas'

interface UseClusterNodesOptions {
  loadByDefault?: boolean
  hideProgress?: boolean
  timeout?: number
  getVersion?: boolean
}

export default function useClusterNodes(
  { loadByDefault, hideProgress, timeout, getVersion }: UseClusterNodesOptions = {
    loadByDefault: true,
    getVersion: false,
  },
): {
  clusterName: Ref<string>
  nodes: Ref<Array<NodeInfo>>
  lockTable: Ref<boolean>
  hasMemory: Ref<boolean>
  loadData: () => Promise<void>
  versionInfo: {
    latestVersion: string
    isMutiVersion: boolean
  }
} {
  const nodes: Ref<Array<NodeInfo>> = ref([])
  const lockTable: Ref<boolean> = ref(false)
  const hasMemory: Ref<boolean> = ref(true)
  const versionInfo = reactive({
    latestVersion: '',
    isMutiVersion: false,
  })
  const clusterName = ref('')

  const handleVersions = (nodes: NodeInfo[]) => {
    const versionList = nodes.map((node) => node.version.split('-')[0])
    const uniqueVersions = _.uniq(versionList)
    versionInfo.isMutiVersion = uniqueVersions.length > 1
    if (versionInfo.isMutiVersion) {
      versionInfo.latestVersion = uniqueVersions.reduce((latest, version) => {
        return compareVersions(version, latest) > 0 ? version : latest
      })
    } else {
      versionInfo.latestVersion = uniqueVersions[0]
    }
    versionInfo.latestVersion = `v${versionInfo.latestVersion}`
  }

  const loadData = async () => {
    try {
      lockTable.value = true
      nodes.value = (await loadNodes(hideProgress, timeout)) ?? []
      hasMemory.value = nodes.value.some((node) => ![0, '0'].includes(node.memory_total))
      if (getVersion) {
        handleVersions(nodes.value)
      }
    } catch (err) {
      // ignore err
    } finally {
      lockTable.value = false
    }
  }

  if (loadByDefault) {
    loadData()
  }

  const getClusterName = async () => {
    const res: GetCluster200 = await getClusterNodes()
    clusterName.value = res.name ?? ''
  }

  getClusterName()

  return { nodes, lockTable, hasMemory, loadData, versionInfo, clusterName }
}
