export interface GetObjectQuery {
  limit?: number;
  query?: string;
  page: number;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  currentPage: number;
  pageCount: number;
}
