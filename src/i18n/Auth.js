export default {
  mechanism: {
    zh: '认证方式',
    en: 'Mechanism',
    ja: '認証方式',
  },
  dataSource: {
    zh: '数据源',
    en: 'Backend',
    ja: 'データソース',
  },
  mechanismAndBackend: {
    zh: '数据源及认证方式',
    en: 'Mechanism and Backend',
    ja: 'データソースと認証方式',
  },
  status: {
    zh: '数据源状态',
    en: 'Status',
    ja: 'データソースの状態',
  },
  createAuth: {
    zh: '创建认证',
    en: 'Create Authentication',
    ja: '認証の作成',
  },
  createAuthz: {
    zh: '创建授权',
    en: 'Create Authorization',
    ja: '認可の作成',
  },
  config: {
    zh: '配置参数',
    en: 'Configuration',
    ja: '構成パラメータ',
  },
  scram: {
    zh: '增强认证',
    en: 'SCRAM',
    ja: 'SCRAM',
  },
  passwordBasedDesc: {
    zh: '使用客户端用户名、Client ID 与密码进行认证',
    en: 'Authenticate using client username, client id, and password',
    ja: 'クライアントのユーザー名、クライアントID、パスワードを使用して認証',
  },
  jwtDesc: {
    zh: '客户端携带 JWT 进行认证',
    en: 'Authentication using client JWT',
    ja: 'クライアントのJWTを使用して認証',
  },
  secret_base64_encoded: {
    zh: 'Secret 使用 Base64 编码',
    en: 'Secret Base64 Encoded',
    ja: 'SecretはBase64でエンコードされています',
  },
  scramDesc: {
    zh: 'MQTT 5.0 增强认证',
    en: 'MQTT 5 Enhanced Authentication',
    ja: 'MQTT 5 強化認証',
  },
  dataSourceDesc: {
    zh: '选择存储认证数据的数据库或提供认证数据功能的 HTTP 服务器',
    en: 'Select the database where the authentication data is stored or the HTTP server that provides the authentication data function',
    ja: '認証データが保存されているデータベースまたは認証データ機能を提供するHTTPサーバーを選択',
  },
  dataSourceAuthzDesc: {
    zh: '选择存储权限数据的数据库或提供认证数据功能的 HTTP 服务器',
    en: 'Select the database where the authorization data is stored or the HTTP server that provides the authorization data function',
    ja: '認可データが保存されているデータベースまたは認可データ機能を提供するHTTPサーバーを選択',
  },
  dataSourceScramDesc: {
    zh: '选择存储认证数据的数据库',
    en: 'Select the database where the authentication data is stored',
    ja: '認証データが保存されているデータベースを選択',
  },
  database: {
    zh: '数据库',
    en: 'Database',
    ja: 'データベース',
  },
  jwtDataSourceDesc: {
    zh: 'JWT 认证无需选择数据源，请继续下一步配置',
    en: 'JWT authentication does not require a backend, continue to the next step',
    ja: 'JWT認証はバックエンドを必要としないので、次のステップに進んでください',
  },
  reconnect: {
    zh: '自动重连',
    en: 'Reconnect',
    ja: '再接続',
  },
  userConfig: {
    zh: '用户管理',
    en: 'User Management',
    ja: 'ユーザー管理',
  },
  users: {
    zh: '用户管理',
    en: 'Users',
    ja: 'ユーザー',
  },
  data: {
    zh: '数据管理',
    en: 'Data',
    ja: 'データ',
  },
  testSuccess: {
    zh: '测试通过，您的配置可以正常使用',
    en: 'Test success, your configuration works fine',
    ja: 'テスト成功',
  },
  testFailed: {
    zh: '测试失败',
    en: 'Test failed',
    ja: 'テスト失敗',
  },
  moveUp: {
    zh: '上移',
    en: 'Move up',
    ja: '上に移動',
  },
  moveDown: {
    zh: '下移',
    en: 'Move down',
    ja: '下に移動',
  },
  authzSetting: {
    zh: '授权设置',
    en: 'Authorization Settings',
    ja: '認可設定',
  },
  enableCache: {
    zh: '启用缓存',
    en: 'Enable Cache',
    ja: 'キャッシュの有効化',
  },
  clearCache: {
    zh: '清除缓存',
    en: 'Clear cache',
    ja: 'キャッシュのクリア',
  },
  clearCacheDesc: {
    zh: '清除当前所有授权结果缓存。',
    en: 'Clears all current authorization result caches.',
    ja: '現在のすべての認可結果のキャッシュをクリアします。',
  },
  clearCacheConfirm: {
    zh: '是否确认清除缓存',
    en: 'Confirm clear cache?',
    ja: 'キャッシュをクリアしてもよろしいですか？',
  },
  clearedSuccessfully: {
    zh: '清除成功',
    en: 'Cleared successfully',
    ja: 'クリア成功',
  },
  maxSize: {
    zh: '缓存最大数量',
    en: 'Maximum number of cached items',
    ja: 'キャッシュ最大数',
  },
  ttl: {
    zh: '缓存过期时间',
    en: 'Time to live for the cached data',
    ja: 'キャッシュTTL',
  },
  setDefault: {
    zh: '设置默认',
    en: 'Set default',
    ja: 'デフォルトへ設定',
  },
  setDefaultConfirm: {
    zh: '确定要将当前输入重置为默认值吗？',
    en: 'Are you sure you want to reset the current input to default value?',
    ja: '現在の入力をデフォルト値にリセットしてもよろしいですか？',
  },
  passwordHash: {
    zh: '密码加密方式',
    en: 'Password Hash',
    ja: 'パスワードハッシュ',
  },
  saltPosition: {
    zh: '加盐方式',
    en: 'Salt Position',
    ja: 'ソルトの配置',
  },
  queryTimeout: {
    zh: '查询超时',
    en: 'Query Timeout',
    ja: 'クエリタイムアウト',
  },
  userIdType: {
    zh: '账号类型',
    en: 'UserID Type',
    ja: 'ユーザーIDの種類',
  },
  server: {
    zh: '服务',
    en: 'Server',
    ja: 'サーバー',
  },
  servers: {
    zh: '服务列表',
    en: 'Servers',
    ja: 'サーバーリスト',
  },
  enableTLS: {
    zh: '启用 TLS',
    en: 'Enable TLS',
    ja: 'TLSの有効化',
  },
  tlsVerify: {
    zh: '验证服务器证书',
    en: 'TLS Verify',
    ja: '証明書の検証',
  },
  mongoType: {
    zh: '部署模式',
    en: 'MongoDB Mode',
    ja: 'MongoDBモード',
  },
  mongoAuthSource: {
    zh: '认证源',
    en: 'Auth Source',
    ja: 'MongoDB認証ソース',
  },
  srvRecord: {
    zh: 'SRV 记录',
    en: 'SRV Record',
    ja: 'SRVレコード',
  },
  redisType: {
    zh: '部署模式',
    en: 'Redis Mode',
    ja: 'Redisモード',
  },
  single: {
    zh: '单节点',
    en: 'Single',
    ja: 'シングル',
  },
  connectTimeout: {
    zh: '连接超时',
    en: 'Connect Timeout',
    ja: '接続タイムアウト',
  },
  requestTimeout: {
    zh: '请求超时',
    en: 'Request Timeout',
    ja: 'リクエストタイムアウト',
  },
  filter: {
    zh: '查询 Filter',
    en: 'Filter',
    ja: 'フィルター',
  },
  cmd: {
    zh: '命令',
    en: 'CMD',
    ja: 'コマンド',
  },
  passwordHashField: {
    zh: 'Password Hash 字段名',
    en: 'Password Hash Field',
    ja: 'パスワードハッシュフィールド',
  },
  saltField: {
    zh: 'Salt 字段名',
    en: 'Salt Field',
    ja: 'ソルトフィールド',
  },
  superuserField: {
    zh: 'is_superuser 字段名',
    en: 'is_superuser Field',
    ja: 'is_superuserフィールド',
  },
  sentinel: {
    zh: 'Sentinel 名字',
    en: 'Sentinel Name',
    ja: 'センチネル名',
  },
  method: {
    zh: '请求方式',
    en: 'Method',
    ja: 'メソッド',
  },
  httpPipelining: {
    zh: 'HTTP 管道',
    en: 'HTTP Pipelining',
    ja: 'HTTPパイプライン',
  },
  isSuperuser: {
    zh: '是否为超级用户',
    en: 'Is superuser',
    ja: 'スーパーユーザーですか',
  },
  isSuperuserDesc: {
    zh: '当设置为超级用户后，该用户将跳过后续所有的权限检查。',
    en: 'When set to superuser, this user will skip all subsequent permission.',
    ja: 'スーパーユーザーに設定すると、このユーザーは以降のすべての権限チェックをスキップします。',
  },
  validMethod: {
    zh: '验证方式',
    en: 'JWT or JWKS',
    ja: 'JWTまたはJWKS',
  },
  algorithm: {
    zh: '加密方式',
    en: 'Algorithm',
    ja: 'アルゴリズム',
  },
  refreshInterval: {
    zh: 'JWKS 刷新间隔',
    en: 'JWKS Refresh Interval',
    ja: 'JWKS更新間隔',
  },
  builtInDatabase: {
    zh: '内置数据库',
    en: 'Built-in Database',
    ja: '組み込みデータベース',
  },
  builtInDatabaseDesc: {
    zh: '内置数据库授权无需配置参数，请点击创建按钮完成操作',
    en: 'Built-in database authorization does not require configuration parameters, please click the Create button to complete the operation',
    ja: '組み込みデータベース認可には設定パラメーターは不要です。作成ボタンをクリックして操作を完了してください。',
  },
  HTTPServer: {
    zh: 'HTTP 服务',
    en: 'HTTP Server',
    ja: 'HTTPサーバー',
  },
  file: {
    zh: '文件',
    en: 'File',
    ja: 'ファイル',
  },
  permissionCount: {
    zh: '权限条数',
    en: 'Number of permissions',
    ja: 'アクション数',
  },
  pleaseEnterClientID: {
    zh: '请输入客户端 ID',
    en: 'Client ID is required',
    ja: 'クライアントIDが必要です',
  },
  pleaseEnterUsername: {
    zh: '请输入用户名',
    en: 'Username is required',
    ja: 'ユーザー名が必要です',
  },
  pleaseSelectPermission: {
    zh: '请选择 permission',
    en: 'Please select permission',
    ja: 'アクセス許可を選択してください',
  },
  pleaseSelectAction: {
    zh: '请选择 Action',
    en: 'Please select action',
    ja: 'アクションを選択してください',
  },
  pleaseEnterTopic: {
    zh: '请输入 Topic',
    en: 'Please enter topic',
    ja: 'トピックを入力してください',
  },
  iterationCount: {
    zh: '迭代次数',
    en: 'Iteration Count',
    ja: '反復回数',
  },
  dkLength: {
    zh: '密钥长度',
    en: 'Derived key length',
    ja: '鍵の長さ',
  },
  payloadTooLargeTip: {
    zh: 'payload 大小超过 1MB 内容无法查看',
    en: 'The payload size exceeds 1MB, and the content cannot be viewed',
    ja: 'ペイロードサイズが1MBを超えており、内容を表示することができません。',
  },
  readMode: {
    zh: '读模式',
    en: 'Read Mode',
    ja: '読み取りモード',
  },
  writeMode: {
    zh: '写模式',
    en: 'Write Mode',
    ja: '書き込みモード',
  },
  topicTips: {
    zh: '主题字符串，支持 ${0} 和 ${1} 占位符，在执行权限检查时会被替换为对应客户端的 Username 或 Client ID',
    en: "Topic supports ${0} and ${1} placeholders, which will be replaced with the corresponding client's Username or Client ID when performing permission checks.",
  },
  jwtBase64Tips: {
    zh: '接收一个 Base64 编码后的字符串',
    en: 'Receive a Base64-encoded string',
    ja: 'Base64でエンコードされた文字列を受け取ります',
  },
  nodeStatusDesc: {
    zh: '每个节点上{target}状态和执行情况',
    en: '{target} status and execution on each node',
    ja: '各ノードでの{target}の状態と実行状況',
  },
  noDatabasePlaceholder: {
    zh: '无可用的数据库供此类型网关选择',
    en: 'There are no databases available for this type of gateway to choose from',
    ja: 'このタイプのゲートウェイから選択するための利用可能なデータベースはありません',
  },
  pseudorandomFunction: {
    zh: '伪随机函数',
    en: 'Pseudorandom function',
    ja: '疑似乱数関数',
  },
  from: {
    zh: 'JWT 来自于',
    en: 'JWT From',
    ja: 'JWTのソース',
  },
  noMatch: {
    zh: '未匹配时执行',
    en: 'No Match Action',
    ja: '一致なしのアクション',
  },
  denyAction: {
    zh: '拒绝时执行',
    en: 'Deny Action',
    ja: '拒否時のアクション',
  },
  disableAuthnTip: {
    zh: '停用该认证器后，将影响客户端的安全连接，是否继续？',
    en: 'Disabling this authenticator will affect the security connection of the client, continue?',
    ja: 'この認証器を無効にすると、クライアントのセキュリティ接続に影響します。続行しますか？',
  },
  disableAuthzTip: {
    zh: '停用该授权后，将影响客户端发布/订阅时的权限操作，是否继续？',
    en: 'Disabling this authorization will affect the operation of permissions when the client publishes/subscribes. Continue?',
    ja: 'この認可を無効にすると、クライアントが公開/サブスクライブするときの権限操作に影響します。続行しますか？',
  },
  delAuthnConfirm: {
    zh: '删除该认证器后，可能导致非法客户端连接至当前服务器，{additionalTip}是否确认删除？',
    en: 'Deleting this authenticator may result in unauthorized clients connecting to the EMQX server, {additionalTip}continue? ',
    ja: 'この認証器を削除すると、許可されていないクライアントがEMQXサーバーに接続する可能性があります。{additionalTip}続行しますか？',
  },
  delAuthzConfirm: {
    zh: '删除该授权后，可能影响客户端发布和订阅操作的权限控制，{additionalTip}是否确认删除？',
    en: 'Deleting this authorization may affect the permission control of client publish and subscribe operations, {additionalTip}continue?',
    ja: 'この認可を削除すると、クライアントの公開および購読操作の権限制御に影響する可能性があります。{additionalTip}続行しますか？',
  },
  deleteBuiltInTip: {
    zh: '且已添加的数据将被删除，',
    en: 'and the added data will be deleted, ',
    ja: 'そして追加されたデータは削除されます、',
  },
  allUsers: {
    zh: '所有用户',
    en: 'All Users',
    ja: '全ユーザー',
  },
  permission: {
    zh: '权限',
    en: 'Permission',
    ja: 'アクセス許可',
  },
  permissions: {
    zh: '权限管理',
    en: 'Permissions',
    ja: 'アクセス許可管理',
  },
  action: {
    zh: '操作',
    en: 'Action',
    ja: 'アクション',
  },
  updateBuiltInTip: {
    zh: '更新密码加密方式或加盐方式将导致已添加的认证数据不可用，是否确认更新？',
    en: 'Updating the Password Hash or Salt Position will cause the added authentication data to be unavailable. Confirm to update?',
    ja: 'パスワードハッシュまたはソルト位置を更新すると、追加された認証データが使用できなくなります。更新を確認しますか？',
  },
  authn: {
    zh: '认证',
    en: 'authentication',
    ja: '認証',
  },
  authzCheck: {
    zh: '鉴权检查',
    en: 'authorizations',
    ja: '認可チェック',
  },
  allow: {
    zh: '允许',
    en: 'Allow',
    ja: '許可',
  },
  allowDesc: {
    zh: '{type}通过次数',
    en: 'Number of {type} passed',
    ja: '通過した{type}の数',
  },
  deny: {
    zh: '拒绝',
    en: 'Deny',
    ja: '拒否',
  },
  denyDesc: {
    zh: '{type}失败次数',
    en: 'Number of {type} failed',
    ja: '失敗した{type}の数',
  },
  noMatchAuthnDesc: {
    zh: '未查找到客户端认证数据次数',
    en: 'Number of times client authentication data not found',
    ja: 'クライアント認証データが見つからなかった回数',
  },
  noMatchAuthzDesc: {
    zh: '未查找到客户端权限数据次数',
    en: 'Number of times client authorizations data not found',
    ja: 'クライアントの認可データが見つからなかった回数',
  },
  publish: {
    zh: '发布时',
    en: 'Publish',
    ja: 'パブリッシュ',
  },
  subscribe: {
    zh: '订阅时',
    en: 'Subscribe',
    ja: 'サブスクライブ',
  },
  all: {
    zh: '发布和订阅时',
    en: 'Publish & Subscribe',
    ja: 'パブリッシュ&サブスクライブ',
  },
  jsonFormatError: {
    zh: '请输入正确的 JSON',
    en: 'Please enter the correct JSON',
    ja: '正しいJSONを入力してください',
  },
  httpHeaderTip: {
    zh: '配置中指定的 Body 必须被格式化为 JSON 对象。方法为 POST 的 HTTP 请求中的 Body 的最终表现形式取决于 `content-type` 头被设置为 `application/json` 还是 `application/x-www-form-urlencoded`。',
    en: 'Please note that the body specified in the configuration must be formatted as a JSON object. The final representation of the HTTP POST body depends on the `content-type` header being set to either `application/json` or `application/x-www-form-urlencoded`.',
    ja: '設定で指定されたボディは、JSONオブジェクトとしてフォーマットされる必要があります。HTTP POSTボディの最終的な表現は、`content-type`ヘッダーが`application/json`または`application/x-www-form-urlencoded`に設定されているかどうかによって異なります。',
  },
  replicaSetName: {
    zh: 'Replica Set 名称',
    en: 'Replica Set Name',
    ja: 'レプリカセット名',
  },
  collection: {
    zh: '集合',
    en: 'Collection',
    ja: 'コレクション',
  },
  priorityRangeError: {
    zh: '优先级数字必须在 1 到 255 之间。',
    en: 'Priority number must be a number between 1 and 255.',
    ja: '優先度の数字は1から255の間でなければなりません。',
  },
  query_timeout: {
    zh: '查询超时',
    en: 'Query Timeout',
  },
  base_dn: {
    zh: '基本 DN',
    en: 'Base DN',
  },
  password_attribute: {
    zh: '密码属性名',
    en: 'Password Hash Attribute',
  },
  password_attribute_desc: {
    zh: '存储客户端密码的 LDAP 属性名称',
    en: 'The LDAP attribute that stores the password hash for clients.',
  },
  is_superuser_attribute: {
    zh: '超级用户属性名',
    en: 'Is Superuser Attribute',
  },
  is_superuser_attribute_desc: {
    zh: '存储客户端超级用户角色的 LDAP 属性名称',
    en: "The LDAP attribute that indicates a client's superuser role.",
  },
}
