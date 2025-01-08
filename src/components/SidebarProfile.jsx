import React from 'react'
import { CheckCircle2, ChevronDown, LogOut, LogOutIcon, UserCog } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'


export const SidebarProfile = ({ name, email, avatarUrl, isVerified = false }) => {
  return (
    <div className="flex items-center space-x-4 p-2 mb-6 hover:bg-gray-50 bg-white rounded-lg shadow">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        {isVerified && (
          <CheckCircle2 className="absolute top-0 right-0 h-4 w-4 bg-blue-500 text-white rounded-full" />
        )}
      </div>
      <div className="flex-grow text-center min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">{email}</p>
      </div>
      <span className='text-red-500 hover:text-red-300 cursor-pointer'>
        <LogOutIcon />
      </span>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link to={"/profile"} className='flex gap-1'>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={"/signin"} className='flex gap-1'>
              <LogOut className="mr-2 h-4 w-4" oncl />
              <span>Log out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  )
}