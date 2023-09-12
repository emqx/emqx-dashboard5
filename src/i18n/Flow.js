export default {
  createFlow: {
    zh: '创建 Flow',
    en: 'Create Flow',
    ja: 'フローの作成',
  },
  list: {
    zh: '列表',
    en: 'List',
    ja: 'リスト',
  },
  description: {
    zh: '描述',
    en: 'Description',
    ja: '説明',
  },
  basicInfo: {
    zh: '基本信息',
    en: 'Basic Info',
    ja: '基本情報',
  },
  guideSourceNodeLabel: {
    zh: 'Source',
    en: 'Source',
    ja: 'Source',
  },
  guideSourceNodeDesc: {
    zh: '拖拽多个节点以选择消息与事件输入',
    en: 'Drag in multiple nodes to select message and event inputs',
    ja: '',
  },
  guideProcessingNodeLabel: {
    zh: 'Processing（可选）',
    en: 'Processing (optional)',
    ja: '',
  },
  guideProcessingNodeDesc: {
    zh: '拖拽节点以处理和过滤数据',
    en: 'Drag nodes to transform and filter data',
    ja: '',
  },
  guideSinkNodeLabel: {
    zh: 'Sink',
    en: 'Sink',
    ja: 'シンクノード',
  },
  guideSinkNodeDesc: {
    zh: '拖拽多个节点以输出数据到外部数据集成',
    en: 'Drag in multiple nodes to output data to external integrations',
    ja: '',
  },
  function: {
    zh: '函数',
    en: 'Function',
    ja: '関数',
  },
  filter: {
    zh: '过滤器',
    en: 'Filter',
    ja: 'フィルター',
  },
  condition: {
    zh: '个条件',
    en: 'condition | conditions',
    ja: '条件',
  },
  functionNum: {
    zh: '个函数',
    en: 'function | functions',
    ja: '関数',
  },
  topicExistedError: {
    zh: 'Topic 已存在',
    en: 'Topic already exists',
    ja: 'トピックは既に存在します',
  },
  nodeDrawerCancelTip: {
    zh: '是否取消{type}？你所做的修改将不被保存',
    en: 'Are you sure you want to cancel {type}? Your changes will not be saved.',
    ja: '{type}をキャンセルしてもよろしいですか?変更は保存されません。',
  },
  flowEmptyError: {
    zh: '无法保存，Flow 中需要有至少一个 Sink 节点和一个 Source 节点',
    en: 'Unable to save, there must be at least one Sink node and one Source node in the Flow',
    ja: '保存できません。フローには少なくとも1つのシンクノードとソースノードが必要です。',
  },
  flowIntegrityError: {
    zh: '无法保存，Flow 中需要有至少一个 {missing} 节点',
    en: 'Unable to save, at least one {missing} node is required in the Flow',
    ja: '保存できません。フローには少なくとも1つの{missing}ノードが必要です。',
  },
  isolatedNodeError: {
    zh: 'Flow 中有未连接的节点，请先连接或将其删除|Flow 中有未连接的节点，请先连接或将其删除',
    en: 'There are unconnected node in the flow. Please connect or delete them.|There are unconnected nodes in the flow. Please connect or delete them.',
    ja: 'フロー中に未接続のノードがあります。接続するか削除してください。 | フロー中に未接続のノードがあります。接続するか削除してください。',
  },
  multipleFlowError: {
    zh: '每次仅允许创建一个 Flow',
    en: 'Only one flow can be created at a time',
    ja: '一度に作成できるフローは1つのみです',
  },
  alias: {
    zh: '别名',
    en: 'Alias',
    ja: 'エイリアス',
  },
  transform: {
    zh: '转换',
    en: 'Transform',
    ja: '変換',
  },
  unusedField: {
    zh: '未被使用的字段',
    en: 'Unused field',
    ja: '未使用のフィールド',
  },
  flowSelect: {
    zh: '选择修改的 Flow',
    en: 'Select Flow',
    ja: '変更するフローを選択',
  },
  flowSelectDesc: {
    zh: '此节点被多个 Flow 共用，请选择您想要修改的 Flow',
    en: 'This node is shared by multiple flows, please select the flow you want to modify',
    ja: 'このノードは複数のフローで共有されています。変更するフローを選択してください',
  },
  switchToSql: {
    zh: '切换为 SQL 编辑',
    en: 'Switch to SQL',
    ja: 'SQL編集に切り替え',
  },
  switchToForm: {
    zh: '切换为表单编辑',
    en: 'Switch to Form',
    ja: 'フォーム編集に切り替え',
  },
  aliasRequired: {
    zh: '调用函数后，需指定一个别名',
    en: 'Need to specify an alias after calling the function',
    ja: '関数を呼び出した後、エイリアスを指定する必要があります',
  },
  nameInputDesc: {
    zh: '由于名称不可重复，请输入新名称以保存',
    en: 'Since names cannot be duplicated, please enter a new name to save',
  },
  saveAsDuplication: {
    zh: '保存为新 {target}',
    en: 'Save as a new {target}',
  },
  pleaseInputOrSelect: {
    zh: '请输入或选择',
    en: 'Please Input or Select',
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
  saveAsNewWarning: {
    zh: '当前配置中的密码字段己加密，保存为新 {target} 请重新输入',
    en: 'The password field in the current configuration is encrypted, please re-enter when saving as a new {target}',
  },
}
