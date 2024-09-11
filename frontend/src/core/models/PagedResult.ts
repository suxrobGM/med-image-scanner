import {Result} from "./Result";

export interface PagedResult<T> extends Result<T[]> {
  pageIndex: number;
  pageSize: number;
  pagesCount: number;
}
