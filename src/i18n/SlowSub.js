export default {
  slowSubPlaceholder: {
    zh: '还没有启用慢订阅统计，请先开启！',
    en: 'Slow subscription statistics have not been enabled, please enable it first!',
  },
  enable: {
    zh: '开启',
    en: 'Enable',
  },
  statsThreshold: {
    zh: '时延阈值',
    en: 'Stats Threshold',
  },
  statsThresholdDesc: {
    zh: '进行统计的时延阈值,最低值为100ms',
    en: 'The latency threshold for statistics, the minimum value is 100ms',
  },
  maximumNumberOfStatistics: {
    zh: '最大统计条数',
    en: 'Maximum Number of Statistics',
  },
  maximumNumberOfStatisticsDesc: {
    zh: '慢订阅统计记录表的最大记录数',
    en: 'The maximum number of records in the slow subscription statistics record table',
  },
  evictionTimeOfRecord: {
    zh: '有效时长',
    en: 'Eviction Time of Record',
  },
  evictionTimeOfRecordDesc: {
    zh: '记录产生后，有效时长内没有再次触发将被移出统计列表。单位(ms:毫秒，s: 秒)',
    en: 'The eviction time of the record which in the statistics record table',
  },
  noticeInterval: {
    zh: '推送间隔',
    en: 'Notice Interval',
  },
  noticeIntervalDesc: {
    zh: '向系统主题推送统计表记录的间隔，设置为 0 时关闭推送。单位(ms:毫秒，s: 秒)',
    en: 'The interval for pushing statistics table records to the system topic. When set to 0, push is disabled',
  },
  noticeQoS: {
    zh: '推送 QoS',
    en: 'Notice QoS',
  },
  noticeBatchSize: {
    zh: '推送批量数',
    en: 'Notice Batch Size',
  },
  noticeBatchSizeDesc: {
    zh: '单次批量推送可以发送的记录条数',
    en: 'The number of records that can be sent in a single batch push',
  },
  enableLabel: {
    zh: '启用以开始统计消息耗时和消息堆积',
    en: 'Enable to start counting message time-consuming and message accumulation',
  },
  clearData: {
    zh: '清空数据',
    en: 'Clear data',
  },
  confirmClearData: {
    zh: '清除当前所有数据并重新统计慢订阅',
    en: 'Clear current data and re-count slow subscription',
  },
  messageBacklog: {
    zh: '消息堆积',
    en: 'Message backlog',
  },
  messageBacklogDesc: {
    zh: '消息一直处于超时情况下的超时时间',
    en: 'Message backlog timeout',
  },
  timeConsuming: {
    zh: '耗时较高',
    en: 'Time consuming',
  },
  highAverageTime: {
    zh: '平均耗时较高',
    en: 'High average time',
  },
  highAverageTimeDesc: {
    zh: '消息传递平均时间超过预设阈值',
    en: 'The average message delivery time exceeds the setting',
  },
  backToStatisticsList: {
    zh: '返回至统计列表',
    en: 'Back to statistics list',
  },
  basicSettings: {
    zh: '基础设置',
    en: 'Basic Settings',
  },
  slowSubscriptionSettings: {
    zh: '慢订阅设置',
    en: 'Slow subscription settings',
  },
  latencyTime: {
    zh: '时延/堆积时长',
    en: 'Latency / Backlog Time',
  },
  updated: {
    zh: '更新时间',
    en: 'Updated',
  },
  statsType: {
    zh: '时延统计类型',
    en: 'Stats Type',
  },
  topic: {
    zh: '主题',
    en: 'Topic',
  },
  duration: {
    zh: '时长',
    en: 'Duration',
  },
  typeResponseDesc: {
    zh: '客户端响应耗时',
    en: 'Client response time',
  },
  typeInternalDesc: {
    zh: 'EMQX 内部中转时间',
    en: 'EMQX internal transfer time',
  },
  wholeTypeDesc: {
    zh: '传输完成的全流程时间',
    en: 'The total time the delivery was completed',
  },
}
