import { getBridgeList } from '@/api/ruleengine'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import {
  typesWithProducerAndConsumer,
  useBridgeTypeOptions,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { Properties } from '@/types/schemaForm'
import { cloneDeep, groupBy } from 'lodash'
import { Ref, computed, ref } from 'vue'

type GroupedBridgeMap = { [key in BridgeType]?: Array<BridgeItem> }

export default (props: any, record: any) => {
  let getBridgeRequest: undefined | Promise<Array<BridgeItem>> = undefined
  const groupedBridgeMap: Ref<GroupedBridgeMap> = ref({})

  const isCreateBridgeInFlow = computed(() => props.isUsingInFlow && !props.edit && !props.readonly)

  const { getBridgeType } = useBridgeTypeOptions()

  const getBridges = async () => {
    try {
      getBridgeRequest = getBridgeList()
      const bridges = await getBridgeRequest
      groupedBridgeMap.value = groupBy(bridges, ({ type }) => getBridgeType(type))
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * @param type For mqtt, the direction needs to be specified
   * For consumer and producer separate types, the direction needs to be specified
   * For types where versions are separate (e.g., redis and mongo), a generic type
   */
  const getBridgesByType = (type: BridgeType, direction?: BridgeDirection) => {
    if (!type) {
      return []
    }
    const generalType = getBridgeType(type)
    if (type === BridgeType.MQTT) {
      // TODO:
    } else if (typesWithProducerAndConsumer.includes(type as BridgeType)) {
      // TODO:
    } else {
      return groupedBridgeMap.value[type] || []
    }
  }

  const getBridgeByName = (name: string) => {
    const bridges = getBridgesByType(props.type)
    return bridges?.find((item) => item.name === name)
  }

  const isBridgeSelected = ref(false)

  const { handleBridgeDataAfterLoaded } = useBridgeDataHandler()
  const handleSchemaForReuse = async ({
    components,
    rules,
  }: {
    components: Properties
    rules: SchemaRules
  }) => {
    if (getBridgeRequest) {
      await getBridgeRequest
    }
    const { name } = components
    if (name) {
      name.default = ''
      name.symbols = getBridgesByType(props.type)?.map(({ name }) => name)
      name.type = 'enum'
      name.componentProps = {
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        onChange: (val: string) => {
          const bridge = !!val && getBridgeByName(val)
          if (bridge) {
            isBridgeSelected.value = true
            record.value = handleBridgeDataAfterLoaded(cloneDeep(bridge))
          } else {
            isBridgeSelected.value = false
          }
        },
      }
    }
    return { components, rules }
  }

  if (isCreateBridgeInFlow.value) {
    getBridges()
  }

  return {
    isCreateBridgeInFlow,
    isBridgeSelected,
    getBridgesByType,
    handleSchemaForReuse,
  }
}
