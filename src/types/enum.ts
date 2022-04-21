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
  Unconnected = 'unconnected',
  Disable = 'disable',
  Error = 'error',
}

export enum RuleOutput {
  Console = 'console',
  Republish = 'republish',
}

export enum BridgeType {
  HTTP = 'http',
  MQTT = 'mqtt',
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
  Running = 'Running',
  Stopped = 'Stopped',
}

export enum AuthnMechanismType {
  PasswordBased = 'password_based',
  JWT = 'jwt',
  Scram = 'scram',
}

export enum DatabasesType {
  BuiltInDatabase = 'built_in_database',
  MySQL = 'mysql',
  MongoDB = 'mongodb',
  PostgreSQL = 'postgresql',
  HTTPServer = 'http',
  Redis = 'redis',
}

export enum GatewayName {
  CoAP = 'coap',
  ExProto = 'exproto',
  LwM2M = 'lwm2m',
  MQTT_SN = 'mqttsn',
  STOMP = 'stomp',
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
