import React from 'react';
import { User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const AvatarUpload = ({ onAvatarChange }) => {
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      onAvatarChange?.(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative group">
          <Avatar className="h-20 w-20 border-2 border-gray-100">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gray-50">
              <User className="h-10 w-10 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-sm">Change</span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose profile picture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <Button onClick={triggerFileInput} className="w-full">
            Upload new image
          </Button>
          {avatarUrl && (
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Example usage in form
export default function ExampleForm() {
  const handleAvatarChange = (file) => {
    console.log('Avatar file:', file);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex justify-center mb-6">
        <AvatarUpload onAvatarChange={handleAvatarChange} />
      </div>
      
      {/* Rest of your form fields here */}
    </div>
  );
}