"use client";

import {Pagination, PaginationItem} from "@mui/material";
import Link from "next/link";

interface LinkPaginationProps {
  href: string;
  pagesCount: number;
  page: number;
  urlSearchParams?: Record<string, string | number>;
}

/**
 * MUI Pagination component that uses the Link component from Next.js to navigate between pages.
 * @param props URL of the page, number of pages, current page number, and optional URL search parameters.
 */
export function LinkPagination(props: LinkPaginationProps) {
  const searchParams = new URLSearchParams();

  for (const key in props.urlSearchParams) {
    searchParams.append(key, props.urlSearchParams[key].toString());
  }

  searchParams.append("page", props.page.toString());

  return (
    <Pagination
      count={props.pagesCount}
      page={props.page}
      sx={{marginTop: "1rem"}}
      renderItem={(item) => (
        <Link href={`${props.href}?${searchParams.toString()}`}>
          <PaginationItem {...item} />
        </Link>
      )}
    />
  );
}
