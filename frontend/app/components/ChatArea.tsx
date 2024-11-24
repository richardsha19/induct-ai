import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Send } from 'lucide-react'
import { Chat } from './OnboardingChat'
import ReactMarkdown from 'react-markdown'

interface ChatAreaProps {
  chat: Chat | null;
  addMessage: (role: 'user' | 'assistant', content: string) => Promise<void>;
}

export default function ChatArea({ chat, addMessage }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      setIsLoading(true)
      setInput('')
      await addMessage('user', input.trim())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  if (!chat) {
    return <div className="flex-1 p-4 text-center text-gray-500">Select a chat to start messaging</div>
  }

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
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-2" {...props} />,
                      code: ({ node, inline, ...props }) => 
                        inline ? (
                          <code className="bg-gray-800 rounded px-1 py-0.5" {...props} />
                        ) : (
                          <code className="block bg-gray-800 rounded p-2 my-2 whitespace-pre-wrap" {...props} />
                        ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
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
            disabled={isLoading}
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

