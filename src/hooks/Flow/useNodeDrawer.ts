import { BridgeType } from '@/types/enum'
import MQTTBrokerForm from '@/views/Flow/components/form/MQTTBrokerForm.vue'
import FilterForm from '@/views/Flow/components/form/processing/FilterForm.vue'
import FunctionForm from '@/views/Flow/components/form/processing/FunctionForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import BridgeHttpConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeHttpConfig.vue'
import ConsoleForm from '@/views/RuleEngine/components/ConsoleForm.vue'
import RePubForm from '@/views/RuleEngine/components/RePubForm.vue'
import { Component } from 'vue'
import useBridgeTypeValue from '../Rule/bridge/useBridgeTypeValue'
import useI18nTl from '../useI18nTl'
import useFlowNode, { ProcessingType, SinkType, SourceType } from './useFlowNode'

export default (): {
  getDrawerTitle: (type: string) => string
  drawerDefaultWidth: string
  getDrawerWidth: (type: string) => string
  getFormComponent: (type: string) => Component
} => {
  const { t, tl } = useI18nTl('RuleEngine')

  const { isBridgeType, removeDirectionFromSpecificType } = useFlowNode()
  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  const drawerTitleMap: Record<string, string> = {
    [SourceType.Message]: tl('message'),
    [SourceType.Event]: tl('event'),
    [ProcessingType.Function]: tl('function'),
    [ProcessingType.Filter]: t('Flow.filter'),
    [SinkType.RePub]: tl('republish'),
    [SinkType.Console]: tl('consoleOutput'),
  }
  const getDrawerTitle = (type: string) => {
    if (isBridgeType(type)) {
      return getBridgeLabelByTypeValue(removeDirectionFromSpecificType(type) as BridgeType) || ''
    }
    return drawerTitleMap[type]
  }

  const drawerDefaultWidth = '560px'
  const drawerWidthMap: Record<string, string> = {
    [ProcessingType.Filter]: '960px',
  }
  const getDrawerWidth = (type: string) => drawerWidthMap[type] || drawerDefaultWidth

  const formComponentMap: Record<string, Component> = {
    [SourceType.Message]: MessageForm,
    [SourceType.Event]: EventForm,
    [SourceType.MQTTBroker]: MQTTBrokerForm,
    [ProcessingType.Filter]: FilterForm,
    [ProcessingType.Function]: FunctionForm,
    [SinkType.RePub]: RePubForm,
    [SinkType.Console]: ConsoleForm,
    [SinkType.MQTTBroker]: MQTTBrokerForm,
    [SinkType.HTTP]: BridgeHttpConfig,
  }
  const getFormComponent = (type: string) => formComponentMap[type]

  return {
    getDrawerTitle,
    drawerDefaultWidth,
    getDrawerWidth,
    getFormComponent,
  }
}
