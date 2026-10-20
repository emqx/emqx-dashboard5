export default {
  http: {
    zh: 'HTTP',
    en: 'HTTP',
  },
  https: {
    zh: 'HTTPS',
    en: 'HTTPS',
  },
  currentConnection: {
    zh: '当前连接',
    en: 'Current Connection',
  },
  editTip: {
    zh: '当前会话正通过此监听器连接，因此无法修改。请通过另一个监听器登录后，再修改此监听器的配置。',
    en: 'You cannot update this listener because the current session is connected to it. Login from the other listener to reconfigure this one.',
  },
  enable: {
    zh: '启用监听器',
    en: 'Enable Listener',
  },
  bind: {
    zh: '监听地址',
    en: 'Bind',
  },
  bindPlaceholder: {
    zh: '例如：18083 或 0.0.0.0:18083',
    en: 'For example: 18083 or 0.0.0.0:18083',
  },
  bindCannotBeZero: {
    zh: '启用监听器时，端口不能为 0。',
    en: 'The port cannot be 0 when the listener is enabled.',
  },
  certificateBundle: {
    zh: '证书 Bundle',
    en: 'Certificate Bundle',
  },
  certificateBundlePlaceholder: {
    zh: '请选择证书 Bundle',
    en: 'Select a certificate bundle',
  },
  acmePlugin: {
    zh: 'ACME 插件文档',
    en: 'ACME plugin documentation',
  },
  acmeTip: {
    zh: '如需自动申请和续期 HTTPS 证书，请参阅 {link}。',
    en: 'For automatic HTTPS certificate issuance and renewal, see the {link}.',
  },
  atLeastOneListener: {
    zh: 'HTTP 和 HTTPS 监听器不能同时关闭。',
    en: 'The HTTP and HTTPS listeners cannot both be disabled.',
  },
  fieldRequired: {
    zh: '启用监听器时必须配置{field}。',
    en: '{field} is required when the listener is enabled.',
  },
}
