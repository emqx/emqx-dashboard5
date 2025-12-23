import { listAuthzSetting, updateAuthzSetting } from '@/api/auth'
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { AuthzSetting } from '@/types/auth'
import { Mqtt, Zone } from '@/types/config'

const NS_ATTR = 'tns'

type NamespaceMqttConfig = {
  tns: string
  clientid_override: string
  namespace_as_mountpoint?: boolean
}
export const useNamespaceMqttConfig = () => {
  let totalConfig: Zone | undefined = undefined
  let preNamespaceMqttConfig: NamespaceMqttConfig = {
    tns: '',
    clientid_override: '',
    namespace_as_mountpoint: undefined,
  }
  const namespaceMqttConfig = ref<NamespaceMqttConfig>({
    tns: '',
    clientid_override: '',
    namespace_as_mountpoint: undefined,
  })
  const getNamespaceMqttConfig = async () => {
    try {
      totalConfig = await getDefaultZoneConfigs()
      const { client_attrs_init, clientid_override, namespace_as_mountpoint } = totalConfig.mqtt
      const tnsExpression =
        client_attrs_init.find((item) => item.set_as_attr === NS_ATTR)?.expression ?? ''
      namespaceMqttConfig.value = { clientid_override, tns: tnsExpression, namespace_as_mountpoint }
      preNamespaceMqttConfig = cloneDeep(namespaceMqttConfig.value)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const getClientAttrsInit = (
    preClientAttrsInit: Mqtt['client_attrs_init'],
    currentTnsExpression: string,
  ) => {
    const ret = cloneDeep(preClientAttrsInit)
    const preIndex = ret.findIndex((item) => item.set_as_attr === NS_ATTR)
    if (preIndex !== -1) {
      if (!currentTnsExpression) {
        ret.splice(preIndex, 1)
      } else {
        ret[preIndex].expression = currentTnsExpression
      }
    } else if (currentTnsExpression) {
      ret.push({ set_as_attr: NS_ATTR, expression: currentTnsExpression })
    }
    return ret
  }
  const updateNamespaceMqttConfig = async () => {
    try {
      if (!totalConfig) {
        await getNamespaceMqttConfig()
      }
      if (!totalConfig) {
        throw new Error('Total config not found')
      }
      if (isEqual(preNamespaceMqttConfig, namespaceMqttConfig.value)) {
        return Promise.resolve()
      }
      const { tns, ...others } = namespaceMqttConfig.value
      const data = {
        ...totalConfig,
        mqtt: {
          ...totalConfig.mqtt,
          client_attrs_init: getClientAttrsInit(totalConfig.mqtt.client_attrs_init ?? [], tns),
          ...others,
        },
      }
      await updateDefaultZoneConfigs(data)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    namespaceMqttConfig,
    getNamespaceMqttConfig,
    updateNamespaceMqttConfig,
  }
}

type NamespaceAuthzConfig = Pick<AuthzSetting, 'include_mountpoint'>
export const useNamespaceAuthzConfig = () => {
  let totalConfig: AuthzSetting | undefined = undefined
  let preNamespaceAuthzConfig: NamespaceAuthzConfig = { include_mountpoint: false }
  const namespaceAuthzConfig = ref<NamespaceAuthzConfig>({ include_mountpoint: false })
  const getNamespaceAuthzConfig = async () => {
    try {
      totalConfig = await listAuthzSetting()
      namespaceAuthzConfig.value = { include_mountpoint: totalConfig.include_mountpoint }
      preNamespaceAuthzConfig = cloneDeep(namespaceAuthzConfig.value)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const updateNamespaceAuthzConfig = async () => {
    if (!totalConfig) {
      await getNamespaceAuthzConfig()
    }
    if (!totalConfig) {
      throw new Error('Total config not found')
    }
    try {
      if (isEqual(preNamespaceAuthzConfig, namespaceAuthzConfig.value)) {
        return Promise.resolve()
      }
      const data = {
        ...totalConfig,
        include_mountpoint: namespaceAuthzConfig.value.include_mountpoint,
      }
      await updateAuthzSetting(data)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    namespaceAuthzConfig,
    getNamespaceAuthzConfig,
    updateNamespaceAuthzConfig,
  }
}
