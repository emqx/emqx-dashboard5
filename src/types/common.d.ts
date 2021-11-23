export type ListDataWithPagination<T> = {
  data: Array<T>;
  meta: {
    count: number;
    limit: number;
    page: number;
  };
};
