import { forwardRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "./Button";

const Modal = forwardRef(({
  className,
  isOpen,
  onClose,
  title,
  children,
  ...props
}, ref) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={handleBackdropClick}
      />
      <div
        ref={ref}
        className={cn(
          "relative bg-gradient-to-br from-white to-secondary-50 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-secondary-200 transform transition-all duration-300 scale-100",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-700"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;