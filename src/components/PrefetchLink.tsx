import { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { prefetchRoute } from "../lib/prefetch";

interface PrefetchLinkProps extends Omit<LinkProps, "to"> {
  to: string;
}

const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ to, onMouseEnter, onFocus, children, ...rest }, ref) => (
    <Link
      ref={ref}
      to={to}
      onMouseEnter={(e) => {
        prefetchRoute(to);
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        prefetchRoute(to);
        onFocus?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  )
);

PrefetchLink.displayName = "PrefetchLink";

export default PrefetchLink;
