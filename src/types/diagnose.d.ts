export interface SlowSubConfig {
  enable: boolean;
  expire_interval: string;
  notice_batch_size: number;
  notice_qos: number;
  threshold: string;
  top_k_num: number;
  notice_interval: string;
}

export interface SlowSubStatistic {
  clientid: string;
  latency: number;
  type: "average" | "expire";
  last_update_time: string;
}

export type TraceRecord = {
  name: string;
};

export type TraceFormRecord = {
  name: string;
  type: "clientid" | "topic" | "ip_address";
  topic: string;
  clientid: string;
  ip_address: string;
  startTime: [string, string] | [Date, Date];
};
