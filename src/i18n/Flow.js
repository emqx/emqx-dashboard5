export default {
  createFlow: {
    zh: '创建 Flow',
    en: 'Create Flow',
  },
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
    zh: 'Source 节点',
    en: 'Start with a Source',
  },
  guideSourceNodeDesc: {
    zh: '拖动 Source 节点，可以有多个 Source 节点',
    en: 'Drag source nodes and multiple source nodes are allowed here',
  },
  guideProcessingNodeLabel: {
    zh: 'Processing 节点',
    en: 'Processing',
  },
  guideProcessingNodeDesc: {
    zh: '拖动 Processing 节点（可选）',
    en: 'Drag Processing (optional)',
  },
  guideSinkNodeLabel: {
    zh: 'Sink 节点',
    en: 'Sink',
  },
  guideSinkNodeDesc: {
    zh: '拖动 Sink 节点，可以有多个 Sink 节点',
    en: 'Drag sink nodes and multiple sink nodes are allowed here',
  },
  function: {
    zh: '函数',
    en: 'Function',
  },
  filter: {
    zh: '过滤器',
    en: 'Filter',
  },
  condition: {
    zh: '个条件',
    en: 'condition | conditions',
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
}
