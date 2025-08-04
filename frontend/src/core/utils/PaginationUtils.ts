import {PagedQuery, SearchableQuery} from "@/core/models";

/**
 * Utility class for pagination operations.
 */
export class PaginationUtils {
  private constructor() {}

  /**
   * Get object of default paged query with zero based page which starts from 0.
   * The default page index is 0 and the default page size is 10.
   */
  static getDefault(): PagedQuery {
    return {
      page: 0,
      pageSize: 10,
      zeroBased: true,
    };
  }

  /**
   * Get object of default paged query with non-zeor based page which starts from 1.
   * The default page index is 1 and the default page size is 10.
   */
  static getNonZeroDefault(): PagedQuery {
    return {
      page: 1,
      pageSize: 10,
      zeroBased: false,
    };
  }

  /**
   * Convert a paged query object to URL query parameters
   * @param query Paged query object
   * @param additionalParams Additional query parameters
   * @returns URL query parameters
   */
  static pagedQueryToParams(
    query: PagedQuery,
    additionalParams?: Record<string, string | undefined | null>
  ): string {
    const params = new URLSearchParams();
    const page = query.zeroBased ? query.page + 1 : query.page;
    params.append("page", page.toString());
    params.append("pageSize", query.pageSize.toString());

    if (query.orderBy) {
      params.append("orderBy", query.orderBy);
    }

    if (additionalParams) {
      for (const key in additionalParams) {
        if (additionalParams[key] != null) {
          params.append(key, additionalParams[key]);
        }
      }
    }

    return params.toString();
  }

  /**
   * Convert a searchable query object to URL query parameters
   * @param query Searchable query object
   * @param additionalParams Additional query parameters
   * @returns URL query parameters
   */
  static searchableQueryToParams(
    query: SearchableQuery,
    additionalParams?: Record<string, string | undefined | null>
  ): string {
    const params = new URLSearchParams(this.pagedQueryToParams(query, additionalParams));

    if (query.search) {
      params.append("search", query.search);
    }

    return params.toString();
  }
}
