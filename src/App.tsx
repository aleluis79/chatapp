import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'
import { ChatContainer } from './components/ChatContainer'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="flex flex-col h-screen">
          {/* Theme Toggle */}
          <div className="fixed top-4 right-4 z-20">
            <ThemeToggle />
          </div>
          
          {/* Chat Application */}
          <ChatContainer />
        </div>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default App
