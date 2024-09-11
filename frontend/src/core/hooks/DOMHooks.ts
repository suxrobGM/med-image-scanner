/**
 * Hook functions for DOM manipulation.
 */
"use client";
import {RefObject, useEffect, useRef} from "react";

/**
 * Hook to scroll to the bottom of a container when the user reaches the bottom.
 * This hook is useful for terms and conditions, chat, and other components that require scrolling to the bottom.
 * ```
 * const contentRef = useScrollToBottom(() => console.log("Scrolled to the bottom"));
 * 
 * return (
 *  <div ref={contentRef} style={{overflowY: "scroll", maxHeight: "500px"}}>
 *   {children}
 *  </Stack>
 * );
 * ```
 * @param onScrollBottom Callback function to execute when the user reaches the bottom of the container
 * @returns Reference to the container element
 */
export function useScrollToBottom(onScrollBottom: () => void): RefObject<HTMLDivElement> {
  // Reference to the attached container element
  const contentRef = useRef<HTMLDivElement>(null);

  // Timeout to prevent multiple calls to onScrollBottom when the user reaches the bottom and avoids re-rendering the component
  const debounceTimeout = useRef<number | null>(null); 

  const handleScroll = () => {
    if (!contentRef.current) {
      return;
    }

    const {scrollTop, scrollHeight, clientHeight} = contentRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = window.setTimeout(() => onScrollBottom(), 200);
    }
  };

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    contentRef.current.addEventListener("scroll", handleScroll);

    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [handleScroll]);

  return contentRef;
}
