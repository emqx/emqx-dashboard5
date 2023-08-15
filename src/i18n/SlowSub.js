export default {
  slowSubPlaceholder: {
    zh: '还没有启用慢订阅统计，请先开启！',
    en: 'Slow subscription statistics have not been enabled, please enable it first!',
    ja: '遅延サブスクリプションの統計は有効になっていません。まず有効にしてください。',
  },
  enable: {
    zh: '开启',
    en: 'Enable',
    ja: '有効化',
  },
  statsThreshold: {
    zh: '时延阈值',
    en: 'Stats Threshold',
    ja: '遅延のしきい値',
  },
  statsThresholdDesc: {
    zh: '进行统计的时延阈值,最低值为100ms',
    en: 'The latency threshold for statistics, the minimum value is 100ms',
    ja: '統計を行う遅延のしきい値。最小値は100ms',
  },
  maximumNumberOfStatistics: {
    zh: '最大统计条数',
    en: 'Maximum Number of Statistics',
    ja: '統計の最大数',
  },
  maximumNumberOfStatisticsDesc: {
    zh: '慢订阅统计记录表的最大记录数',
    en: 'The maximum number of records in the slow subscription statistics record table',
    ja: '遅延サブスクリプション統計の記録テーブルの最大レコード数',
  },
  evictionTimeOfRecord: {
    zh: '有效时长',
    en: 'Eviction Time of Record',
    ja: '記録の有効期間',
  },
  evictionTimeOfRecordDesc: {
    zh: '记录产生后，有效时长内没有再次触发将被移出统计列表。单位(ms:毫秒，s: 秒)',
    en: 'The eviction time of the record which in the statistics record table',
    ja: '統計記録テーブル内の記録の削除までの期間。単位は(ms: ミリ秒, s: 秒)',
  },
  enableLabel: {
    zh: '启用以开始统计消息耗时和消息堆积',
    en: 'Enable to start counting message time-consuming and message accumulation',
    ja: 'メッセージの時間消費とメッセージの蓄積の計測を開始するために有効化',
  },
  clearData: {
    zh: '清空数据',
    en: 'Clear data',
    ja: 'データのクリア',
  },
  confirmClearData: {
    zh: '清除当前所有数据并重新统计慢订阅',
    en: 'Clear current data and re-count slow subscription',
    ja: '現在のデータをクリアして遅延サブスクリプションを再計測',
  },
  basicSettings: {
    zh: '基础设置',
    en: 'General Settings',
    ja: '基本設定',
  },
  slowSubscriptionSettings: {
    zh: '慢订阅设置',
    en: 'Slow subscription settings',
    ja: '遅延サブスクリプション設定',
  },
  updated: {
    zh: '更新时间',
    en: 'Updated',
    ja: '更新時間',
  },
  statsType: {
    zh: '时延统计类型',
    en: 'Stats Type',
    ja: '遅延統計のタイプ',
  },
  topic: {
    zh: '主题',
    en: 'Topic',
    ja: 'トピック',
  },
  duration: {
    zh: '时长',
    en: 'Duration',
    ja: '時間',
  },
  typeResponseDesc: {
    zh: '客户端响应耗时',
    en: 'Client response time',
    ja: 'クライアント応答時間',
  },
  typeInternalDesc: {
    zh: 'EMQX 内部中转时间',
    en: 'EMQX internal transfer time',
    ja: 'EMQX内部転送時間',
  },
  wholeTypeDesc: {
    zh: '传输完成的全流程时间',
    en: 'The total time the delivery was completed',
    ja: '配信完了までの全体時間',
  },
}
