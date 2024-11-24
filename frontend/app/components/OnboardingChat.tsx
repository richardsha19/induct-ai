'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import ChatHistory from './ChatHistory'
import { Message } from '../types'

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function OnboardingChat() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'default',
      title: 'New Chat',
      messages: []
    }
  ])
  const [currentChatId, setCurrentChatId] = useState<string>('default')

  const getCurrentChat = () => chats.find(chat => chat.id === currentChatId) || null

  const createChatTitle = (content: string) => {
    // Limit the title to 30 characters, adding an ellipsis if it's longer
    return content.length > 30 ? `${content.slice(0, 27)}...` : content;
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setChats(prevChats => {
      const updatedChats = [...prevChats]
      const currentChatIndex = updatedChats.findIndex(chat => chat.id === currentChatId)
    
      if (currentChatIndex !== -1) {
        // Add message to existing chat
        updatedChats[currentChatIndex] = {
          ...updatedChats[currentChatIndex],
          messages: [...updatedChats[currentChatIndex].messages, { role, content }],
          // Update title if this is the first user message and the title is still 'New Chat'
          title: role === 'user' && updatedChats[currentChatIndex].title === 'New Chat' 
            ? createChatTitle(content) 
            : updatedChats[currentChatIndex].title
        }
      } else {
        console.error('Current chat not found')
      }

      return updatedChats
    })
  }

  const startNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    setChats(prevChats => [...prevChats, newChat])
    setCurrentChatId(newChat.id)
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
    }
  }

  return (
    <>
      <Sidebar>
        <ChatHistory 
          chats={chats} 
          currentChatId={currentChatId} 
          onSelectChat={selectChat}
          onStartNewChat={startNewChat}
          onDeleteChat={deleteChat}
        />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <ChatArea 
          chat={getCurrentChat()}
          addMessage={addMessage}
        />
      </div>
    </>
  )
}
