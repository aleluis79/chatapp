import React, { useEffect, useRef, useState } from 'react'
import type { ModelId, LLMMessage } from '../services/LLMService'
import { llmService, LLMService } from '../services/LLMService'
import { useChat } from '../context/ChatContext'
import { Send, Loader, Settings } from 'lucide-react'

export function ChatContainer() {
  const { messages, addMessage, appendToMessage, isLoading, setIsLoading, clearMessages } = useChat()
  const [input, setInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelId>('Qwen2.5-0.5B-Instruct-q4f32_1-MLC')
  const [initError, setInitError] = useState<string | null>(null)
  const [modelLoading, setModelLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize LLM on component mount
  useEffect(() => {
    let mounted = true

    const initLLM = async () => {
      try {
        if (!mounted) return
        setInitError(null)
        setModelLoading(true)
        await llmService.initialize(selectedModel)
        if (mounted) setModelLoading(false)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initialize LLM'
        if (mounted) {
          setInitError(message)
          setModelLoading(false)
        }
        console.error('LLM initialization error:', error)
      }
    }

    initLLM()

    return () => {
      mounted = false
    }
  }, [selectedModel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading || modelLoading || !llmService.isInitialized()) {
      return
    }

    const userMessage = input.trim()
    setInput('')
    // Add the user message
    addMessage({
      role: 'user',
      content: userMessage,
    })

    setIsLoading(true)

    const conversationMessages: LLMMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    conversationMessages.push({
      role: 'user',
      content: userMessage,
    })

    // Create assistant placeholder before streaming so errors can append to it
    const assistantId = addMessage({ role: 'assistant', content: '' })

    try {
      await llmService.chat(conversationMessages, (token: string) => {
        appendToMessage(assistantId, token)
      })

      // Full response is already accumulated in the assistant message via appendToMessage
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      // Append error text to the existing assistant placeholder
      appendToMessage(assistantId, `\n\nError: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      // Focus input after render to ensure it's enabled and mounted
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div className="flex min-h-0 h-full flex-col bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">ChatBot IA</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {modelLoading && (
                  <span className="flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin" />
                    Cargando modelo...
                  </span>
                )}
                {!modelLoading && llmService.isInitialized() && (
                  <span>✅ Listo: {selectedModel.split('-')[0]}</span>
                )}
                {!modelLoading && !llmService.isInitialized() && (
                  <span>❌ Error: {initError || 'Fallo desconocido'}</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-4 max-w-4xl mx-auto w-full">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Model Selection
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {LLMService.getAvailableModels().map((model: ModelId) => (
                    <option key={model} value={model}>
                      {LLMService.getModelPresets()[model]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearMessages}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {initError && (
          <div className="border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 max-w-4xl mx-auto w-full">
            <p className="text-sm text-red-800 dark:text-red-300">{initError}</p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] max-w-4xl mx-auto w-full px-4 py-6 bg-slate-50 dark:bg-slate-950">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to ChatBot IA</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Start a conversation to begin</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Status: {llmService.isInitialized() ? '✅ Ready' : '⏳ Loading...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex px-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`inline-flex w-fit max-w-[88%] md:max-w-2xl flex-col gap-2 px-5 py-5 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-br-none shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="text-[15px] leading-7 whitespace-pre-wrap wrap-break-word">{message.content}</p>
                  <span className="text-xs opacity-70 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 w-full">
          <div className="h-6 mb-2">
            {isLoading && (
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || modelLoading || !llmService.isInitialized()}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || modelLoading || !input.trim() || !llmService.isInitialized()}
              className="px-4 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
