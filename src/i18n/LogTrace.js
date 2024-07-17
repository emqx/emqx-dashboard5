export default {
  name: {
    zh: '名称',
    en: 'Name',
  },
  type: {
    zh: '类型',
    en: 'Type',
  },
  condition: {
    zh: '条件',
    en: 'Condition',
  },
  startTime: {
    zh: '起始时间',
    en: 'Start Time',
  },
  endTime: {
    zh: '结束时间',
    en: 'End Time',
  },
  startEndTime: {
    zh: '起止时间',
    en: 'Start Time/End Time',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  logSize: {
    zh: '日志大小',
    en: 'Log Size',
  },
  view: {
    zh: '查看',
    en: 'View',
  },
  download: {
    zh: '下载',
    en: 'Download',
  },
  stop: {
    zh: '停止',
    en: 'Stop',
  },
  delete: {
    zh: '删除',
    en: 'Delete',
  },
  waiting: {
    zh: '等待中',
    en: 'Waiting',
  },
  running: {
    zh: '运行中',
    en: 'Running',
  },
  createLog: {
    zh: '创建 Trace',
    en: 'Create Trace',
  },
  viewLog: {
    zh: '查看 Trace',
    en: 'View Trace',
  },
  createSuc: {
    zh: '创建 Trace 成功',
    en: 'Create Log Trace Successfully',
  },
  stopSuc: {
    zh: '停止 Trace 成功',
    en: 'Stop Log Trace Successfully',
  },
  deleteSuc: {
    zh: '删除 Trace 成功',
    en: 'Delete Log Trace Successfully',
  },
  tooLargeLog: {
    zh: '日志过长，建议下载后查看',
    en: 'The Trace is too long, you better download to view',
  },
  confirmDeleteTrace: {
    zh: '确定删除该 Trace',
    en: 'Confirm to delete this Trace',
  },
  needStartTime: {
    zh: '请输入起始时间和结束时间',
    en: 'start time or end time is required',
  },
  loadNextPage: {
    zh: '正在加载更多',
    en: 'Loading More Log',
  },
  srunning: {
    zh: '运行中',
    en: 'Running',
  },
  sstopped: {
    zh: '已停止',
    en: 'Stopped',
  },
  swaiting: {
    zh: '等待中',
    en: 'Waiting',
  },
  logTraceDownloadTimeout: {
    zh: '下载追踪日志超时，追踪日志可至服务器的`data/trace`路径查找',
    en: 'The download of the trace log times out. The trace log can be found in the `data/trace` path of the server.',
  },
  defaultNodeTip: {
    zh: '已默认选中最新产生日志的节点，也可手动选择其他节点进行查看',
    en: 'The default selected node is the node which generated the log latest, or you can manually select another node to view the log',
  },
  payload: {
    zh: 'Payload 编码',
    en: 'Payload Encode',
  },
  payloadDesc: {
    zh: `确定跟踪文件中有效负载格式的格式。<br/>\`text\`：基于文本的协议或纯文本协议。建议在有效负载为JSON编码时使用<br/>\`hex\`：二进制十六进制编码。当有效负载是自定义二进制协议时，建议使用此选项<br/>\`hidden\`：有效负载被模糊化为 \`******\``,
    en: `Determine the format of the payload format in the trace file.<br/>\`text\`: Text-based protocol or plain text protocol.It is recommended when payload is JSON encoded.<br/>\`hex\`: Binary hexadecimal encode. It is recommended when payload is a custom binary protocol.<br/>\`hidden\`: payload is obfuscated as \`******\``,
  },
  formatter: {
    zh: '日志格式',
    en: 'Formatter',
  },
}
