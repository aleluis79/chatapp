import React, { createContext, useContext, useState } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatContextType {
  messages: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isLoading, setIsLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
