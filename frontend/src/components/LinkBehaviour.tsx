import Link, {LinkProps} from "next/link";
import {ForwardedRef, forwardRef} from "react";

/**
 * Wrapper for Next.js Link component to forward ref.
 * Used to override the default Link component in MUI components.
 */
export const LinkBehaviour = forwardRef((props: LinkProps, ref: ForwardedRef<HTMLAnchorElement | null>) => {
  return <Link ref={ref} {...props} />;
});
