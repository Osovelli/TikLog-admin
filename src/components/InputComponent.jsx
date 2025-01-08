import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const InputComponent = React.forwardRef(({ 
  label, 
  error, 
  className,
  password = false,
  type = "text",
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id || props.name}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-destructive"
          )}
        >
          {label}
        </Label>
      )}
      <Input
        type={type}
        className={cn(
          "h-[52px]  px-3",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
      {
        password && 
        <div className='relative'>
          <button
          className="absolute right-3 bottom-5 transform -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" /> }
          </button>
        </div>
        }
       
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
});

InputComponent.displayName = "Input";

export default InputComponent;