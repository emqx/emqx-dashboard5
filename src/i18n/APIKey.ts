export default {
  keyName: {
    zh: '密钥名称',
    en: 'Name',
  },
  expireAt: {
    zh: '到期时间',
    en: 'Expire At',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  view: {
    zh: '查看',
    en: 'View',
  },
  isEnable: {
    zh: '是否启用',
    en: 'Is Enable',
  },
  show: {
    zh: '显示',
    en: 'Show',
  },
  close: {
    zh: '关闭',
    en: 'Close',
  },
  apiKeyDetail: {
    zh: 'API 密钥详情',
    en: 'Details',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
  },
  disable: {
    zh: '停用',
    en: 'Disable',
  },
  keyNameRequired: {
    zh: '请填写密钥名称',
    en: 'Name is required',
  },
  confirmDelete: {
    zh: '确认删除该 API 密钥？',
    en: 'Confirm delete API key?',
  },
  secretKeyPlaceholder: {
    zh: '仅在创建时显示一次',
    en: 'Only shown once when created',
  },
  resultTip: {
    zh: '将 API Key 和 Secret Key 保存到安全的地方，后续将不再显示 Secret Key。',
    en: 'Save API Key and Secret Key to a safe place, Secret Key will not be shown again.',
  },
  neverExpire: {
    zh: '永不过期',
    en: 'Never expire',
  },
  expired: {
    zh: '已过期',
    en: 'Expired',
  },
  scopes: {
    zh: '权限范围',
    en: 'Scopes',
  },
  scopesPlaceholder: {
    zh: '未选择时，不授予任何权限范围',
    en: 'When empty, grant no scopes',
  },
  scopeMode: {
    zh: '权限模式',
    en: 'Permission Mode',
  },
  scopeModeDesc: {
    zh: `选择 API 密钥的权限配置方式：

- **角色默认权限**：自动使用当前角色的默认权限。管理员和查看者可访问全部管理功能类别，发布者仅可发布消息；以后角色默认权限发生变化时，新权限会自动生效。
- **系统级权限**：仅授予“系统设置”权限范围，可访问核心配置、监听器、插件、数据备份与恢复、OpenTelemetry 等系统功能。
- **自定义受限权限**：从连接、消息发布、数据集成、监控等非系统权限范围中按需选择。命名空间 API 密钥不能选择消息发布。未选择任何权限时，API 密钥不能访问受权限范围保护的接口。

无论选择哪种模式，具体可执行的操作和可查看的数据仍受角色和命名空间限制。各角色的默认权限如下。`,
    en: `Choose how permissions are assigned to the API key:

- **Role Default Scopes**: Automatically use the current role's defaults. Administrators and viewers can access all management feature areas, while publishers can only publish messages. Future changes to the role defaults take effect automatically.
- **System-level Permissions**: Grant only the System scope, covering core configuration, listeners, plugins, data backup and restore, OpenTelemetry, and other system functions. 
- **Custom Restricted Permissions**: Select non-system scopes such as Connections, Publish, Data Integration, and Monitoring. Namespaced API keys cannot select Publish. When no scope is selected, the API key cannot access scope-protected APIs.

In every mode, available operations and visible data remain restricted by the role and Namespace. The default scopes for each role are listed below.`,
  },
  roleDefaultScopes: {
    zh: '角色默认权限',
    en: 'Role Default Scopes',
  },
  noScopes: {
    zh: '无权限范围',
    en: 'No Scopes',
  },
  scopeModeSystem: {
    zh: '系统级权限',
    en: 'System-level Permissions',
  },
  scopeModeCustom: {
    zh: '自定义受限权限',
    en: 'Custom Restricted Permissions',
  },
  customScopesSystemError: {
    zh: '自定义受限权限不能包含“系统设置”权限范围，请移除该权限或选择“系统级权限”。',
    en: 'Custom restricted permissions cannot include the System scope. Remove it or select System-level Permissions.',
  },
  namespacedPublishError: {
    zh: '命名空间 API 密钥不能包含“消息发布”权限范围，请移除该权限。',
    en: 'Namespaced API keys cannot include the Publish scope. Remove it before saving.',
  },
  mixedScopesMigrationDesc: {
    zh: '此 API 密钥保存了旧版的混合权限配置。请移除“系统设置”后继续使用自定义受限权限，或改选“系统级权限”或“角色默认权限”。',
    en: 'This API key contains a legacy mixed-scope configuration. Remove System to keep custom restricted permissions, or select System-level Permissions or Role Default Scopes.',
  },
  namespacedPublishMigrationDesc: {
    zh: '此命名空间 API 密钥保存了旧版的“消息发布”权限。修改角色或权限范围时，请先移除“消息发布”。',
    en: 'This namespaced API key contains the legacy Publish scope. Remove Publish before changing its role or scopes.',
  },
  scopesColumnDesc: {
    zh: '权限范围用于限定 API 密钥可以访问的功能类别。显示“角色默认权限”表示自动继承当前角色的默认设置；具体权限标签表示使用显式配置；“无权限范围”表示该密钥不能访问受权限范围保护的接口。具体可执行的操作仍受角色和命名空间限制。',
    en: 'Scopes limit which feature areas an API key can access. “Role Default Scopes” means the key automatically inherits the defaults of its current role; individual scope tags indicate an explicit configuration; “No Scopes” means the key cannot access scope-protected APIs. Allowed operations are still restricted by the role and Namespace.',
  },
  roleDefaultScopesByRoleDesc: {
    zh: `**各角色的默认权限**

- **全局管理员 / 全局查看者**：连接、消息发布、数据集成、访问控制、网关、监控、集群管理、系统设置、审计日志、License
- **命名空间管理员**：连接、监控、数据集成、访问控制、系统设置、集群管理、License
- **命名空间查看者**：连接、消息发布、数据集成、访问控制、网关、监控、集群管理、系统设置、审计日志、License
- **发布者**：消息发布`,
    en: `**Default permissions by role**

- **Global Administrator / Global Viewer**: Connections, Publish, Data Integration, Access Control, Gateways, Monitoring, Cluster, System, Audit Log, and License
- **Namespace Administrator**: Connections, Monitoring, Data Integration, Access Control, System, Cluster, and License
- **Namespace Viewer**: Connections, Publish, Data Integration, Access Control, Gateways, Monitoring, Cluster, System, Audit Log, and License
- **Publisher**: Publish`,
  },
  roleDefaultScopesRestrictionDesc: {
    zh: '上述权限范围决定 API 密钥可访问的功能类别；具体可执行的操作和可查看的数据仍受角色和命名空间限制。发布者只能使用消息发布权限。',
    en: 'These scopes determine which feature areas the API key can access. Allowed operations and visible data are still restricted by its role and Namespace. Publishers can only use the Publish scope.',
  },
  scopeLabel_connections: {
    zh: '连接',
    en: 'Connections',
  },
  scopeLabel_publish: {
    zh: '消息发布',
    en: 'Publish',
  },
  scopeLabel_data_integration: {
    zh: '数据集成',
    en: 'Data Integration',
  },
  scopeLabel_access_control: {
    zh: '访问控制',
    en: 'Access Control',
  },
  scopeLabel_gateways: {
    zh: '网关',
    en: 'Gateways',
  },
  scopeLabel_monitoring: {
    zh: '监控',
    en: 'Monitoring',
  },
  scopeLabel_cluster_operations: {
    zh: '集群管理',
    en: 'Cluster',
  },
  scopeLabel_system: {
    zh: '系统设置',
    en: 'System',
  },
  scopeLabel_audit: {
    zh: '审计日志',
    en: 'Audit Log',
  },
  scopeLabel_license: {
    zh: 'License',
    en: 'License',
  },
  scopeDesc_connections: {
    zh: '客户端、订阅、主题、封禁、保留消息、文件传输、延迟发布',
    en: 'Clients, subscriptions, topics, banning, retained messages, file transfer, and delayed messages',
  },
  scopeDesc_publish: {
    zh: 'MQTT 消息发布接口',
    en: 'MQTT message publishing',
  },
  scopeDesc_data_integration: {
    zh: '规则、连接器、Schema 注册表、Schema 校验、消息转换、ExHook、AI Completion',
    en: 'Rules, connectors, schema registry, schema validation, message transformation, ExHook, and AI completion',
  },
  scopeDesc_access_control: {
    zh: '客户端认证与授权配置',
    en: 'Client authentication and authorization configuration',
  },
  scopeDesc_gateways: {
    zh: '协议网关（CoAP、LwM2M 等）及其认证、客户端与监听器',
    en: 'Protocol gateways (CoAP, LwM2M, etc.) and their authentication, clients, and listeners',
  },
  scopeDesc_monitoring: {
    zh: '指标、告警、日志追踪、慢订阅、Prometheus',
    en: 'Metrics, alarms, trace, slow subscriptions, and Prometheus',
  },
  scopeDesc_cluster_operations: {
    zh: '节点与集群管理、负载均衡、多租户',
    en: 'Cluster management, node operations, load rebalancing, and multi-tenancy',
  },
  scopeDesc_system: {
    zh: '核心配置、监听器、插件、备份、OpenTelemetry',
    en: 'Core configuration, listeners, plugins, backup, and OpenTelemetry',
  },
  scopeDesc_audit: {
    zh: '查询审计日志记录',
    en: 'Audit log query',
  },
  scopeDesc_license: {
    zh: 'License 管理',
    en: 'License management',
  },
  scopeLabel_user_management: {
    zh: '用户管理',
    en: 'User Management',
  },
  scopeLabel_mfa_management: {
    zh: 'MFA 管理',
    en: 'MFA Management',
  },
  scopeLabel_sso_management: {
    zh: 'SSO 管理',
    en: 'SSO Management',
  },
  scopeLabel_api_key_management: {
    zh: 'API 密钥管理',
    en: 'API Key Management',
  },
  scopeDesc_user_management: {
    zh: '管理 Dashboard 用户（创建、更新、删除、修改其他用户密码）',
    en: "Manage dashboard users (create, update, delete, change other users' password)",
  },
  scopeDesc_mfa_management: {
    zh: '管理员可重置任意用户 MFA 并绕过强制启用 MFA 锁定；普通用户仅可对自身 MFA 进行豁免操作',
    en: "For administrators: reset any user's MFA and override Force MFA locks. For non-administrators: self-exemption only on the holder's own MFA.",
  },
  scopeDesc_sso_management: {
    zh: '配置单点登录后端（LDAP、OIDC、SAML）',
    en: 'Configure SSO backends (LDAP, OIDC, SAML)',
  },
  scopeDesc_api_key_management: {
    zh: '管理 API 密钥（创建、更新、删除）',
    en: 'Manage API keys (create, update, delete)',
  },
}
