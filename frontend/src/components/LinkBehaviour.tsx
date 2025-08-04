import {ForwardedRef, forwardRef} from "react";
import Link, {LinkProps} from "next/link";

/**
 * Wrapper for Next.js Link component to forward ref.
 * Used to override the default Link component in MUI components.
 */
export const LinkBehaviour = forwardRef(
  (props: LinkProps, ref: ForwardedRef<HTMLAnchorElement | null>) => {
    return <Link ref={ref} {...props} />;
  }
);
