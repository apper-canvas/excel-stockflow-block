import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border-2 border-secondary-200 bg-white px-3 py-2 text-sm text-secondary-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;