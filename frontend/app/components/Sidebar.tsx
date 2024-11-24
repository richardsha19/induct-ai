import { Button } from "@/app/components/ui/button"
import { BookOpen, FileText, Users, HelpCircle, Settings } from 'lucide-react'
import ChatHistory from './ChatHistory'

const topics = [
  { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
  { id: 'company-policies', name: 'Company Policies', icon: FileText },
  { id: 'meet-the-team', name: 'Meet the Team', icon: Users },
  { id: 'faq', name: 'FAQ', icon: HelpCircle },
  { id: 'settings', name: 'Settings', icon: Settings },
]

interface SidebarProps {
  children: React.ReactNode;
  onSelectSpecialChat: (chatId: string) => void;
}

export default function Sidebar({ children, onSelectSpecialChat }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <nav className="flex-1">
        {children}
        <hr className="my-4 border-gray-700" />
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:text-gray-300 hover:bg-gray-700"
                onClick={() => onSelectSpecialChat(topic.id)}
              >
                <topic.icon className="mr-2 h-4 w-4" />
                {topic.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

