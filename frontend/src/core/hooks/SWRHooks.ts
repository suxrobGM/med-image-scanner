/**
 * Hook functions for SWR data fetching.
 */
"use client";

//@ts-ignore
import {Session} from "next-auth";

//@ts-ignore
import {useSession} from "next-auth/react";
import useSWR, {SWRResponse} from "swr";
import {PagedQuery} from "@/core/models";

interface SWRPaginationResponse<T> extends SWRResponse<T, any, any> {
  key: string;
}

/**
 * Hook to use SWR with session
 * @param key Key for the SWR cache
 * @param fetcher Fetcher function
 * @returns SWR response
 */
export function useSWRWithSession<T>(key: string, fetcher: (session: Session) => Promise<T>): SWRResponse<T, any, any> {
  const {data: session} = useSession();
  return useSWR<T>(session ? key : null, () => fetcher(session!));
}

/**
 * Hook to use SWR with pagination
 * @param key Partial key for the SWR cache, the full key will be generated based on the page model.
 * The key format should be like: `{key}?page={page}&pageSize={pageSize}&orderBy={orderBy}`
 * @param pageModel Paged query model
 * @param fetcher Fetcher function
 * @returns SWR response with full key
 */
export function useSWRPagination<T>(
  key: string,
  pageModel: PagedQuery,
  fetcher: (pageModel: PagedQuery) => Promise<T>
): SWRPaginationResponse<T> {
  const fullKey = `${key}?page=${pageModel.page}&pageSize=${pageModel.pageSize}&orderBy=${pageModel.orderBy}`;
  const swrResponse = useSWR<T>(fullKey, () =>fetcher(pageModel));
  return {...swrResponse, key: fullKey};
}
