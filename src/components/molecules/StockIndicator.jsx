import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const StockIndicator = ({ stock, threshold = 10, className, showLabel = true }) => {
  const getStockStatus = () => {
    if (stock === 0) return { variant: "error", label: "Out of Stock", color: "bg-error-500" };
    if (stock <= threshold) return { variant: "warning", label: "Low Stock", color: "bg-warning-500" };
    return { variant: "success", label: "In Stock", color: "bg-success-500" };
  };

  const status = getStockStatus();
  const percentage = Math.min((stock / (threshold * 2)) * 100, 100);

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
          <span className="text-sm font-medium text-secondary-700">{stock} units</span>
        </div>
      )}
      <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300 rounded-full", status.color)}
          style={{ width: `${Math.max(percentage, stock > 0 ? 10 : 0)}%` }}
        />
      </div>
    </div>
  );
};

export default StockIndicator;