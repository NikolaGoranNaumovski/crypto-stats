import { Pagination } from 'src/types/common';

export class PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;

  static createFromModel<T>(
    data: T[],
    total: number,
    pagingParams: Pagination,
  ): PaginatedResult<T> {
    return {
      data,
      total,
      page: pagingParams.page,
      limit: pagingParams.limit,
    };
  }
}
