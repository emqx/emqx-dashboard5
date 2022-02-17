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

export enum BridgeStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

// [ top, bottom, before, after ]
export enum ExhookPosition {
  Top = 'top',
  Bottom = 'bottom',
  Before = 'before',
  After = 'after',
}

export enum ExhookStatus {
  Running = 'running',
  Waiting = 'waiting',
  Stopped = 'stopped',
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

export enum MQTTBridgeDirection {
  In = 'ingress',
  Out = 'egress',
}
