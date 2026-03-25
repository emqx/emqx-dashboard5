export default {
  registerCard: {
    zh: '注册 Agent',
    en: 'Register Agent',
  },
  orgId: {
    zh: '组织 ID',
    en: 'Organization ID',
  },
  unitId: {
    zh: '单元 ID',
    en: 'Unit ID',
  },
  agentId: {
    zh: 'Agent ID',
    en: 'Agent ID',
  },
  version: {
    zh: '版本',
    en: 'Version',
  },
  online: {
    zh: '在线',
    en: 'Online',
  },
  offline: {
    zh: '离线',
    en: 'Offline',
  },
  agentJson: {
    zh: 'Agent Card JSON',
    en: 'Agent Card JSON',
  },
  cardJsonInvalid: {
    zh: '请输入合法的 JSON',
    en: 'Please enter valid JSON',
  },
  registerSuccess: {
    zh: '注册成功',
    en: 'Registered successfully',
  },
  editCard: {
    zh: '编辑 Agent',
    en: 'Edit Agent',
  },
  idFormatTip: {
    zh: '只允许字母、数字、点号、下划线和连字符',
    en: 'Only letters, digits, dots, underscores, and hyphens are allowed',
  },
  exactFilterTip: {
    zh: '三个过滤条件均为精确匹配，不支持模糊搜索',
    en: 'All three filters use exact matching; fuzzy search is not supported',
  },
  helpDesc: {
    zh: 'Agent Card JSON 必须是一个合法的 JSON 对象，在设置中开启 “验证 Schema” 时，JSON 需包含以下必填字段：',
    en: 'Agent Card JSON must be a valid JSON object, and when "Validate Schema" is enabled in the settings, the JSON must contain the following required fields:',
  },
  helpFieldName: {
    zh: 'Agent 名称',
    en: 'Agent name',
  },
  helpFieldDescription: {
    zh: 'Agent 描述',
    en: 'Agent description',
  },
  helpFieldVersion: {
    zh: '版本号，如 "1.0.0"',
    en: 'Version string, e.g. "1.0.0"',
  },
  helpFieldUrl: {
    zh: 'Agent 的 HTTP 服务地址（URI）',
    en: 'HTTP service URL for the agent (URI)',
  },
  helpFieldSkills: {
    zh: '技能列表（数组，不可为空），每项需包含 id、name、description',
    en: 'List of skills (non-empty array), each item must have id, name, description',
  },
  agentCardDoc: {
    zh: 'https://a2a-protocol.org/latest/tutorials/python/3-agent-skills-and-card/#agent-card',
    en: 'https://a2a-protocol.org/latest/tutorials/python/3-agent-skills-and-card/#agent-card',
  },
  moreRef: {
    zh: '更多信息请参考：{link}',
    en: 'More information please refer to: {link}',
  },
  helpExample: {
    zh: '示例',
    en: 'Example',
  },
  cardFieldRequired: {
    zh: 'Agent Card JSON 缺少必填字段：{field}',
    en: 'Agent Card JSON is missing required field: {field}',
  },
  cardFieldTypeMismatch: {
    zh: 'Agent Card JSON 字段类型错误：{field} 应为 {expected}',
    en: 'Agent Card JSON field type mismatch: {field} should be {expected}',
  },
  cardSkillsEmpty: {
    zh: 'skills 数组不能为空',
    en: 'skills array must not be empty',
  },
  cardSkillItemInvalid: {
    zh: 'skills[{index}] 缺少必填字段：{field}',
    en: 'skills[{index}] is missing required field: {field}',
  },
  cardSkillItemTypeMismatch: {
    zh: 'skills[{index}].{field} 字段类型错误，应为 string',
    en: 'skills[{index}].{field} field type mismatch, expected string',
  },
  A2AHelp: {
    zh: `支持两种方式注册 Agent

1. 通过 Dashboard： 点击页面上方的注册按钮，填写并提交 Agent 信息。
2. 通过 MQTT： 使用 {'{'}org_id{'}'}/{'{'}unit_id{'}'}/{'{'}agent_id{'}'} 作为客户端 ID 连接 EMQX，向主题 $a2a/v1/discovery/{'{'}org_id{'}'}/{'{'}unit_id{'}'}/{'{'}agent_id{'}'} 发布一条保留消息，消息内容为 Agent Card JSON。格式请参考 [Agent Card](@:A2A.agentCardDoc)。`,
    en: `There are two ways to register an Agent:

1. Via Dashboard: Click the Register button at the top of this page to fill in and submit the Agent.
2. Via MQTT: Connect with a Client ID of {'{'}org_id{'}'}/{'{'}unit_id{'}'}/{'{'}agent_id{'}'}, then publish a retained message to the topic
  $a2a/v1/discovery/{'{'}org_id{'}'}/{'{'}unit_id{'}'}/{'{'}agent_id{'}'} with the Agent Card JSON as the payload. Please refer to [Agent Card](@:A2A.agentCardDoc) for the format.`,
  },
  guidanceTitle: {
    zh: '注册管理您的 AI Agent',
    en: 'Register and manage your AI Agents',
  },
  guidanceDesc: {
    zh: '通过 A2A Registry 注册和管理 AI Agent，实现 Agent 之间的互相发现与协作。',
    en: 'A2A Registry lets you register and manage AI Agents, enabling discovery and collaboration between them.',
  },
  guidanceDisabledTip: {
    zh: 'A2A Registry 功能当前未启用，请先启用该功能。',
    en: 'A2A Registry is currently disabled. Please enable it first.',
  },
  deleteConfirm: {
    zh: '确认删除当前 Agent？',
    en: 'Confirm to delete this Agent?',
  },
}
