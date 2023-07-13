import { BridgeDirection } from '@/types/enum'
import MQTTBrokerForm from '@/views/Flow/components/form/MQTTBrokerForm.vue'
import FilterForm from '@/views/Flow/components/form/processing/FilterForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import BridgeHttpConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeHttpConfig.vue'
import ConsoleForm from '@/views/RuleEngine/components/ConsoleForm.vue'
import RePubForm from '@/views/RuleEngine/components/RePubForm.vue'
import { Component } from 'vue'
import useI18nTl from '../useI18nTl'
import { ProcessingType, SinkType, SourceType } from './useFlowNode'

export default (): {
  getDrawerTitle: (type: string) => string
  drawerDefaultWidth: string
  getDrawerWidth: (type: string) => string
  getFormComponent: (type: string) => Component
  getFormComponentProps: (type: string) => Record<string, any>
} => {
  const { tl } = useI18nTl('RuleEngine')

  const drawerTitleMap: Record<string, string> = {
    [SourceType.Message]: tl('message'),
    [SourceType.Event]: tl('event'),
    [SourceType.MQTTBroker]: tl('mqttBroker'),
    [ProcessingType.Function]: tl('function'),
    [ProcessingType.Filter]: tl('filter'),
    [SinkType.HTTP]: tl('HTTPServer'),
    [SinkType.MQTTBroker]: tl('mqttBroker'),
    [SinkType.RePub]: tl('republish'),
    [SinkType.Console]: tl('consoleOutput'),
  }
  const getDrawerTitle = (type: string) => drawerTitleMap[type] || ''

  const drawerDefaultWidth = '40%'
  const drawerWidthMap: Record<string, string> = {
    [ProcessingType.Filter]: '68%',
  }
  const getDrawerWidth = (type: string) => drawerWidthMap[type] || drawerDefaultWidth

  const formComponentMap: Record<string, Component> = {
    [SourceType.Message]: MessageForm,
    [SourceType.Event]: EventForm,
    [SourceType.MQTTBroker]: MQTTBrokerForm,
    [ProcessingType.Filter]: FilterForm,
    [SinkType.RePub]: RePubForm,
    [SinkType.Console]: ConsoleForm,
    [SinkType.MQTTBroker]: MQTTBrokerForm,
    [SinkType.HTTP]: BridgeHttpConfig,
  }
  const getFormComponent = (type: string) => formComponentMap[type]

  const formComponentPropsMap: Record<string, Record<string, any>> = {
    [SourceType.MQTTBroker]: { direction: BridgeDirection.Ingress },
    [SinkType.MQTTBroker]: { direction: BridgeDirection.Egress },
    [SinkType.HTTP]: { colSpan: 24 },
  }
  const getFormComponentProps = (type: string) => formComponentPropsMap[type] || {}

  return {
    getDrawerTitle,
    drawerDefaultWidth,
    getDrawerWidth,
    getFormComponent,
    getFormComponentProps,
  }
}
