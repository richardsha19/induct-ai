import { Button } from "@/app/components/ui/button"
import { BookOpen, FileText, HelpCircle, Settings, Users } from 'lucide-react'

const topics = [
  { name: 'Getting Started', icon: BookOpen },
  { name: 'Company Policies', icon: FileText },
  { name: 'Meet the Team', icon: Users },
  { name: 'FAQ', icon: HelpCircle },
  { name: 'Settings', icon: Settings },
]

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <nav className="flex-1">
        {children}
        <hr className="my-4 border-gray-700" />
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li key={topic.name}>
              <Button variant="ghost" className="w-full justify-start text-white hover:text-gray-300 hover:bg-gray-700">
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

