export const QoS_LIST = [0, 1, 2];

export const SSL_VERIFY_VALUE_MAP = new Map([
  [false, "verify_none"],
  [true, "verify_peer"],
]);

export const DEFAULT_SSL_VERIFY_VALUE = SSL_VERIFY_VALUE_MAP.get(false);
