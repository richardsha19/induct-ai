import { Button } from "@/app/components/ui/button"
import { Chat } from './OnboardingChat'
import { Trash2, Plus } from 'lucide-react'

interface ChatHistoryProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onStartNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export default function ChatHistory({ chats, currentChatId, onSelectChat, onStartNewChat, onDeleteChat }: ChatHistoryProps) {
  const regularChats = chats.filter(chat => !chat.isSpecial);

  return (
    <div className="space-y-2">
      <Button 
        onClick={onStartNewChat}
        variant="ghost" 
        className="w-full justify-start text-white hover:text-gray-300 hover:bg-gray-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      {regularChats.map((chat) => (
        <div key={chat.id} className="flex items-center space-x-2 group">
          <Button
            onClick={() => onSelectChat(chat.id)}
            variant={chat.id === currentChatId ? "secondary" : "ghost"}
            className={`flex-grow justify-start text-white hover:text-gray-300 hover:bg-gray-700 ${
              chat.id === currentChatId ? 'bg-gray-700' : ''
            }`}
          >
            <span className="text-xs leading-tight truncate w-full text-left">
              {chat.title}
            </span>
          </Button>
          <Button
            onClick={() => onDeleteChat(chat.id)}
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

