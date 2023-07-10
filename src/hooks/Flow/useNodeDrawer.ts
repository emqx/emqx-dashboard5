import FilterForm from '@/views/Flow/components/form/processing/FilterForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import ConsoleForm from '@/views/RuleEngine/components/ConsoleForm.vue'
import RePubForm from '@/views/RuleEngine/components/RePubForm.vue'
import SourceMQTTBrokerForm from '@/views/Flow/components/form/source/MQTTBrokerForm.vue'
import { Component } from 'vue'
import useI18nTl from '../useI18nTl'
import { ProcessingType, SinkType, SourceType } from './useFlowEditor'

export default (): {
  getDrawerTitle: (type: string) => string
  drawerDefaultWidth: string
  getDrawerWidth: (type: string) => string
  getFormComponent: (type: string) => Component
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
    [SourceType.MQTTBroker]: SourceMQTTBrokerForm,
    [ProcessingType.Filter]: FilterForm,
    [SinkType.RePub]: RePubForm,
    [SinkType.Console]: ConsoleForm,
  }
  const getFormComponent = (type: string) => formComponentMap[type]

  return {
    getDrawerTitle,
    drawerDefaultWidth,
    getDrawerWidth,
    getFormComponent,
  }
}
