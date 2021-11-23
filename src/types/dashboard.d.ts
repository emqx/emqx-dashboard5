export interface CounterItem {
  count: number;
  timestamp: number;
}

export type NodeStatisticalData = { node: string } & {
  [fieldName: string]: number;
};

export default {};
