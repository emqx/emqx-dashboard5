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
  Deny = "deny",
  Ignore = "ignore",
}

export enum ConnectionStatus {
  Connected = "connected",
  Disconnected = "disconnected",
  Connecting = "connecting",
}
