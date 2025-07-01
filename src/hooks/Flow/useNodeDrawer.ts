import { BridgeType } from '@/types/enum'
import FilterForm from '@/views/Flow/components/form/processing/FilterForm.vue'
import FunctionForm from '@/views/Flow/components/form/processing/FunctionForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import AINodeForm from '@/views/Flow/components/form/processing/AINodeForm.vue'
import BridgeInfluxdbConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeInfluxdbConfig.vue'
import AllMsgsAndEventsForm from '@/views/Flow/components/form/source/AllMsgsAndEventsForm.vue'
import UsingSchemaBridgeConfig from '@/views/RuleEngine/Bridge/Components/UsingSchemaBridgeConfig.vue'
import ConsoleForm from '@/views/RuleEngine/components/ConsoleForm.vue'
import RePubForm from '@/views/RuleEngine/components/RePubForm.vue'
import useBridgeTypeValue from '../Rule/bridge/useBridgeTypeValue'
import useI18nTl from '../useI18nTl'
import useFlowNode, {
  ProcessingType,
  SinkType,
  SourceType,
  SourceTypeAllMsgsAndEvents,
} from './useFlowNode'
import useNodeForm from './useNodeForm'

export default (): {
  getDrawerTitle: (type: string) => string
  drawerDefaultWidth: string
  getDrawerWidth: (type: string) => string
  getFormComponent: (type: string) => Component | undefined
} => {
  const { tl } = useI18nTl('RuleEngine')

  const { isUsingSchemaBridgeType } = useNodeForm()
  const { isBridgeType, isAIType, getTypeLabel } = useFlowNode()
  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  const drawerTitleMap: Record<string, string> = {
    [SourceTypeAllMsgsAndEvents]: tl('allMsgsAndEvents'),
  }
  const getDrawerTitle = (type: string) => {
    if (isBridgeType(type)) {
      return getBridgeLabelByTypeValue(type as BridgeType) || ''
    }
    const typeLabel = getTypeLabel(type)
    return drawerTitleMap[type] ?? typeLabel
  }

  const drawerDefaultWidth = '560px'
  const drawerActionWidth = '720px'
  const drawerWidthMap: Record<string, string> = {
    [ProcessingType.Filter]: '960px',
    [ProcessingType.Function]: '680px',
  }
  const getDrawerWidth = (type: string) => {
    if (isBridgeType(type)) {
      return drawerActionWidth
    }
    return drawerWidthMap[type] || drawerDefaultWidth
  }

  const formComponentMap: Record<string, Component> = {
    [SourceType.Message]: MessageForm,
    [SourceType.Event]: EventForm,
    [SourceTypeAllMsgsAndEvents]: AllMsgsAndEventsForm,
    [ProcessingType.Filter]: FilterForm,
    [ProcessingType.Function]: FunctionForm,
    [SinkType.RePub]: RePubForm,
    [SinkType.Console]: ConsoleForm,
    [SinkType.InfluxDB]: BridgeInfluxdbConfig,
    [SinkType.Datalayers]: BridgeInfluxdbConfig,
  }
  const getFormComponent = (type: string) => {
    if (!type) {
      return undefined
    }
    const component = formComponentMap[type]
    if (!component && isUsingSchemaBridgeType(type)) {
      return UsingSchemaBridgeConfig
    }
    if (!component && isAIType(type)) {
      return AINodeForm
    }
    return component
  }

  return {
    getDrawerTitle,
    drawerDefaultWidth,
    getDrawerWidth,
    getFormComponent,
  }
}
