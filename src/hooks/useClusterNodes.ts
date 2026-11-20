import { getClusterNodes, loadNodes } from '@/api/common'
import { isUnauthorizedRoleError } from '@/common/http'
import type { VersionInfo } from '@/types/common'
import type { NodeInfo } from '@/types/dashboard'
import type { GetCluster200 } from '@/types/schemas/cluster.schemas'
import { compareVersions } from 'compare-versions'

type NodesStatus = 'idle' | 'loaded' | 'forbidden' | 'failed'

interface UseClusterNodesOptions {
  loadByDefault?: boolean
  hideProgress?: boolean
  timeout?: number
  getVersion?: boolean
  handleUnauthorizedRole?: boolean
}

export default function useClusterNodes(
  {
    loadByDefault,
    hideProgress,
    timeout,
    getVersion,
    handleUnauthorizedRole,
  }: UseClusterNodesOptions = {
    loadByDefault: true,
    getVersion: false,
  },
): {
  clusterName: Ref<string>
  nodes: Ref<Array<NodeInfo>>
  nodesStatus: Ref<NodesStatus>
  lockTable: Ref<boolean>
  hasMemory: Ref<boolean>
  loadData: () => Promise<void>
  versionInfo: {
    latestVersion: string
    isMutiVersion: boolean
  }
} {
  const nodes: Ref<Array<NodeInfo>> = ref([])
  const nodesStatus = ref<NodesStatus>('idle')
  const lockTable: Ref<boolean> = ref(false)
  const hasMemory: Ref<boolean> = ref(true)
  const versionInfo = reactive<VersionInfo>({
    latestVersion: '',
    isMutiVersion: false,
  })
  const clusterName = ref('')

  const handleVersions = (nodes: NodeInfo[]) => {
    const versionList = nodes.map((node) => node.version.split('-')[0])
    const uniqueVersions = uniq(versionList)
    versionInfo.isMutiVersion = uniqueVersions.length > 1
    if (uniqueVersions.length === 0) {
      versionInfo.latestVersion = ''
      return
    }
    const latestVersion = uniqueVersions.reduce((latest, version) => {
      return compareVersions(version, latest) > 0 ? version : latest
    })
    versionInfo.latestVersion = `v${latestVersion}`
  }

  const loadData = async () => {
    try {
      lockTable.value = true
      nodes.value = (await loadNodes(hideProgress, timeout, handleUnauthorizedRole)) ?? []
      hasMemory.value = nodes.value.some((node) => ![0, '0'].includes(node.memory_total))
      if (getVersion) {
        handleVersions(nodes.value)
      }
      nodesStatus.value = 'loaded'
    } catch (error) {
      if (handleUnauthorizedRole && isUnauthorizedRoleError(error)) {
        nodes.value = []
        hasMemory.value = false
        if (getVersion) {
          handleVersions(nodes.value)
        }
        nodesStatus.value = 'forbidden'
      } else {
        nodesStatus.value = 'failed'
      }
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

  return { nodes, nodesStatus, lockTable, hasMemory, loadData, versionInfo, clusterName }
}
