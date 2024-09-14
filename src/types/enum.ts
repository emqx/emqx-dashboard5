export enum HashType {
  Plain = 'plain',
  MD4 = 'md4',
  MD5 = 'md5',
  Ripemd160 = 'ripemd160',
  SHA = 'sha',
  SHA224 = 'sha224',
  SHA256 = 'sha256',
  SHA384 = 'sha384',
  SHA512 = 'sha512',
  Pbkdf2 = 'pbkdf2',
  Bcrypt = 'bcrypt',
}

export enum PayloadShowByType {
  Plaintext = 'Plaintext',
  Base64 = 'Base64',
  JSON = 'JSON',
  Hex = 'Hex',
}

export enum PluginStatus {
  Running = 'running',
  Stopped = 'stopped',
}

export enum StatusCommandSendToPlugin {
  Start = 'start',
  Stop = 'stop',
}

export enum ExhookFailedAction {
  Deny = 'deny',
  Ignore = 'ignore',
}

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  // for cluster-aggregated, if nodes are at different statuses
  Inconsistent = 'inconsistent',
  // For Bridge, when the bridge resource is requested to be stopped
  Stopped = 'stopped',
}

// [ top, bottom, before, after ]
export enum TargetPosition {
  Top = 'front',
  Bottom = 'rear',
  Before = 'before:',
  After = 'after:',
}

export enum ExhookStatus {
  Connected = 'connected',
  Connecting = 'connecting',
  Disconnected = 'disconnected',
  Disabled = 'disabled',
  Error = 'error',
}

export enum RuleSQLKeyword {
  Select = 'select',
  From = 'from',
  Where = 'where',
  Foreach = 'foreach',
  Do = 'do',
  Incase = 'incase',
}

export const enum TestRuleTarget {
  SQL = 'sql',
  Rule = 'rule',
}

export enum FilterLogicalOperator {
  And = 'and',
  Or = 'or',
}

export enum RuleOutput {
  Console = 'console',
  Republish = 'republish',
  DataBridge = 'dataBridge',
}

export enum EventForRule {
  MessagePublish = '$events/message_publish',
  MessageDelivered = '$events/message_delivered',
  MessageAcked = '$events/message_acked',
  MessageDropped = '$events/message_dropped',
  ClientConnected = '$events/client_connected',
  ClientDisconnected = '$events/client_disconnected',
  ClientConnack = '$events/client_connack',
  ClientCheckAuthnComplete = '$events/client_check_authn_complete',
  ClientCheckAuthzComplete = '$events/client_check_authz_complete',
  SessionSubscribed = '$events/session_subscribed',
  SessionUnsubscribed = '$events/session_unsubscribed',
  DeliveryDropped = '$events/delivery_dropped',
}

export enum BridgeDirection {
  Ingress,
  Egress,
  Both,
}

export enum BridgeType {
  Webhook = 'http',
  MQTT = 'mqtt',
  InfluxDB = 'influxdb',
  MySQL = 'mysql',
  KafkaProducer = 'kafka_producer',
  KafkaConsumer = 'kafka_consumer',
  Redis = 'redis',
  GCPProducer = 'gcp_pubsub_producer',
  GCPConsumer = 'gcp_pubsub_consumer',
  MongoDB = 'mongodb',
  PgSQL = 'pgsql',
  TimescaleDB = 'timescale',
  MatrixDB = 'matrix',
  TDengine = 'tdengine',
  ClickHouse = 'clickhouse',
  DynamoDB = 'dynamo',
  Cassandra = 'cassandra',
  MicrosoftSQLServer = 'sqlserver',
  RocketMQ = 'rocketmq',
  IoTDB = 'iotdb',
  OpenTSDB = 'opents',
  OracleDatabase = 'oracle',
  RabbitMQ = 'rabbitmq',
  Pulsar = 'pulsar',
  HStream = 'hstreamdb',
  AzureEventHubs = 'azure_event_hub_producer',
  AmazonKinesis = 'kinesis',
  GreptimeDB = 'greptimedb',
  Confluent = 'confluent_producer',
  SysKeeperProxy = 'syskeeper_proxy',
  SysKeeperForwarder = 'syskeeper_forwarder',
  Elasticsearch = 'elasticsearch',
  S3 = 's3',
  AzureBlobStorage = 'azure_blob_storage',
  Couchbase = 'couchbase',
  Datalayers = 'datalayers',
  Snowflake = 'snowflake',
}

export enum PulsarType {
  Producer = 'pulsar_producer',
}

export enum ConnectorType {
  MQTT = 'mqtt',
}

export enum MQTTBridgeDirection {
  In = 'ingress',
  Out = 'egress',
}

export enum QoSLevel {
  QoS0,
  QoS1,
  QoS2,
}

export enum RuleInputType {
  Topic = 'topic',
  Bridge = 'bridge',
  Event = 'event',
}

export enum SchemaRegistryType {
  Avro = 'avro',
  Protobuf = 'protobuf',
  JSON = 'json',
}

export enum NodeStatusClass {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

export enum SlowSubType {
  Response = 'response',
  Internal = 'internal',
  Whole = 'whole',
}

export enum ChartType {
  Connections = 'connections',
  LiveConnections = 'live_connections',
  Dropped = 'dropped',
  Received = 'received',
  ReceivedBytes = 'received_bytes',
  Topics = 'topics',
  Sent = 'sent',
  SentBytes = 'sent_bytes',
  Subscriptions = 'subscriptions',
}

export enum MongoType {
  Single = 'single',
  Sharded = 'sharded',
  Rs = 'rs',
}

export enum RedisType {
  Single = 'single',
  Sentinel = 'sentinel',
  Cluster = 'cluster',
}

export enum NodeStatus {
  Running = 'running',
  Stopped = 'stopped',
}

export enum AuthnMechanismType {
  PasswordBased = 'password_based',
  JWT = 'jwt',
  SCRAM = 'scram',
  GSSAPI = 'gssapi',
}

export enum DatabasesType {
  BuiltInDatabase = 'built_in_database',
  MySQL = 'mysql',
  MongoDB = 'mongodb',
  PostgreSQL = 'postgresql',
  HTTPServer = 'http',
  Redis = 'redis',
  Ldap = 'ldap',
}

export enum GatewayName {
  CoAP = 'coap',
  ExProto = 'exproto',
  LwM2M = 'lwm2m',
  MQTT_SN = 'mqttsn',
  STOMP = 'stomp',
  GBT32960 = 'gbt32960',
  JT808 = 'jt808',
  OCPP = 'ocpp',
}

/**
 * For Listener
 */
export enum ListenerType {
  QUIC = 'quic',
  WSS = 'wss',
  WS = 'ws',
  SSL = 'ssl',
  TCP = 'tcp',
}

export enum ListenerTypeForGateway {
  TCP = 'tcp',
  UDP = 'udp',
  SSL = 'ssl',
  DTLS = 'dtls',
  WS = 'ws',
  WSS = 'wss',
}

export enum ListenerAction {
  Start = 'start',
  Stop = 'stop',
  Restart = 'restart',
}

export enum SaltPosition {
  Disable = 'disable',
  Prefix = 'prefix',
  Suffix = 'suffix',
}

export enum GatewayStatus {
  Running = 'running',
  Stopped = 'stopped',
  Unloaded = 'unloaded',
}

/**
 * For src/components/CheckIcon.vue
 */
export enum CheckStatus {
  Check = 'check',
  Close = 'close',
  Warning = 'warning',
  Disable = 'disable',
}

/**
 * there is another one type but without type field is 'oneof' type, this type with oneOf field
 */
export enum PropType {
  Array = 'array',
  Enum = 'enum',
  String = 'string',
  Boolean = 'boolean',
  Duration = 'duration',
  Number = 'number',
  IPPort = 'ip_port',
  ByteSize = 'byteSize',
  Object = 'object',
}

export enum TimeUnit {
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
}

export enum LicenseType {
  Trial = 'trial',
  Official = 'official',
}

export enum BuiltInDBType {
  Client = 'clients',
  User = 'users',
  All = 'all',
}

export enum BannedType {
  Client = 'clientid',
  ClientReg = 'clientid_re',
  User = 'username',
  UserReg = 'username_re',
  Address = 'peerhost',
  AddressRange = 'peerhost_net',
}

export enum LogTraceType {
  ClientID = 'clientid',
  Topic = 'topic',
  IPAddress = 'ip_address',
  RuleID = 'ruleid',
}

export enum LogTraceFormatter {
  JSON = 'json',
  Text = 'text',
}

export const enum TraceEncodeType {
  Text = 'text',
  HEX = 'hex',
  Hidden = 'hidden',
}

export const enum LDAPAuthMethod {
  Bind = 'bind',
  Hash = 'hash',
}

/* EE exclusive 👇🏻 */

export enum LicenseCustomerType {
  Small = 0,
  Medium,
  Large,
  Evaluation = 10,
}

export enum Role {
  Producer = 'producer',
  Consumer = 'consumer',
}

export const enum UserRole {
  Admin = 'administrator',
  Readonly = 'viewer',
  Publisher = 'publisher',
}

export const enum DetailTab {
  Overview,
  Setting,
}

export enum BatchSettingDatabaseType {
  InfluxDB = 'influxdb',
  IoTDB = 'iotdb',
  TDengine = 'tdengine',
  Datalayers = 'datalayers',
}

export const enum LogResult {
  OK,
  NoResult,
  Pending,
  Error,
}
