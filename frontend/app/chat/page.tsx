'use client'

import { useRouter } from 'next/navigation'
import OnboardingChat from '../components/OnboardingChat'
import { Button } from "@/app/components/ui/button"

export default function ChatPage() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you'd clear the session/token here
    router.push('/')
  }

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="p-4 bg-gray-800 shadow flex justify-between items-center">
        <h1 className="text-2xl font-bold">Onboarding Chat</h1>
        <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-700">Logout</Button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <OnboardingChat />
      </div>
    </main>
  )
}

