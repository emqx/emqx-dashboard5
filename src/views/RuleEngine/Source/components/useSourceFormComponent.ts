import UsingSchemaBridgeConfig from '../../Bridge/Components/UsingSchemaBridgeConfig.vue'

export default (
  type: ComputedRef<string> | Ref<string>,
): {
  formCom: ComputedRef<Component | null>
  formComProps: ComputedRef<Record<string, any>>
} => {
  const sourceComMap: Map<string, Component> = new Map([])
  const formCom = computed<Component | null>((): Component | null => {
    if (!type.value) {
      return null
    }
    return sourceComMap.get(type.value) || UsingSchemaBridgeConfig
  })

  const formComPropsMap: Map<string, Record<string, any>> = new Map([])
  const formComProps = computed(() => {
    const props = formComPropsMap.get(type.value)
    return props || { isSource: true }
  })
  return { formCom, formComProps }
}
