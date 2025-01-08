import React from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'


export const ButtonComponent = ({
    label,
    buttonStyles,
    icon,
    variant,
    ...props
    
}) => {
  return (
    <div>
        <Button
        {...props}
        variant={variant}
        className='w-full flex items-center justify-center h-[52px] shadow-sm'
        >
          {icon && 
          <div className='px-1'>
           {icon}
          </div>}
          {label && 
          <div className=''>
            {label}
          </div> }     
        </Button>
    </div>
  )
}
