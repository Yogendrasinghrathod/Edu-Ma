import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};

export { Skeleton };
