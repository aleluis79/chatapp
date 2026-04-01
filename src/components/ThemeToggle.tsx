import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-yellow-100 text-yellow-600 shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Light theme"
        title="Light theme"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-slate-700 text-blue-400 shadow' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-200 shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="System theme"
        title="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  )
}
