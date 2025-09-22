import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing to see here", 
  description = "It looks like there's no data to display right now.", 
  actionLabel = "Get Started", 
  onAction,
  icon = "Package",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="bg-gradient-to-r from-secondary-100 to-secondary-200 p-6 rounded-full mb-6">
        <ApperIcon name={icon} className="h-16 w-16 text-secondary-400" />
      </div>
      <h3 className="text-2xl font-bold text-secondary-900 mb-3">{title}</h3>
      <p className="text-secondary-600 mb-8 max-w-md leading-relaxed">{description}</p>
      {onAction && (
        <Button onClick={onAction} size="lg">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;