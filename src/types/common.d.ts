export interface PageData {
  count: number;
  limit: number;
  page: number;
}

export type ListDataWithPagination<T> = {
  data: Array<T>;
  meta: PageData;
};

export interface RuleInValidatorParam {
  field: string;
  fullField: string;
  type: string;
}
