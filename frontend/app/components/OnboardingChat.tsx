'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import ChatHistory from './ChatHistory'
import { Message } from '../types'
import { users } from '../users'

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  isSpecial?: boolean;
}

const prompts: Record<string, string> = {
  'getting-started': 'Help the user get started based on the job position the user is starting. This could include relevant information about the company, Meta, as well as company vision, beliefs, and information about the team.',
  'company-policies': 'Help the user be more aware of the company policies, rules and company vision in the company.',
  'meet-the-team': 'Help the user understand the company and team hierarchy, including who they can go for help.',
};

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

export default function OnboardingChat({ username }: { username: string }) {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'default',
      title: 'New Chat',
      messages: []
    },
    ...Object.values(defaultChats)
  ])
  const [currentChatId, setCurrentChatId] = useState<string>('default')

  const currentUser = users.find(user => user.username === username);
  const userPosition = currentUser?.position || 'unknown';

  useEffect(() => {
    const initializeSpecialChats = async () => {
      const specialChatIds = ['getting-started', 'company-policies', 'meet-the-team'];
      for (const chatId of specialChatIds) {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
          try {
            const response = await fetch('http://127.0.0.1:8000/user/send_message', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: prompts[chatId], position: userPosition }),
            });
            if (response.ok) {
              const data = await response.json();
              updateChatMessages(chatId, 'assistant', data.message);
            }
          } catch (error) {
            console.error(`Error initializing ${chatId} chat:`, error);
          }
        }
      }
    };

    initializeSpecialChats();
  }, []);

  const getCurrentChat = () => chats.find(chat => chat.id === currentChatId) || null

  const createChatTitle = (content: string) => {
    return content.length > 30 ? `${content.slice(0, 27)}...` : content;
  }

  const updateChatMessages = (chatId: string, role: 'user' | 'assistant', content: string) => {
    setChats(prevChats => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          messages: [...updatedChats[chatIndex].messages, { role, content }],
          title: role === 'user' && updatedChats[chatIndex].title === 'New Chat'
            ? createChatTitle(content)
            : updatedChats[chatIndex].title
        };
      }
      return updatedChats;
    });
  }

  const addMessage = async (role: 'user' | 'assistant', content: string) => {
    updateChatMessages(currentChatId, role, content);

    if (role === 'user') {
      try {
        const response = await fetch('http://127.0.0.1:8000/user/send_message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: content, position: userPosition }),
        });
        if (response.ok) {
          const data = await response.json();
          updateChatMessages(currentChatId, 'assistant', data.message);
        } else {
          throw new Error('Failed to get response from server');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Use default response if there's an error
        updateChatMessages(currentChatId, 'assistant', "I'm sorry, I'm having trouble answering that question. Please refer to your manager and ask me if you have any further questions!");
      }
    }
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

