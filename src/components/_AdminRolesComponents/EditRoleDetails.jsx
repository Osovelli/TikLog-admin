import { useState, useEffect } from "react"
import useRoleStore from "@/store/RolesStore"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Loader2 } from "lucide-react"

export function EditRoleDetails({ role, isOpen, onClose }) {
  const [name, setName] = useState(role?.name || "")
  const [description, setDescription] = useState(role?.description || "")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { updateRole, loading } = useRoleStore()

  // Reset form when role changes or sheet opens
  useEffect(() => {
    if (isOpen && role) {
      setName(role.name || "")
      setDescription(role.description || "")
      setErrors({})
    }
  }, [isOpen, role])

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = "Role name is required"
    if (name.trim().length < 3) newErrors.name = "Role name must be at least 3 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdate = async () => {
    if (!validateForm()) return
    console.log("UPDATE DETAILS", { name, description })
    setIsSubmitting(true)
    try {
      await updateRole(role._id, { name: name, description: description })
      onClose()
    } catch (error) {
      console.error("Error updating role:", error)
      setIsSubmitting(false)
    } 
  }

  if (!role) {
    return null // Don't render if no role is provided
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Edit Role Details</SheetTitle>
          <SheetDescription>Modify the details for this role</SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          {/* Role ID (read-only) */}
          <div className="grid gap-2">
            <Label htmlFor="role-id" className="text-sm font-medium">
              Role ID
            </Label>
            <Input id="role-id" value={role._id || "No ID provided"} disabled className="bg-gray-50" />
          </div>

          {/* Role Name (editable) */}
          <div className="grid gap-2">
            <Label htmlFor="role-name" className="text-sm font-medium">
              Role Name
            </Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Role Description (editable) */}
          <div className="grid gap-2">
            <Label htmlFor="role-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
              rows={4}
            />
          </div>

          {/* Created At (read-only) */}
          <div className="grid gap-2">
            <Label htmlFor="created-at" className="text-sm font-medium">
              Created At
            </Label>
            <Input
              id="created-at"
              value={
                new Date(role.createdAt).toLocaleString() !== "Invalid Date"
                  ? new Date(role.createdAt).toLocaleString()
                  : "No date provided"
              }
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <SheetFooter className="sm:justify-between gap-4 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting || loading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isSubmitting || loading}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
