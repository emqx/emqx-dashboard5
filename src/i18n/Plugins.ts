export default {
  searchPlaceholder: {
    zh: '搜索已安装的插件',
    en: 'Search for installed plugins',
  },
  active: {
    zh: '运行中',
    en: 'Active',
  },
  inactive: {
    zh: '已停止',
    en: 'Inactive',
  },
  notInstalled: {
    zh: '未安装',
    en: 'Not installed',
  },
  name: {
    zh: '名称',
    en: 'Name',
  },
  author: {
    zh: '作者',
    en: 'Author',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  stop: {
    zh: '停止',
    en: 'Stop',
  },
  start: {
    zh: '启动',
    en: 'Start',
  },
  install: {
    zh: '安装',
    en: 'Install',
  },
  more: {
    zh: '了解更多',
    en: 'Read More',
  },
  version: {
    zh: '版本',
    en: 'Version',
  },
  recentlySubmitted: {
    zh: '最近提交',
    en: 'Recently submitted',
  },
  compiledUser: {
    zh: '编译用户',
    en: 'Compiled user',
  },
  pluginDesc: {
    zh: '插件描述',
    en: 'Description',
  },
  dragFilePlaceholder: {
    zh: '选择或拖拽 .tar.gz 格式的插件安装包到此处',
    en: 'Select or drag the .tar.gz plugin installation package here',
  },
  selectFile: {
    zh: '选择文件',
    en: 'Select file',
  },
  uploadFile: {
    zh: '上传文件',
    en: 'Upload file',
  },
  basicInformation: {
    zh: '基本信息',
    en: 'Basic Information',
  },
  uninstall: {
    zh: '卸载',
    en: 'Uninstall',
  },
  uploadWarning: {
    zh: '请先上传文件',
    en: 'Please upload the file first',
  },
  moveToTop: {
    zh: '移到顶部',
    en: 'Move to top',
  },
  moveToBottom: {
    zh: '移到底部',
    en: 'Move to bottom',
  },
  successfulInstallation: {
    zh: '安装成功',
    en: 'Successful installation',
  },
  pluginUninstallConfirm: {
    zh: '是否确认卸载插件 {name}',
    en: 'Are you sure to uninstall plugin {name}?',
  },
  uninstalledSuccessfully: {
    zh: '卸载成功',
    en: 'Uninstalled successfully',
  },
  managePlugin: {
    zh: '管理插件',
    en: 'Manage plugin',
  },
  infoPlugin: {
    zh: '插件信息',
    en: 'Plugin information',
  },
  noPluginConfig: {
    zh: '此插件不支持在 Dashboard 中进行配置。',
    en: 'This plugin does not support configuration via the Dashboard.',
  },
  pluginInstallGuidance: {
    zh: `为确保系统安全，EMQX 不允许直接通过 Dashboard 安装插件。点击“安装”按钮前，需先使用命令 \`emqx ctl plugins allow {'{'}NAME{'}'}-{'{'}VSN{'}'}\` 授权插件安装，命令行执行后对集群内所有节点生效。授权 5 分钟内有效，过期后需重新授权。<br /><br />为更高的安全性，可在命令末尾追加 \`sha256:{'{'}HEX{'}'}\` 将授权绑定到具体的安装包内容（64 位小写十六进制摘要）。<br /><br />您也可以通过其他方法将插件包上传到 EMQX 服务器的 plugins/ 目录，并解压安装包进行安装。`,
    en: `To ensure system security, EMQX does not allow direct installation of plugins through the Dashboard. Before clicking the "Install" button, you need to use the command \`emqx ctl plugins allow {'{'}NAME{'}'}-{'{'}VSN{'}'}\` to allow plugin installation. The grant is valid for 5 minutes, after which you need to authorize again.<br /><br />For stronger guarantees you may append \`sha256:{'{'}HEX{'}'}\` (a 64-character lowercase hex digest) to bind the grant to a specific package payload.<br /><br />You can also upload the plugin package to the plugins/ directory on the EMQX server and extract the package for installation.`,
  },
  pluginInstallCommand: {
    zh: '授权插件安装命令',
    en: 'Authorization command for plugin installation',
  },
  pleaseUploadPluginFirst: {
    zh: '请先上传插件包',
    en: 'Please upload the plugin package first',
  },
  pluginInstallForbidden: {
    zh: '插件包不允许安装; 请先运行命令: <code>{code}</code>',
    en: 'Package is not allowed installation; first allow it to be installed by running: <code>{code}</code>',
  },
  inConsistent: {
    zh: '集群中各节点版本不一致',
    en: 'Inconsistent for nodes in the cluster',
  },
  syncToNodes: {
    zh: '同步至各节点',
    en: 'Sync to Nodes',
  },
  confirmSyncPluginVersion: {
    zh: '是否确认将版本 {currentVersion} 的插件 {name} 同步至以下节点',
    en: 'Are you sure to sync version {currentVersion} of the plugin {name} to the following nodes?',
  },
  currentVersion: {
    zh: '当前版本',
    en: 'Current Version',
  },
  syncSuccess: {
    zh: '同步成功',
    en: 'Synchronized Successfully',
  },
  restartPluginTip: {
    zh: '为保证同步后插件正常运行，请在同步后重新启动插件',
    en: 'To ensure the plugin runs normally after synchronization, please restart the plugin after synchronization.',
  },
  healthStatus: {
    zh: '健康状态',
    en: 'Health Status',
  },
  ok: {
    zh: '良好',
    en: 'OK',
  },
  error: {
    zh: '异常',
    en: 'Error',
  },
  downloadConfig: {
    zh: '下载配置',
    en: 'Download Config',
  },
  uploadConfig: {
    zh: '上传配置',
    en: 'Upload Config',
  },
  uploadConfigConfirm: {
    zh: '上传配置将覆盖当前配置，是否确认上传？',
    en: 'Uploading the configuration will overwrite the current configuration. Confirm to upload?',
  },
  pluginUI: {
    zh: '插件界面',
    en: 'Plugin UI',
  },
}
