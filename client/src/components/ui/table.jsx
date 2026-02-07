import { forwardRef } from "react";

import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

Table.propTypes = {
  className: PropTypes.string,
};

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

TableHeader.propTypes = {
  className: PropTypes.string,
};

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

TableBody.propTypes = {
  className: PropTypes.string,
};

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-neutral-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-neutral-800/50",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

TableFooter.propTypes = {
  className: PropTypes.string,
};

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:hover:bg-neutral-800/50 dark:data-[state=selected]:bg-neutral-800",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

TableRow.propTypes = {
  className: PropTypes.string,
};

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-neutral-500 [&:has([role=checkbox])]:pr-0 dark:text-neutral-400",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

TableHead.propTypes = {
  className: PropTypes.string,
};

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

TableCell.propTypes = {
  className: PropTypes.string,
};

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-neutral-500 dark:text-neutral-400",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

TableCaption.propTypes = {
  className: PropTypes.string,
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
