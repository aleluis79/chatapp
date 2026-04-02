import React, { createContext, useContext, useState } from 'react'
import { generateId } from '../utils/helpers'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatContextType {
  messages: ChatMessage[]
  // addMessage returns the id of the created message
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string
  // appendToMessage is used to stream tokens into an existing message
  appendToMessage: (id: string, token: string) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): string => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }

  const appendToMessage = (id: string, token: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, content: m.content + token } : m)))
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <ChatContext.Provider value={{ messages, addMessage, appendToMessage, clearMessages, isLoading, setIsLoading }}>
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
