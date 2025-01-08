import { ChevronDown } from "lucide-react";


/* export const CardComponent = ({ 
    title, 
    subtitle,
    content,
    action,
    highlight,
    variant="default",
    className = '' 
  }) => {
    const baseClass = "bg-white rounded-lg border-t-2 shadow-lg border-1 p-4";
    const variantClass = variant == 'blue' ? 'bg-blue-900 text-white' : '';
  
    return (
      <div className={`${baseClass} ${variantClass} ${className}`}>
        {(title || action || highlight) && (
          <div className="flex justify-between items-center mb-2 ">
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
            {action && (
              <div className="flex items-center text-sm text-gray-500">
                {action}
                <ChevronDown size={16} className="ml-1" />
              </div>
            )}
            {highlight && <span className="text-blue-500 text-sm font-normal">{highlight}</span>}
          </div>
        )}
        {subtitle && <p className="text-3xl mb-2">{subtitle}</p>}
        <div className="">{content}</div>
      </div>
    );
  }; */

import { cn } from "@/lib/utils"

export const CardComponent = ({
  title,
  subtitle,
  content,
  action,
  highlight,
  variant = "default",
  className = ''
}) => {
  const variants = {
    default: "bg-white",
    blue: "bg-blue-900 text-white border-blue-700"
  };

  return (
    <div
      className={cn(
        "rounded-lg border-t-2 shadow-lg p-4",
        variants[variant],
        className
      )}
    >
      {(title || action || highlight) && (
        <div className="flex justify-between items-center mb-2">
          {title && (
            <h3 
              className={cn(
                "text-sm font-semibold",
                variant === 'blue' && "text-white"
              )}
            >
              {title}
            </h3>
          )}
          
          {action && (
            <div 
              className={cn(
                "flex items-center text-sm",
                variant === 'blue' ? "text-white/80" : "text-gray-500"
              )}
            >
              {action}
              <ChevronDown size={16} className="ml-1" />
            </div>
          )}
          
          {highlight && (
            <span 
              className={cn(
                "text-sm font-normal",
                variant === 'blue' ? "text-white/90" : "text-blue-500"
              )}
            >
              {highlight}
            </span>
          )}
        </div>
      )}
      
      {subtitle && (
        <p 
          className={cn(
            "text-3xl mb-2",
            variant === 'blue' && "text-white"
          )}
        >
          {subtitle}
        </p>
      )}
      
      <div>{content}</div>
    </div>
  );
};