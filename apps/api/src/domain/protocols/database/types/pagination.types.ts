export type Pagination = {
  currentPage: number;
  perPage: number;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};
