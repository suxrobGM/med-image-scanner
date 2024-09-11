export interface PagedQuery {
  page: number;
  pageSize: number;
  orderBy?: string;
  zeroBased?: boolean;
}
