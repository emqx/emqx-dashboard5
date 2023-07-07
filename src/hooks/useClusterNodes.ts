import { ref, Ref } from 'vue'
import { loadNodes } from '@/api/common'
import { NodeInfo } from '@/types/dashboard'

export default function useClusterNodes(
  loadByDefault = true,
  hideProgress?: boolean,
  timeout?: number,
): {
  nodes: Ref<Array<NodeInfo>>
  lockTable: Ref<boolean>
  hasMemory: Ref<boolean>
  loadData: () => Promise<void>
} {
  const nodes: Ref<Array<NodeInfo>> = ref([])
  const lockTable: Ref<boolean> = ref(false)
  const hasMemory: Ref<boolean> = ref(true)

  const loadData = async () => {
    try {
      lockTable.value = true
      nodes.value = (await loadNodes(hideProgress, timeout)) ?? []
      hasMemory.value = nodes.value.some((node) => ![0, '0'].includes(node.memory_total))
    } catch (err) {
      // ignore err
    } finally {
      lockTable.value = false
    }
  }

  if (loadByDefault) {
    loadData()
  }
  return { nodes, lockTable, hasMemory, loadData }
}
