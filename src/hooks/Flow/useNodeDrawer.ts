import { BridgeType } from '@/types/enum'
import FilterForm from '@/views/Flow/components/form/processing/FilterForm.vue'
import FunctionForm from '@/views/Flow/components/form/processing/FunctionForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import UsingSchemaBridgeConfig from '@/views/RuleEngine/Bridge/Components/UsingSchemaBridgeConfig.vue'
import ConsoleForm from '@/views/RuleEngine/components/ConsoleForm.vue'
import RePubForm from '@/views/RuleEngine/components/RePubForm.vue'
import { Component } from 'vue'
import useBridgeTypeValue from '../Rule/bridge/useBridgeTypeValue'
import useI18nTl from '../useI18nTl'
import useFlowNode, { ProcessingType, SinkType, SourceType } from './useFlowNode'
import useNodeForm from './useNodeForm'

export default (): {
  getDrawerTitle: (type: string) => string
  drawerDefaultWidth: string
  getDrawerWidth: (type: string) => string
  getFormComponent: (type: string) => Component | undefined
} => {
  const { t, tl } = useI18nTl('RuleEngine')

  const { isUsingSchemaBridgeType } = useNodeForm()
  const { isBridgeType, removeDirectionFromSpecificType } = useFlowNode()
  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  const drawerTitleMap: Record<string, string> = {
    [SourceType.Message]: tl('message'),
    [SourceType.Event]: tl('event'),
    [ProcessingType.Function]: tl('dataProcessing'),
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
    [SourceType.MQTTBroker]: UsingSchemaBridgeConfig,
    [ProcessingType.Filter]: FilterForm,
    [ProcessingType.Function]: FunctionForm,
    [SinkType.RePub]: RePubForm,
    [SinkType.Console]: ConsoleForm,
    [SinkType.MQTTBroker]: UsingSchemaBridgeConfig,
  }
  const getFormComponent = (type: string) => {
    if (!type) {
      return undefined
    }
    const component = formComponentMap[type]
    if (!component && isUsingSchemaBridgeType(type)) {
      return UsingSchemaBridgeConfig
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
