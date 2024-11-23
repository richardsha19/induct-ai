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
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const getCurrentChat = () => chats.find(chat => chat.id === currentChatId) || null

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setChats(prevChats => {
      const updatedChats = [...prevChats]
      const currentChatIndex = updatedChats.findIndex(chat => chat.id === currentChatId)
      
      if (currentChatIndex !== -1) {
        updatedChats[currentChatIndex] = {
          ...updatedChats[currentChatIndex],
          messages: [...updatedChats[currentChatIndex].messages, { role, content }]
        }
      } else {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          messages: [{ role, content }]
        }
        updatedChats.push(newChat)
        setCurrentChatId(newChat.id)
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

