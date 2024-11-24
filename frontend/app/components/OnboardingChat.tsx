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
  isSpecial?: boolean;
}

const defaultChats: { [key: string]: Chat } = {
  'getting-started': {
    id: 'getting-started',
    title: 'Getting Started',
    messages: [
      { role: 'assistant', content: "Welcome to our company! I'm here to help you get started. What would you like to know about your first day?" }
    ],
    isSpecial: true
  },
  'company-policies': {
    id: 'company-policies',
    title: 'Company Policies',
    messages: [
      { role: 'assistant', content: "Our company policies ensure a safe and productive work environment. What specific policy would you like information on?" }
    ],
    isSpecial: true
  },
  'meet-the-team': {
    id: 'meet-the-team',
    title: 'Meet the Team',
    messages: [
      { role: 'assistant', content: "Let's introduce you to your new colleagues! Which department or team member would you like to learn about?" }
    ],
    isSpecial: true
  },
  'faq': {
    id: 'faq',
    title: 'FAQ',
    messages: [],
    isSpecial: true
  },
  'settings': {
    id: 'settings',
    title: 'Settings',
    messages: [],
    isSpecial: true
  }
}

export default function OnboardingChat() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'default',
      title: 'New Chat',
      messages: []
    },
    ...Object.values(defaultChats)
  ])
  const [currentChatId, setCurrentChatId] = useState<string>('default')

  const getCurrentChat = () => chats.find(chat => chat.id === currentChatId) || null

  const createChatTitle = (content: string) => {
    return content.length > 30 ? `${content.slice(0, 27)}...` : content;
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setChats(prevChats => {
      const updatedChats = [...prevChats]
      const currentChatIndex = updatedChats.findIndex(chat => chat.id === currentChatId)
    
      if (currentChatIndex !== -1) {
        updatedChats[currentChatIndex] = {
          ...updatedChats[currentChatIndex],
          messages: [...updatedChats[currentChatIndex].messages, { role, content }],
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
    const chatToDelete = chats.find(chat => chat.id === chatId)
    if (chatToDelete && chatToDelete.isSpecial) {
      console.warn('Cannot delete special chats')
      return
    }
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId('default')
    }
  }

  return (
    <>
      <Sidebar onSelectSpecialChat={selectChat}>
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
