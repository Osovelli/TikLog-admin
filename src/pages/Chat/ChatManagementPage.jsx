import React, { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { ChatList } from '@/components/_ChatComponents/ChatList'
import { ChatThread } from '@/components/_ChatComponents/ChatThread';



export const ChatManagementPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const currentUser = {
    name: "Support Agent",
    avatar: "/Avatar2.png"
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    if (isMobileView) {
      setShowChat(false);
    }
  };

  const handleBackClick = () => {
    setShowChat(true);
    setActiveChat(null);
  };

  // Sample data
  const chats = [
    {
      id: 1,
      name: "James Okbepa",
      time: "12:00 PM",
      lastMessage: "Cursus id vitae quam vulputate tempus ut. Sit proin arcu nisl ...",
      status: "pending",
      avatar: "/Avatar3.png",
      messages: [
        {
          type: 'incoming',
          text: "We're thrilled to have you here. Our company specializes in a specific industry or service. We offer a range of solutions designed to help businesses solve a specific problem.",
          time: "08:15 PM",
          sender: "James Okbepa",
        },
        {
          type: 'outgoing',
          text: "Faucibus nisi sagittis orci magna porta. Mi quam tellus dig nis sim. Pellentesque vestibulum integer ac aliquam faci lisis maec enas purus, massa.",
          time: "08:40 PM",
          sender: "Support Agent",
        },
        {
          type: 'outgoing',
          text: "To get more detailed pricing information and explore which plan suits your needs best, I recommend visiting our website or speaking with one of our sales representatives. They'll be happy to provide you with all the necessary details and assist you in choosing the right plan for your business.",
          time: "10:00 PM",
          sender: "Support Agent",
          images: [
            "/placeholder.svg?height=200&width=200",
            "/placeholder.svg?height=200&width=200",
            "/placeholder.svg?height=200&width=200"
          ]
        },
        {
          type: 'incoming',
          text: "We understand the importance of pricing transparency. Our pricing structure is designed to be flexible and cater to businesses of all sizes. We offer different pricing tiers tailored to meet varying needs and budgets.",
          time: "9:00 PM",
          sender: "James Okbepa",
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      time: "11:30 AM",
      lastMessage: "Thank you for your quick response. I appreciate the help.",
      status: "resolved",
      avatar: "/Avatar3.png",
      messages: []
    },
    {
      id: 3,
      name: "Michael Chen",
      time: "10:45 AM",
      lastMessage: "I'm having trouble with my account. Can you assist me?",
      status: "pending",
      avatar: "/Avatar1.png",
      messages: []
    },
    {
      id: 4,
      name: "Emily Davis",
      time: "Yesterday",
      lastMessage: "The issue has been resolved. Thank you for your help!",
      status: "resolved",
      avatar: "/Avatar3.png",
      messages: []
    },
    {
      id: 5,
      name: "Alex Thompson",
      time: "Yesterday",
      lastMessage: "I need some information about your premium plans.",
      status: "pending",
      avatar: "/Avatar1.png",
      messages: []
    }
    // Add more sample chats here
  ];

  return (
    <AppLayout title={"Chat Management"}>
    <div className="h-screen flex">
      <ChatList 
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        isMobileView={isMobileView}
        onChatOpen={() => setShowChat(true)}
      />
      {(!isMobileView || showChat) &&  (
        <ChatThread 
          chat={activeChat || chats[0]} 
          isMobileView={isMobileView}
          onBackClick={handleBackClick}
          currentUser={currentUser}
        />
      )}
    </div>
    </AppLayout>
  );
};