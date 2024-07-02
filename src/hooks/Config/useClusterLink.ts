import { putClusterLinks, getClusterLinks } from '@/api/cluster'
import { ClusterLink } from '@/types/typeAlias'
import { ref } from 'vue'

export default () => {
  const links = ref<Array<ClusterLink>>([])

  const updateLinks = async (list: Array<ClusterLink>) => {
    try {
      links.value = await putClusterLinks(list)
      return Promise.resolve(links.value)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addLink = (data: ClusterLink) => {
    const list = [...links.value, data]
    return updateLinks(list)
  }

  const deleteLink = (index: number) => {
    const list = [...links.value]
    list.splice(index, 1)
    return updateLinks(list)
  }

  const updateLinkItem = (index: number, data: ClusterLink) => {
    const list = [...links.value]
    list[index] = data
    return updateLinks(list)
  }

  const getLinks = async () => {
    try {
      links.value = await getClusterLinks()
      return Promise.resolve(links.value)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getLinks()

  return {
    links,
    updateLinks,
    addLink,
    deleteLink,
    updateLinkItem,
    getLinks,
  }
}
