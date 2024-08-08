export default {
  list: {
    zh: '列表',
    en: 'List',
  },
  description: {
    zh: '描述',
    en: 'Description',
  },
  basicInfo: {
    zh: '基本信息',
    en: 'Basic Info',
  },
  guideSourceNodeLabel: {
    zh: 'Source',
    en: 'Source',
  },
  guideSourceNodeDesc: {
    zh: '拖拽多个节点以选择消息与事件输入',
    en: 'Drag in multiple nodes to select message and event inputs',
  },
  guideProcessingNodeLabel: {
    zh: 'Processing（可选）',
    en: 'Processing (optional)',
  },
  guideProcessingNodeDesc: {
    zh: '拖拽节点以处理和过滤数据',
    en: 'Drag nodes to transform and filter data',
  },
  guideSinkNodeLabel: {
    zh: 'Sink',
    en: 'Sink',
  },
  guideSinkNodeDesc: {
    zh: '拖拽多个节点以输出数据到外部数据集成',
    en: 'Drag in multiple nodes to output data to external integrations',
  },
  filter: {
    zh: '过滤器',
    en: 'Filter',
  },
  condition: {
    zh: '个条件',
    en: 'condition | conditions',
  },
  functionNum: {
    zh: '个函数',
    en: 'function | functions',
  },
  topicExistedError: {
    zh: 'Topic 已存在',
    en: 'Topic already exists',
  },
  nodeDrawerCancelTip: {
    zh: '是否取消{type}？你所做的修改将不被保存',
    en: 'Are you sure you want to cancel {type}? Your changes will not be saved.',
  },
  flowEmptyError: {
    zh: '无法保存，Flow 中需要有至少一个 Sink 节点和一个 Source 节点',
    en: 'Unable to save, there must be at least one Sink node and one Source node in the Flow',
  },
  flowIntegrityError: {
    zh: '无法保存，Flow 中需要有至少一个 {missing} 节点',
    en: 'Unable to save, at least one {missing} node is required in the Flow',
  },
  isolatedNodeError: {
    zh: 'Flow 中有未连接的节点，请先连接或将其删除|Flow 中有未连接的节点，请先连接或将其删除',
    en: 'There are unconnected node in the flow. Please connect or delete them.|There are unconnected nodes in the flow. Please connect or delete them.',
  },
  multipleFlowError: {
    zh: '每次仅允许创建一个 Flow',
    en: 'Only one flow can be created at a time',
  },
  alias: {
    zh: '别名',
    en: 'Alias',
  },
  transform: {
    zh: '转换',
    en: 'Transform',
  },
  unusedField: {
    zh: '未被使用的字段',
    en: 'Unused field',
  },
  flowSelect: {
    zh: '选择修改的 Flow',
    en: 'Select Flow',
  },
  flowSelectDesc: {
    zh: '此节点被多个 Flow 共用，请选择您想要修改的 Flow',
    en: 'This node is shared by multiple flows, please select the flow you want to modify',
  },
  switchToSql: {
    zh: '切换为 SQL 编辑',
    en: 'Switch to SQL',
  },
  switchToForm: {
    zh: '切换为表单编辑',
    en: 'Switch to Form',
  },
  aliasRequired: {
    zh: '需指定一个别名',
    en: 'Need to specify an alias',
  },
  incorrectConnection: {
    zh: '错误的连线',
    en: 'Incorrect connection',
  },
  editedWayToggleTip: {
    zh: '表达式过于复杂无法完全转换到编辑器，结果将被更改',
    en: 'Expressions that are excessively complex and cannot fully convert in the editor will be altered.',
  },
  filterFunctionsWrongOrder: {
    zh: '函数节点必须放置在过滤器节点之前，请调整节点位置。',
    en: 'Function nodes must be placed before filter nodes. Please adjust node positions.',
  },
  bridgeRemovedTip: {
    zh: '该节点已被删除，请及时更新 Flow',
    en: 'This node has been deleted, please update flow in time',
  },
  webhookAllEventsAndMsgDesc: {
    zh: '包含来自所有主题的消息，以及以下事件：',
    en: 'Contains messages from all topics, as well as the following events:',
  },
}
