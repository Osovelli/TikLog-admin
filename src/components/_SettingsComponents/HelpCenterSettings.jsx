import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  User, 
  Wallet, 
  Car, 
  Tag, 
  Settings,
  MessageCircle,
  Phone,
  Mail,
  Star,
  TicketIcon,
  Plus
} from "lucide-react"
import { useState } from "react"
import { Separator } from "../ui/separator"

export default function HelpCenterSettings() {
  const [openSection, setOpenSection] = useState(null)

  const sections = [
    {
      id: "account",
      icon: <User className="h-5 w-5" />,
      title: "Account management",
      content: "Manage your account settings and preferences"
    },
    {
      id: "money",
      icon: <Wallet className="h-5 w-5" />,
      title: "Adding money",
      content: "Learn about payment methods and transactions"
    },
    {
      id: "deliveries",
      icon: <Car className="h-5 w-5" />,
      title: "Requesting deliveries",
      content: "Information about delivery services and tracking"
    },
    {
      id: "deals",
      icon: <Tag className="h-5 w-5" />,
      title: "Deals",
      content: "Find out about current promotions and offers"
    },
    {
      id: "settings",
      icon: <Settings className="h-5 w-5" />,
      title: "Account management",
      content: "Additional account settings and configurations"
    },
  ]

  const supportOptions = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Chat with us",
      description: "Start a conversation on live chat"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call us",
      description: "Start a conversation on via phone"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Send us an email",
      description: "support@tiklog.com"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Share your feedback",
      description: "Help us improve by sharing your thoughts."
    },
    {
      icon: <TicketIcon className="h-5 w-5" />,
      title: "Raise a Ticket",
      description: "Need assistance? We're here to help."
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-base font-semibold text-blue-600">Help Center</h1>
        <p className="text-muted-foreground text-sm">Manage password and biometrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {sections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSection === section.id}
              onOpenChange={() => setOpenSection(openSection === section.id ? null : section.id)}
            >
              <Card className="p-4">
                <CollapsibleTrigger asChild>
                  <span
                    variant="ghost"
                    className="flex w-full items-center justify-between p-0 hover:bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span>{section.title}</span>
                    </div>
                    <Plus className="h-5 w-5" />
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <p className="text-sm text-muted-foreground pl-8">
                    {section.content}
                  </p>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        <Card className="p-6 space-y-2">
          {supportOptions.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start gap-3 h-auto p-2"
            >
              {option.icon}
              <div className="text-left">
                <div className="font-medium">{option.title}</div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </Button>
          ))}
        </Card>
      </div>
    </div>
  )
}