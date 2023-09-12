export default {
  selector: {
    zh: '查询器',
    en: 'Selector',
    ja: 'セレクター',
  },
  CMD: {
    zh: '查询命令',
    en: 'CMD',
    ja: 'クエリコマンド',
  },
  clientTableExample: {
    zh: '客户端表结构参考：',
    en: 'The Client Table Example:',
    ja: 'クライアントテーブルの例',
  },
  supportedPlaceholders: {
    zh: '其中 {0} 语句支持的占位符有：',
    en: 'The {0} supports the following placeholders：',
    ja: '{0} は次のプレースホルダーをサポートしています：',
  },
  /* MySQL, PostgreSQL */
  authnSQLParagraph1: {
    zh: '当启用 加盐方式 后，SQL 语句需要从 {0} 中查询出 password_hash  salt 字段。',
    en: 'When the Salt Position is enabled, the SQL needs to query out the password_hash salt from {0}.',
    ja: 'ソルト位置が有効の場合、SQLは{0}からpassword_hash saltを取得する必要があります。',
  },
  /* MySQL, PostgreSQL, Redis */
  authnSQLParagraph2: {
    zh: '支持查询 is_superuser 字段来向客户端赋予超级权限。',
    en: 'Allows querying is_superuser field to grant superuser privileges to a client.',
    ja: '`is_superuser`フィールドをクエリして、クライアントにスーパーユーザー権限を付与できます。',
  },
  authnMongoDBParagraph1: {
    zh: '当启用 加盐方式 后，查询器需要从 MongoDB 中查询出 password_hash  salt 字段。',
    en: 'When the Salt Position is enabled, the Selector needs to query out the password_hash salt from MongoDB.',
    ja: 'ソルト位置が有効の場合、セレクタはMongoDBからpassword_hash saltを取得する必要があります。',
  },
  authnMongoDBParagraph2: {
    zh: '支持设置 `is_superuser` 字段 来向客户端赋予超级权限。',
    en: 'Allows setting `is_superuser` Field to grant superuser privileges to a client.',
    ja: '`is_superuser` フィールドを設定して、クライアントにスーパーユーザー権限を付与できます。',
  },
  authnRedisParagraph1: {
    zh: '当启用 加盐方式 后，查询命令需要从 Redis 中查询出 password_hash  salt 字段。',
    en: 'When the Salt Position is enabled, the CMD needs to query out the password_hash salt from Redis.',
    ja: 'ソルト位置が有効の場合、CMDはRedisからpassword_hash saltを取得する必要があります。',
  },
  dataStructuresAndCommandExamples: {
    zh: '示例数据和命令：',
    en: 'Data Structures and Command Examples:',
    ja: 'データ構造とコマンドの例',
  },
  authnHTTPParagraph1: {
    zh: 'HTTP 认证器将客户端信息传递给服务器，并通过 HTTP 返回值来判断是否具有权限',
    en: 'The HTTP authenticator passes the client information to the server and uses the HTTP response to determine if it has permission.',
    ja: 'HTTP認証器はクライアント情報をサーバーに渡し、HTTPの応答を使用して権限があるかどうかを判断します。',
  },
  authnHTTPParagraph2: {
    zh: '其中请求 Body 支持的占位符有：',
    en: 'The Request Body supports the following placeholders: ',
    ja: 'リクエストボディは次のプレースホルダーをサポートしています：',
  },
  authnHTTPParagraph3: {
    zh: 'HTTP 应答支持设置 is_superuser 字段来向客户端赋予超级权限。',
    en: 'The HTTP Response supports setting is_superuser field to grant superuser privileges to the client.',
    ja: 'HTTPの応答は、クライアントにスーパーユーザー権限を付与するための`is_superuser`フィールドの設定をサポートしています。',
  },
  /* Authz */
  theTableStructureExample: {
    zh: '表结构示例：',
    en: 'The Table Structure Example:',
    ja: 'テーブル構造の例',
  },
  authzSupportedPlaceholders: {
    zh: '{0} 语句支持的占位符有：',
    en: 'The {0} supports the following placeholders: ',
    ja: '{0} は次のプレースホルダーをサポートしています：',
  },
  /* MySQL, PgSQL */
  authzSQLParagraph1: {
    zh: 'SQL 语句需要从 {0} 中查询出包含 action permission topic 字段的数据列表',
    en: 'The SQL needs to query a list of data containing the action permission topic field from {0}',
    ja: 'SQLは{0}から`action permission topic`フィールドを含むデータのリストを照会する必要があります。',
  },
  authzMongoDBParagraph1: {
    zh: '查询器需要从 MongoDB 中查询出包含 action permission topics 字段的数据列表',
    en: 'The Selector needs to query a list of data from MongoDB that contains action permission  topics field',
    ja: 'セレクタは、`action permission topics`フィールドを含むMongoDBのデータリストを照会する必要があります。',
  },
  dataStructureExample: {
    zh: '数据结构示例：',
    en: 'Data Structure Example:',
    ja: 'データ構造の例',
  },
  authzRedisParagraph1: {
    zh: '查询命令需要从 Redis 中查询出键为TopicFilter 值为 Action 的权限表',
    en: 'The CMD needs to query the permission records from Redis with the key as TopicFilter and the value as Action',
    ja: 'CMDは、キーがTopicFilterで値がActionのRedisからの権限レコードを照会する必要があります。',
  },
  authzHTTPParagraph1: {
    zh: 'HTTP 授权器 将授权请求传递给服务器，并通过 HTTP 返回值来判断是否具有权限',
    en: 'HTTP Authorizer request to the server and uses the HTTP response to determine if it has permission to access',
    ja: 'HTTPオーソライザーはサーバーにリクエストを行い、HTTPの応答を使用してアクセスの権限があるかどうかを判断します。',
  },
}
