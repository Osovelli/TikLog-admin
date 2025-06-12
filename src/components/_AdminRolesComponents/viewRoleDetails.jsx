import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function ViewRoleDetails({ role, isOpen, onClose }) {
  if (!role) {
    return null; // Don't render if no role is provided
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{role.role}</SheetTitle>
          <SheetDescription>Details for the role {role.description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-8 py-4">
          <div className="items-center gap-6">
            <div className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              ID:
            </div>
            <div className="col-span-3 font-normal text-sm">{role.id || "No ID provided."}</div>
          </div>
          <div className="items-center gap-6">
            <div className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description:
            </div>
            <div className="col-span-3 text-sm font-normal">{role.description || "No description provided."}</div>
          </div>
          <div className="items-center gap-4">
            <div className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Created At:
            </div>
            <div className="col-span-3 text-sm font-normal">{new Date(role.createdAt).toLocaleString() !== 'Invalid Date' ||  "No date provided."}</div>
          </div>
          {/* Add more details as needed */}
        </div>
      </SheetContent>
    </Sheet>
  );
}