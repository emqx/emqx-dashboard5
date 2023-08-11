import MQTTBrokerForm from '@/views/Flow/components/form/MQTTBrokerForm.vue'
import FilterForm from '@/views/Flow/components/form/processing/FilterForm.vue'
import FunctionForm from '@/views/Flow/components/form/processing/FunctionForm.vue'
import EventForm from '@/views/Flow/components/form/source/EventForm.vue'
import MessageForm from '@/views/Flow/components/form/source/MessageForm.vue'
import BridgeHttpConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeHttpConfig.vue'
import BridgeInfluxdbConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeInfluxdbConfig.vue'
import BridgeKafkaConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeKafkaConfig.vue'
import UsingSchemaBridgeConfig from '@/views/RuleEngine/Bridge/Components/UsingSchemaBridgeConfig.vue'
import BridgePulsarConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgePulsarConfig.vue'
import ConsoleForm from '@/views/RuleEngine/components/ConsoleForm.vue'
import RePubForm from '@/views/RuleEngine/components/RePubForm.vue'
import { Component } from 'vue'
import useI18nTl from '../useI18nTl'
import { ProcessingType, SinkType, SourceType } from './useFlowNode'
import useNodeForm from './useNodeForm'

export default (): {
  getDrawerTitle: (type: string) => string
  drawerDefaultWidth: string
  getDrawerWidth: (type: string) => string
  getFormComponent: (type: string) => Component | undefined
} => {
  const { t, tl } = useI18nTl('RuleEngine')

  const { isUsingSchemaBridgeType } = useNodeForm()

  const drawerTitleMap: Record<string, string> = {
    [SourceType.Message]: tl('message'),
    [SourceType.Event]: tl('event'),
    [SourceType.MQTTBroker]: tl('mqttBroker'),
    [ProcessingType.Function]: tl('function'),
    [ProcessingType.Filter]: t('Flow.filter'),
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
    [SourceType.Kafka]: BridgeKafkaConfig,
    [ProcessingType.Filter]: FilterForm,
    [ProcessingType.Function]: FunctionForm,
    [SinkType.RePub]: RePubForm,
    [SinkType.Console]: ConsoleForm,
    [SinkType.MQTTBroker]: MQTTBrokerForm,
    [SinkType.HTTP]: BridgeHttpConfig,
    [SinkType.Kafka]: BridgeKafkaConfig,
    [SinkType.InfluxDB]: BridgeInfluxdbConfig,
    [SinkType.Pulsar]: BridgePulsarConfig,
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
