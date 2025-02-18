export default {
  selector: {
    zh: '查询器',
    en: 'Selector',
  },
  CMD: {
    zh: '查询命令',
    en: 'CMD',
  },
  clientTableExample: {
    zh: '客户端表结构参考：',
    en: 'The Client Table Example:',
  },
  supportedPlaceholders: {
    zh: '其中 {0} 语句支持的占位符有：',
    en: 'The {0} supports the following placeholders：',
  },
  /* MySQL, PostgreSQL */
  authnSQLParagraph1: {
    zh: '当启用 加盐方式 后，SQL 语句需要从 {0} 中查询出 password_hash  salt 字段。',
    en: 'When the Salt Position is enabled, the SQL needs to query out the password_hash salt from {0}.',
  },
  /* MySQL, PostgreSQL, Redis */
  authnSQLParagraph2: {
    zh: '支持查询 is_superuser 字段来向客户端赋予超级权限。',
    en: 'Allows querying is_superuser field to grant superuser privileges to a client.',
  },
  authnMongoDBParagraph1: {
    zh: '当启用 加盐方式 后，查询器需要从 MongoDB 中查询出 password_hash  salt 字段。',
    en: 'When the Salt Position is enabled, the Selector needs to query out the password_hash salt from MongoDB.',
  },
  authnMongoDBParagraph2: {
    zh: '支持设置 `is_superuser` 字段 来向客户端赋予超级权限。',
    en: 'Allows setting `is_superuser` Field to grant superuser privileges to a client.',
  },
  authnRedisParagraph1: {
    zh: '当启用 加盐方式 后，查询命令需要从 Redis 中查询出 password_hash  salt 字段。',
    en: 'When the Salt Position is enabled, the CMD needs to query out the password_hash salt from Redis.',
  },
  dataStructuresAndCommandExamples: {
    zh: '示例数据和命令：',
    en: 'Data Structures and Command Examples:',
  },
  authnHTTPParagraph1: {
    zh: 'HTTP 认证器将客户端信息传递给服务器，并通过 HTTP 返回值来判断是否具有权限',
    en: 'The HTTP authenticator passes the client information to the server and uses the HTTP response to determine if it has permission.',
  },
  authnHTTPParagraph2: {
    zh: '其中请求 Body 支持的占位符有：',
    en: 'The Request Body supports the following placeholders: ',
  },
  authnHTTPParagraph3: {
    zh: 'HTTP 应答支持设置 is_superuser 字段来向客户端赋予超级权限。',
    en: 'The HTTP Response supports setting is_superuser field to grant superuser privileges to the client.',
  },
  /* Authz */
  theTableStructureExample: {
    zh: '表结构示例：',
    en: 'The Table Structure Example:',
  },
  authzSupportedPlaceholders: {
    zh: '{0} 语句支持的占位符有：',
    en: 'The {0} supports the following placeholders: ',
  },
  authzMongoDBOrderTip: {
    zh: '查询器语句支持在第一层级中使用 $orderby 指定排序字段和排序顺序，对查询结果进行排序，排序字段支持嵌套',
    en: 'The selector statement supports using the $orderby operator in the first level to specify sorting fields and order, sorting the query results. Nested fields are supported in sorting.',
  },
  /* MySQL, PgSQL */
  authzSQLParagraph1: {
    zh: 'SQL 语句需要从 {0} 中查询出包含 action permission topic 字段的数据列表',
    en: 'The SQL needs to query a list of data containing the action permission topic field from {0}',
  },
  authzMongoDBParagraph1: {
    zh: '查询器需要从 MongoDB 中查询出包含 action permission topics 字段的数据列表',
    en: 'The Selector needs to query a list of data from MongoDB that contains action permission  topics field',
  },
  dataStructureExample: {
    zh: '数据结构示例：',
    en: 'Data Structure Example:',
  },
  authzRedisParagraph1: {
    zh: '查询命令需要从 Redis 中查询出键为TopicFilter 值为 Action 的权限表',
    en: 'The CMD needs to query the permission records from Redis with the key as TopicFilter and the value as Action',
  },
  authzHTTPParagraph1: {
    zh: 'HTTP 授权器 将授权请求传递给服务器，并通过 HTTP 返回值来判断是否具有权限',
    en: 'HTTP Authorizer request to the server and uses the HTTP response to determine if it has permission to access',
  },
}
