import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import { Component } from 'vue'
import useI18nTl from '../useI18nTl'
import { ProcessingType, SinkType, SourceType } from './useFlowEditor'

export default (): {
  getDrawerTitle: (type: string) => string
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
  }

  const getDrawerTitle = (type: string) => drawerTitleMap[type] || ''

  const formComponentMap: Record<string, Component> = {
    [SourceType.Message]: MessageForm,
    [SourceType.Event]: EventForm,
  }

  const getFormComponent = (type: string) => formComponentMap[type]

  return {
    getDrawerTitle,
    getFormComponent,
  }
}
