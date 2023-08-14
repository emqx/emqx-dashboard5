export default {
  name: {
    zh: '名称',
    en: 'Name',
    ja: '名称',
  },
  type: {
    zh: '类型',
    en: 'Type',
    ja: 'タイプ',
  },
  condition: {
    zh: '条件',
    en: 'Condition',
    ja: '条件',
  },
  startTime: {
    zh: '起始时间',
    en: 'Start Time',
    ja: '開始時刻',
  },
  endTime: {
    zh: '结束时间',
    en: 'End Time',
    ja: '終了時刻',
  },
  startEndTime: {
    zh: '起止时间',
    en: 'Start Time/End Time',
    ja: '開始時刻/終了時刻',
  },
  status: {
    zh: '状态',
    en: 'Status',
    ja: 'ステータス',
  },
  logSize: {
    zh: '日志大小',
    en: 'Log Size',
    ja: 'ログサイズ',
  },
  view: {
    zh: '查看',
    en: 'View',
    ja: '表示',
  },
  download: {
    zh: '下载',
    en: 'Download',
    ja: 'ダウンロード',
  },
  stop: {
    zh: '停止',
    en: 'Stop',
    ja: '停止',
  },
  delete: {
    zh: '删除',
    en: 'Delete',
    ja: '削除',
  },
  waiting: {
    zh: '等待中',
    en: 'Waiting',
    ja: '待機中',
  },
  running: {
    zh: '运行中',
    en: 'Running',
    ja: '実行中',
  },
  createLog: {
    zh: '创建 Trace',
    en: 'Create Trace',
    ja: 'トレースの作成',
  },
  viewLog: {
    zh: '查看 Trace',
    en: 'View Trace',
    ja: 'トレースの表示',
  },
  createSuc: {
    zh: '创建 Trace 成功',
    en: 'Create Log Trace Successfully',
    ja: 'トレースの作成に成功',
  },
  stopSuc: {
    zh: '停止 Trace 成功',
    en: 'Stop Log Trace Successfully',
    ja: 'トレースの停止に成功',
  },
  deleteSuc: {
    zh: '删除 Trace 成功',
    en: 'Delete Log Trace Successfully',
    ja: 'トレースの削除に成功',
  },
  tooLargeLog: {
    zh: '日志过长，建议下载后查看',
    en: 'The Trace is too long, you better download to view',
    ja: 'ログが大きすぎます。ダウンロードして確認することをおすすめします',
  },
  confirmDeleteTrace: {
    zh: '确定删除该 Trace',
    en: 'Confirm to delete this Trace',
    ja: 'このトレースを削除してよろしいですか?',
  },
  needStartTime: {
    zh: '请输入起始时间和结束时间',
    en: 'start time or end time is required',
    ja: '開始時刻か終了時刻は必須です',
  },
  loadNextPage: {
    zh: '正在加载更多',
    en: 'Loading More Log',
    ja: 'もっとログを読み込み中',
  },
  srunning: {
    zh: '运行中',
    en: 'Running',
    ja: '実行中',
  },
  sstopped: {
    zh: '已停止',
    en: 'Stopped',
    ja: '停止済み',
  },
  swaiting: {
    zh: '等待中',
    en: 'Waiting',
    ja: '待機中',
  },
  allNodes: {
    zh: '所有节点',
    en: 'All nodes',
    ja: 'すべてのノード',
  },
  logTraceDownloadTimeout: {
    zh: '下载追踪日志超时，追踪日志可至服务器的`data/trace`路径查找',
    en: 'The download of the trace log times out. The trace log can be found in the `data/trace` path of the server.',
    ja: 'トレースログのダウンロードがタイムアウトしました。トレースログはサーバーの`data/trace`パスにあります。',
  },
  defaultNodeTip: {
    zh: '已默认选中最新产生日志的节点，也可手动选择其他节点进行查看',
    en: 'The default selected node is the node which generated the log latest, or you can manually select another node to view the log',
    ja: 'デフォルトで選択されているノードは最新のログを生成したノードです。手動で別のノードを選択してログを表示することもできます。',
  },
  payload: {
    zh: '有效负载编码',
    en: 'Payload encode',
    ja: 'ペイロードのエンコード',
  },
  payloadDesc: {
    zh: `确定跟踪文件中有效负载格式的格式。<br/>\`text\`：基于文本的协议或纯文本协议。建议在有效负载为JSON编码时使用<br/>\`hex\`：二进制十六进制编码。当有效负载是自定义二进制协议时，建议使用此选项<br/>\`hidden\`：有效负载被模糊化为 \`******\``,
    en: `Determine the format of the payload format in the trace file.<br/>\`text\`: Text-based protocol or plain text protocol.It is recommended when payload is JSON encoded.<br/>\`hex\`: Binary hexadecimal encode. It is recommended when payload is a custom binary protocol.<br/>\`hidden\`: payload is obfuscated as \`******\``,
    ja: 'トレースファイルのペイロード形式を選択してください。<br/>- `text`: テキスト形式。JSONエンコードされたペイロードに適しています。<br/>- `hex`: 16進数のバイナリ形式。カスタムバイナリプロトコルのペイロードに適しています。<br/>- `hidden`: ペイロードは`******`として表示されます。',
  },
}
