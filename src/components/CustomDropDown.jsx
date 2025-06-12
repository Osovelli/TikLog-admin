/* import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const CustomDropdown = ({ label, value, options = [], onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className={cn("relative w-full", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left border rounded-lg flex items-center justify-between bg-white"
        >
          <span className="text-gray-900">{value}</span>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {options?.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-900"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }; */

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export const CustomDropdown = ({ label, value, options = [], onChange, className, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Determine what to display in the button
  let displayText = placeholder || "Select an option"

  // If we have a value, find what to display
  if (value !== undefined && value !== null) {
    // Check if options are objects with value/label
    if (options.length > 0 && typeof options[0] === "object" && options[0] !== null) {
      // Find the matching option object
      const selectedOption = options.find((opt) => opt.value === value)
      if (selectedOption) {
        displayText = selectedOption.label
      }
    } else {
      // For flat arrays, the value itself is the display text
      displayText = value
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left border rounded-lg flex items-center justify-between bg-white"
      >
        <span className="text-sm">{displayText}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => {
            // Handle both object and string options
            const optionValue = typeof option === "object" && option !== null ? option.value : option
            const optionLabel = typeof option === "object" && option !== null ? option.label : option

            return (
              <button
                key={index}
                onClick={() => {
                  onChange(optionValue)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 "
              >
                {optionLabel}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
