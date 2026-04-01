import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LLMService, llmService } from '../services/LLMService'

describe('LLMService', () => {
  let service: LLMService

  beforeEach(() => {
    service = new LLMService()
    vi.clearAllMocks()
  })

  it('should initialize with default model', async () => {
    expect(service.isInitialized()).toBe(false)
    expect(service.getCurrentModel()).toBe('Qwen2.5-0.5B-Instruct-q4f32_1-MLC')
  })

  it('should return available models', () => {
    const models = LLMService.getAvailableModels()
    expect(models).toBeInstanceOf(Array)
    expect(models.length).toBeGreaterThan(0)
    expect(models).toContain('Qwen2.5-0.5B-Instruct-q4f32_1-MLC')
  })

  it('should return model presets', () => {
    const presets = LLMService.getModelPresets()
    expect(presets).toBeDefined()
    expect(presets['Qwen2.5-0.5B-Instruct-q4f32_1-MLC']).toBeDefined()
    expect(presets['Qwen2.5-0.5B-Instruct-q4f32_1-MLC']).toContain('Muy rapido')
  })

  it('should track current model', () => {
    const models = LLMService.getAvailableModels()
    expect(models.length).toBeGreaterThan(0)
    expect(service.getCurrentModel()).toBe('Qwen2.5-0.5B-Instruct-q4f32_1-MLC')
  })

  it('should have singleton-like behavior', () => {
    expect(llmService).toBeDefined()
    expect(llmService).toBeInstanceOf(LLMService)
  })
})
