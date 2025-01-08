import { ArrowLeft, Smile, Paperclip, Send } from "lucide-react"
import  { Button } from "../ui/button";
import  { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { ChatMessage } from "./ChatMessage";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ChatThread = ({ chat, isMobileView, onBackClick, currentUser }) => {
    if (!chat) return null;
  
    return (
      <div className={cn(
        "flex-1 flex flex-col h-full",
        isMobileView && "w-full"
      )}>
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isMobileView && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBackClick}
                className="mr-2 lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Avatar>
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{chat.name}</span>
            <Select defaultValue={chat.status}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            className="text-indigo-600 hidden md:inline-flex"
          >
            Send Receipt to Email
          </Button>
        </div>
  
        <div className="flex-1 overflow-auto p-4">
          <div className="text-center text-sm text-gray-500 my-4">Today</div>
          {chat.messages.map((message, index) => (
            <ChatMessage 
              key={index}
              message={message}
              senderAvatar={currentUser.avatar}
              receiverAvatar={chat.avatar}
              senderName={currentUser.name}
              receiverName={chat.name}
            />
          ))}
        </div>
  
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Write your message here..." 
              className="flex-1"
            />
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Smile className="w-5 h-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>
            <Button size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

/* export const ChatThread = ({ chat, isMobileView, onBackClick }) => {
  if (!chat) return null;

  return (
    <div className={cn(
      "flex-1 flex flex-col h-full ",
      isMobileView && "w-full"
    )}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isMobileView && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBackClick}
              className="mr-2 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <img 
            src={chat.avatar || "/placeholder.svg?height=40&width=40"} 
            alt={chat.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{chat.name}</span>
          <Select defaultValue="pending">
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          className="text-indigo-600 hidden md:inline-flex"
        >
          Send Receipt to Email
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="text-center text-sm text-gray-500 my-4">Today</div>
        {chat.messages.map((message, index) => (
          <ChatMessage 
            key={index}
            message={message}
            isOutgoing={message.type === 'outgoing'}
            time={message.time}
            images={message.images}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Write your message here..." 
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Smile className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          <Button size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}; */
