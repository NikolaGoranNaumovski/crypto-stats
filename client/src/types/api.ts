export interface BackendError {
  status: number;
  statusText: string;
}

export interface HookOptions<T> {
  skip?: boolean;
  manual?: boolean;
  urlRefetch?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: BackendError) => void;
}

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
