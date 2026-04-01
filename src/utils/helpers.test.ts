import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatTime,
  debounce,
  truncate,
  generateId,
  safeJsonParse,
} from './helpers'

describe('helpers utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-03-31T00:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('2026')
      expect(formatted).toBeTruthy()
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2026-03-31T14:30:45')
      const formatted = formatTime(date)
      expect(formatted).toContain(':')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0
      const fn = () => {
        callCount++
      }
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(callCount).toBe(0)

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(callCount).toBe(1)
    })
  })

  describe('truncate', () => {
    it('should truncate text longer than max length', () => {
      const text = 'Hello World'
      const truncated = truncate(text, 5)
      expect(truncated).toBe('Hello...')
    })

    it('should not truncate text shorter than max length', () => {
      const text = 'Hello'
      const truncated = truncate(text, 10)
      expect(truncated).toBe('Hello')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const json = '{"name":"test"}'
      const parsed = safeJsonParse(json, {})
      expect(parsed).toEqual({ name: 'test' })
    })

    it('should return default value on invalid JSON', () => {
      const json = '{invalid}'
      const defaultValue = { name: 'default' }
      const parsed = safeJsonParse(json, defaultValue)
      expect(parsed).toEqual(defaultValue)
    })
  })
})
