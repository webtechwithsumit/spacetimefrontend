export const ITEMS_PER_PAGE = 10;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message?: string;
  data?: T[];
  pagination?: PaginationMeta;
};

export const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  total: 0,
  totalPages: 1,
};

export function buildPaginationParams(page: number, limit = ITEMS_PER_PAGE) {
  return { page, limit };
}
