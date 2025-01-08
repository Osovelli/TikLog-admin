import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormInput({ label, id, type = "text", inputClassName, ...props }) {
  return (
    <div className={`space-y-1 ${inputClassName}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...props} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 h-[40px] flex items-center"  />
    </div>
  )
}