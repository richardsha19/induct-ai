import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Send } from 'lucide-react'
import { Chat } from './OnboardingChat'

interface ChatAreaProps {
  chat: Chat | null;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
}

export default function ChatArea({ chat, addMessage }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      addMessage('user', input)
      setInput('')
      // Simulate assistant response in the same chat
      setTimeout(() => {
        addMessage('assistant', `I understand you're asking about "${input}". How can I help you with that?`)
      }, 1000)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Type a message to start this conversation.
          </div>
        ) : (
          chat.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-sm rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gray-800 text-white border-gray-700"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

