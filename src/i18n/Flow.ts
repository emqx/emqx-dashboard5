export default {
  createNamespaceFlow: {
    zh: '创建命名空间 Flow',
    en: 'Create Namespaced Flow',
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
  alias: {
    zh: '别名',
    en: 'Alias',
  },
  aliasDesc: {
    zh: '别名如包含除字母、数字和下划线以外的字符，或以数字开头，或为 SQL 关键字时，请为别名加上双引号',
    en: 'If the alias contains characters other than letters, numbers, and underscores, or starts with a number, or is a SQL keyword, please add double quotes to the alias',
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
  aliasFormatError: {
    zh: '格式错误的别名',
    en: 'Invalid alias format',
  },
  editedWayToggleTip: {
    zh: '表达式过于复杂无法完全转换到编辑器，结果将被更改',
    en: 'Expressions that are excessively complex and cannot fully convert in the editor will be altered.',
  },
  filterFunctionsWrongOrder: {
    zh: '过滤器节点必须放置在数据处理节点及 AI 节点之后，请调整节点位置。',
    en: 'Filter nodes must be placed after data processing node and AI nodes. Please adjust node positions.',
  },
  dataRemovedTip: {
    zh: '该节点已被删除，请及时更新 Flow',
    en: 'This node has been deleted, please update flow in time',
  },
  webhookAllEventsAndMsgDesc: {
    zh: '包含来自所有主题的消息，以及以下事件：',
    en: 'Contains messages from all topics, as well as the following events:',
  },
  aiOutputAliasDesc: {
    zh: '输出结果别名，用户在动作或后续处理中引用输出结果',
    en: 'Output result alias, used to reference output results in actions or subsequent processing',
  },
  aiCompletionTip: {
    zh: 'SQL 中包含 AI函数，AI 函数的系统消息及 API 密钥等配置，请至 {link} 编辑',
    en: 'SQL contains AI functions, the system prompt and API key configurations of AI functions, please edit in the {link}',
  },
  flowDetail: {
    zh: 'Flow 详情页',
    en: 'flow details page',
  },
  openAiModelTip: {
    zh: '当前 OpenAI 使用 Responses API，一些较旧的模型不支持该 API，具体请查询 https://platform.openai.com/docs/models/compare?model=o1-mini',
    en: 'Current OpenAI uses Responses API, some older models do not support this API, please check the https://platform.openai.com/docs/models/compare?model=o1-mini',
  },
}
