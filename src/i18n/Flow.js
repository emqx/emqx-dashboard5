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
    zh: 'Source 节点',
    en: 'Start with a Source',
    ja: 'ソースノードから始める',
  },
  guideSourceNodeDesc: {
    zh: '拖动 Source 节点，可以有多个 Source 节点',
    en: 'Drag source nodes and multiple source nodes are allowed here',
    ja: 'ソースノードをドラッグできます。複数のソースノードが許可されます',
  },
  guideProcessingNodeLabel: {
    zh: 'Processing 节点',
    en: 'Processing',
    ja: '処理ノード',
  },
  guideProcessingNodeDesc: {
    zh: '拖动 Processing 节点（可选）',
    en: 'Drag Processing (optional)',
    ja: '処理ノードをドラッグ(オプション)',
  },
  guideSinkNodeLabel: {
    zh: 'Sink 节点',
    en: 'Sink',
    ja: 'シンクノード',
  },
  guideSinkNodeDesc: {
    zh: '拖动 Sink 节点，可以有多个 Sink 节点',
    en: 'Drag sink nodes and multiple sink nodes are allowed here',
    ja: 'シンクノードをドラッグできます。複数のシンクノードが許可されます',
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
}
