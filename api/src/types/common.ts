export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export interface Search {
  value?: string;
  properties: string[];
}