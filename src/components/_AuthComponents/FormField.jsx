import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns'


export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  className,
  value,
  onChange,
}) {
    const handleChange = (e) => {
        if (type === 'checkbox') {
          onChange?.(e.target.checked)
        } else {
          onChange?.(e.target.value)
        }
      }

  const handleDateChange = (date) => {
    onChange?.(date || '')
  }

  return (
    <div className={cn("mb-4", className)}>
      {type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            required={required}
            checked={value}
            onChange={handleChange}
            className="h-4 w-4 text-primary border-primary-foreground rounded focus:ring-primary"
          />
          <label htmlFor={name} className="ml-2 block text-sm text-primary">
            {label}
          </label>
        </div>
      ) : (
        <>
          {label && <label htmlFor={name} className="block text-sm font-medium text-primary mb-1">
            {label}{required && '*'}
          </label>}
          <div className="relative">
            {type === 'date' ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <input
                type={type}
                id={name}
                name={name}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background text-primary border border-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>
        </>
      )}
    </div>
    /* <div className={cn("mb-4", className)}>
      {(type !== 'checkbox' && label) && (
        <label htmlFor={name} className="block text-sm font-medium text-primary mb-1">
          {label}{required && '*'}
        </label>
      )}
      <div className="relative">
        {type === 'date' ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal",
                  !value && "text-muted-foreground border-1"
                )}
              >
                {value ? format(value, "PPP") : <span>{placeholder}</span>}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={cn(
              "w-full px-3 py-2 bg-background text-primary border border-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              type === 'checkbox' && "mr-2"
            )}
          />
        )}
      </div>
      {type === 'checkbox' && (
        <label htmlFor={name} className="inline-block text-sm font-medium text-primary ml-2">
          {label}
        </label>
      )}
    </div> */
    
  )
}