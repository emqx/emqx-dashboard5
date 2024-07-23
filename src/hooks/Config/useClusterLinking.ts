import { putClusterLinking } from '@/api/cluster'
import { ClusterLinkingFormForUpdate, CreatedClusterLinking } from '@/types/typeAlias'
import { omit } from 'lodash'

export default (): {
  getDataForUpdate: (link: CreatedClusterLinking) => ClusterLinkingFormForUpdate
  toggleClusterLinkingEnable: (link: CreatedClusterLinking) => Promise<CreatedClusterLinking>
} => {
  const getDataForUpdate = (link: CreatedClusterLinking) =>
    omit(link, ['node', 'status', 'name', 'node_status']) as ClusterLinkingFormForUpdate

  const toggleClusterLinkingEnable = (link: CreatedClusterLinking) => {
    return putClusterLinking(link.name, getDataForUpdate(link))
  }

  return {
    getDataForUpdate,
    toggleClusterLinkingEnable,
  }
}
