import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="bg-gradient-to-r from-error-100 to-error-200 p-4 rounded-full mb-4">
        <ApperIcon name="AlertCircle" className="h-12 w-12 text-error-500" />
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-secondary-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="min-w-[140px]">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;