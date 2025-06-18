import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Lightbulb } from "lucide-react"
import { contentConfigs } from "@/lib/utils/content-helpers"

export const ContentTemplateSelector = ({ contentName, onUseTemplate, disabled = false }) => {
  const config = contentConfigs[contentName]

  if (!config?.template) {
    return null
  }

  const handleUseTemplate = () => {
    if (onUseTemplate) {
      onUseTemplate(config.template)
    }
  }

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Lightbulb className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800">
          Need help getting started? We have a template with common sections for {config.title.toLowerCase()}.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseTemplate}
          disabled={disabled}
          className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <FileText className="h-3 w-3 mr-1" />
          Use Template
        </Button>
      </AlertDescription>
    </Alert>
  )
}
