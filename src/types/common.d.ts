export type ListDataWithPagination<T> = {
  data: Array<T>;
  meta: {
    count: number;
    limit: number;
    page: number;
  };
};

export interface RuleInValidatorParam {
  field: string;
  fullField: string;
  type: string;
}
