import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ChatMessage = ({ message, senderAvatar, receiverAvatar, senderName, receiverName }) => (
    <div className={cn(
      "flex gap-3 mb-4",
      message.type === 'outgoing' ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.type === 'outgoing' ? senderAvatar : receiverAvatar} />
        <AvatarFallback>
          {message.type === 'outgoing' ? senderName[0].toUpperCase() : receiverName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "max-w-[70%]",
        message.type === 'outgoing' ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg p-3 mb-1",
          message.type === 'outgoing'
            ? "bg-indigo-600 text-white"
            : "bg-white border text-gray-900"
        )}>
          {message.text}
        </div>
        {message.images && message.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {message.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Attachment ${index + 1}`}
                  className="rounded-lg w-full aspect-square object-cover"
                />
                <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={cn(
          "text-xs text-gray-500",
          message.type === 'outgoing' ? "text-right" : "text-left"
        )}>
          {message.time}
        </div>
      </div>
    </div>
  );
  

/* export const ChatMessage = ({ message, isOutgoing, time, images }) => (
    <div className={cn("flex gap-2 mb-6", isOutgoing ? "flex-row-reverse" : "")}>
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img 
          src={message.avatar || "/placeholder.svg?height=32&width=32"} 
          alt={message.sender}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={cn("max-w-[70%]", isOutgoing ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-lg p-3 mb-1",
          isOutgoing 
            ? "bg-indigo-600 text-white" 
            : "bg-white border text-gray-900"
        )}>
          {message.text}
        </div>
        {images && images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Attachment ${index + 1}`}
                  className="rounded-lg w-full aspect-square object-cover"
                />
                <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={cn(
          "text-xs text-gray-500",
          isOutgoing ? "text-right" : "text-left"
        )}>
          {time}
        </div>
      </div>
    </div>
  ); */