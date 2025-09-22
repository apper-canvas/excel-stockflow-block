import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border border-secondary-300",
    success: "bg-gradient-to-r from-success-50 to-success-100 text-success-800 border border-success-200",
    warning: "bg-gradient-to-r from-warning-50 to-warning-100 text-warning-800 border border-warning-200",
    error: "bg-gradient-to-r from-error-50 to-error-100 text-error-800 border border-error-200",
    info: "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 border border-primary-200"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;