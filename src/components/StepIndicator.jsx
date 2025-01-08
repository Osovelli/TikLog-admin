import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StepIndicator({ 
  steps = [
    "Order Placement",
    "Rider Assigned",
    "Pick Up",
    "In-Transit",
    "Delivered"
  ],
  currentStep = 1,
  className = ""
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2 p-2 w-full", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isUpcoming = stepNumber > currentStep

        return (
          <div key={step} className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    {
                      "bg-emerald-500 text-white": isCompleted,
                      "bg-amber-500 text-white": isCurrent,
                      "bg-gray-200 text-gray-600": isUpcoming
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn("sm:hidden mt-1 text-gray-300", {
                      "text-emerald-500": isCompleted
                    })}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </div>
              <span
                className={cn("text-sm font-medium text-center sm:text-left", {
                  "text-emerald-500": isCompleted,
                  "text-amber-500": isCurrent,
                  "text-gray-600": isUpcoming
                })}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("hidden sm:block mx-2 text-gray-300", {
                  "text-emerald-500": isCompleted
                })}
              >
                {">"}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}