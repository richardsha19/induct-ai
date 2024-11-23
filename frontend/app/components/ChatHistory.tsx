import { Button } from "@/app/components/ui/button"
import { Chat } from './OnboardingChat'
import { Trash2 } from 'lucide-react'

interface ChatHistoryProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onStartNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export default function ChatHistory({ chats, currentChatId, onSelectChat, onStartNewChat, onDeleteChat }: ChatHistoryProps) {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onStartNewChat}
        variant="outline" 
        className="w-full justify-start text-white hover:text-gray-300 hover:bg-gray-700"
      >
        + New Chat
      </Button>
      {chats.map((chat) => (
        <div key={chat.id} className="flex items-center space-x-2">
          <Button
            onClick={() => onSelectChat(chat.id)}
            variant={chat.id === currentChatId ? "secondary" : "ghost"}
            className="flex-grow justify-start text-white hover:text-gray-300 hover:bg-gray-700"
          >
            {chat.title}
          </Button>
          <Button
            onClick={() => onDeleteChat(chat.id)}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

