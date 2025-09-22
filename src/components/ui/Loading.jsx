import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary-200 border-t-primary-500 mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Package" className="h-6 w-6 text-primary-500 animate-pulse" />
        </div>
      </div>
      <p className="text-secondary-600 font-medium text-center">{message}</p>
      <p className="text-secondary-500 text-sm text-center mt-2">
        Please wait while we load your data...
      </p>
    </div>
  );
};

export default Loading;