import { vi } from 'vitest'

// Expose controls to tests via globalThis
if (!(globalThis as any).__mlcMockControl__) {
  (globalThis as any).__mlcMockControl__ = {
    delayPerToken: 5, // ms
    shouldError: false,
    replyText: 'This is a mocked streaming reply.',
  }
}

// Mock @mlc-ai/web-llm for Node test environment with controllable streaming behavior
vi.mock('@mlc-ai/web-llm', () => {
  const prebuiltAppConfig = {
    model_list: [],
  }

  class MLCEngine {
    ready: Promise<void>
    chat: any
    constructor() {
      // ready resolves immediately in tests
      this.ready = Promise.resolve()
      this.chat = {
        completions: {
          create: async function* () {
            const control = (globalThis as any).__mlcMockControl__
            const reply = control?.replyText ?? 'mock reply'

            if (control?.shouldError) {
              throw new Error('Mocked LLM error')
            }

            // Yield tokens with a small delay to simulate streaming
            for (const ch of reply) {
              // Respect fake timers in vitest by awaiting a promise that uses setTimeout
              await new Promise((res) => setTimeout(res, control?.delayPerToken ?? 5))
              yield { choices: [{ delta: { content: ch } }] }
            }
          },
        },
      }
    }
    async reload(_modelId: string) {
      return
    }
    async terminate() {
      return
    }
    async unload() {
      return
    }
  }

  const CreateMLCEngine = async (_modelId: string) => {
    return new MLCEngine()
  }

  const deleteModelAllInfoInCache = async (_modelId: string) => {
    return
  }

  return { MLCEngine, CreateMLCEngine, deleteModelAllInfoInCache, prebuiltAppConfig }
})

// Silence expected console.error messages during tests that are caused by mocked LLM errors
const originalConsoleError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  try {
    const msg = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
    if (msg.includes('Mocked LLM error') || msg.includes('Error in chat:')) {
      // ignore expected mock error noise
      return
    }
  } catch (_) {
    // fall through
  }
  originalConsoleError(...args)
}

