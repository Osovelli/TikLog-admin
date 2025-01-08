import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import React from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CustomButton({ 
  children,  
  icon: Icon,
  buttonVariant,
  className,
  ...props 
}) {
  return (
    <Button 
      variant={buttonVariant}
      className={cn('flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors', className)}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
}