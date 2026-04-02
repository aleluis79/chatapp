import { CreateMLCEngine, MLCEngine, deleteModelAllInfoInCache, prebuiltAppConfig } from '@mlc-ai/web-llm'

export type ModelId = 
  | 'Qwen2.5-0.5B-Instruct-q4f32_1-MLC'
  | 'Phi-3-mini-4k-instruct-q4f32_1-MLC'
  | 'mistral-7b-instruct-v0p2-q4f16_1-MLC'
  | 'Llama-3.1-8B-Instruct-q4f32_1-MLC'

const MODEL_PRESETS: Record<ModelId, string> = {
  'Qwen2.5-0.5B-Instruct-q4f32_1-MLC': 'Qwen 2.5 - Muy rapido, modelo ligero',
  'Phi-3-mini-4k-instruct-q4f32_1-MLC': 'Phi-3 Mini - Rápido y competente',
  'mistral-7b-instruct-v0p2-q4f16_1-MLC': 'Mistral-7B - Más potente (requiere más recursos)',
  'Llama-3.1-8B-Instruct-q4f32_1-MLC': 'Llama 3.1 - Modelo avanzado (requiere más recursos)',
}

export interface LLMMessage {
  role: 'user' | 'assistant'
  content: string
}

export class LLMService {
  private engine: MLCEngine | null = null
  private currentModel: ModelId = 'Qwen2.5-0.5B-Instruct-q4f32_1-MLC'
  private initialized = false
  private initializationPromise: Promise<void> | null = null
  private readonly appConfig = {
    ...prebuiltAppConfig,
    model_list: [...prebuiltAppConfig.model_list],
    useIndexedDBCache: true,
  }

  private isDuplicateCacheEntryError(error: unknown): boolean {
    return error instanceof Error && error.message.includes("Entry already exists")
  }

  private async clearBrowserCaches(): Promise<void> {
    if (typeof caches === 'undefined') {
      return
    }

    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
  }

  private async clearModelArtifacts(modelId: ModelId): Promise<void> {
    await deleteModelAllInfoInCache(modelId, this.appConfig)
    await this.clearBrowserCaches()
  }

  private async createAndLoadEngine(modelId: ModelId): Promise<void> {
    // Limpiar engine anterior si existe
    if (this.engine) {
      try {
        await this.engine.unload()
      } catch {
        // Ignorar errores al terminar
      }
      this.engine = null
      this.initialized = false
    }

    this.currentModel = modelId

    console.log(`Loading model: ${modelId}`)
    this.engine = await CreateMLCEngine(modelId, { appConfig: this.appConfig })

    this.initialized = true
    console.log(`Model loaded successfully: ${modelId}`)
  }

  async initialize(modelId: ModelId = this.currentModel): Promise<void> {
    // Siempre serializa inicializaciones para evitar carreras entre descargas/model reload.
    if (this.initializationPromise) {
      await this.initializationPromise
    }

    // Si ya está inicializado con el mismo modelo, retorna
    if (this.initialized && this.engine && this.currentModel === modelId) {
      return
    }

    this.initializationPromise = (async () => {
      try {
        await this.createAndLoadEngine(modelId)
      } catch (error) {
        if (this.isDuplicateCacheEntryError(error)) {
          console.warn('Cache conflict detected. Clearing model artifacts and retrying once.')
          await this.clearModelArtifacts(modelId)
          await this.createAndLoadEngine(modelId)
          return
        }

        this.initialized = false
        this.engine = null
        console.error('Error initializing LLM:', error)
        throw error
      }
    })()

    try {
      await this.initializationPromise
    } finally {
      this.initializationPromise = null
    }
  }

  async chat(
    messages: LLMMessage[],
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.engine || !this.initialized) {
      throw new Error('LLM not initialized')
    }

    let response = ''

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const asyncChunkGenerator = await (this.engine as any).chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 512,
        stream: true,
      })

      for await (const chunk of asyncChunkGenerator) {
        const token = chunk.choices[0].delta.content || ''
        response += token
        onToken?.(token)
      }
    } catch (error) {
      console.error('Error in chat:', error)
      throw error
    }

    return response
  }

  async cleanup(): Promise<void> {
    if (this.engine) {
      try {
        await this.engine.unload()
      } catch (error) {
        console.error('Error terminating engine:', error)
      }
      this.engine = null
      this.initialized = false
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  getCurrentModel(): ModelId {
    return this.currentModel
  }

  static getModelPresets(): Record<ModelId, string> {
    return MODEL_PRESETS
  }

  static getAvailableModels(): ModelId[] {
    return Object.keys(MODEL_PRESETS) as ModelId[]
  }
}

export const llmService = new LLMService()
