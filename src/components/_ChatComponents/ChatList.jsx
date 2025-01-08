import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";

const TabButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        active 
          ? 'border-b-2 border-indigo-600 text-indigo-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
  
 export const ChatList = ({ chats, activeChat, onChatSelect, isMobileView, onChatOpen }) => {
    const [activeTab, setActiveTab] = useState('open');
  
    const filteredChats = chats.filter(chat => 
      (activeTab === 'open' && chat.status === 'pending') || 
      (activeTab === 'resolved' && chat.status === 'resolved')
    );
  
    return (
      <div className={cn(
        "border-r h-full flex flex-col",
        isMobileView ? "w-full" : "w-80",
        activeChat && isMobileView ? "hidden" : "block"
      )}>
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Chat</h1>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>
        
        <div className="border-b">
          <div className="flex justify-between px-4">
            <TabButton 
              label="Open Tickets" 
              active={activeTab === 'open'} 
              onClick={() => setActiveTab('open')}
            />
            <TabButton 
              label="Resolved" 
              active={activeTab === 'resolved'} 
              onClick={() => setActiveTab('resolved')}
            />
          </div>
        </div>
  
        <div className="flex-1 overflow-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                onChatSelect(chat)
                if (isMobileView) onChatOpen()
              }}
              className={cn(
                "w-full p-4 text-left border-b hover:bg-gray-50 flex gap-3",
                activeChat?.id === chat.id && "bg-gray-50"
              )}
            >
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{chat.name}</span>
                  <span className="text-sm text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full mt-2",
                chat.status === 'pending' ? "bg-orange-500" : "bg-green-500"
              )} />
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  /* export const ChatList = ({ chats, activeChat, onChatSelect, isMobileView, onChatOpen }) => (
    <div className={cn(
      "border-r h-full flex flex-col",
      isMobileView ? "w-full" : "w-80",
      activeChat && isMobileView ? "hidden" : "block"
    )}>
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chat</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          New chat
        </Button>
      </div>
      
      <div className="border-b">
        <div className="flex">
          <TabButton label="Open Tickets" active={true} onClick={() => {}} />
          <TabButton label="Resolved" active={false} onClick={() => {}} />
        </div>
      </div>
  
      <div className="flex-1 overflow-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => {
              onChatSelect(chat)
              if (isMobileView) onChatOpen()
            }}
            className={cn(
              "w-full p-4 text-left border-b hover:bg-gray-50 flex gap-3",
              activeChat?.id === chat.id && "bg-gray-50"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-gray-600">UN</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="font-medium">{chat.name}</span>
                <span className="text-sm text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full mt-2",
              chat.status === 'pending' ? "bg-orange-500" : "bg-green-500"
            )} />
          </button>
        ))}
      </div>
    </div>
  ); */