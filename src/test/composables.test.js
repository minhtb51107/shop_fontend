import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { usePerformance } from '@/composables/usePerformance'

describe('useFormValidation Composable', () => {
  it('validates required fields', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('name', '', { required: true })
    
    expect(errors.value.name).toBe('Trường này là bắt buộc')
  })

  it('validates email format', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('email', 'invalid-email', { email: true })
    
    expect(errors.value.email).toBe('Email không hợp lệ')
  })

  it('validates minimum length', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('password', '123', { minLength: 8 })
    
    expect(errors.value.password).toBe('Tối thiểu 8 ký tự')
  })

  it('validates maximum length', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('name', 'a'.repeat(101), { maxLength: 100 })
    
    expect(errors.value.name).toBe('Tối đa 100 ký tự')
  })

  it('validates numeric values', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('age', 'abc', { numeric: true })
    
    expect(errors.value.age).toBe('Chỉ được nhập số')
  })

  it('validates positive numbers', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('price', '-10', { positive: true })
    
    expect(errors.value.price).toBe('Phải là số dương')
  })

  it('validates all fields', () => {
    const { validateAll, errors } = useFormValidation()
    
    const fields = {
      name: { value: '', rules: { required: true } },
      email: { value: 'invalid', rules: { email: true } }
    }
    
    validateAll(fields)
    
    expect(errors.value.name).toBe('Trường này là bắt buộc')
    expect(errors.value.email).toBe('Email không hợp lệ')
  })

  it('clears errors when validation passes', () => {
    const { validateField, errors } = useFormValidation()
    
    validateField('name', 'John Doe', { required: true })
    
    expect(errors.value.name).toBeUndefined()
  })
})

describe('usePerformance Composable', () => {
  it('provides performance utilities', () => {
    const {
      isOnline,
      connectionSpeed,
      memoryUsage,
      debounce,
      throttle,
      lazyLoadImage,
      preloadResource,
      measurePerformance
    } = usePerformance()
    
    expect(typeof isOnline.value).toBe('boolean')
    expect(typeof connectionSpeed.value).toBe('string')
    expect(typeof debounce).toBe('function')
    expect(typeof throttle).toBe('function')
    expect(typeof lazyLoadImage).toBe('function')
    expect(typeof preloadResource).toBe('function')
    expect(typeof measurePerformance).toBe('function')
  })

  it('debounces function calls', async () => {
    const { debounce } = usePerformance()
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)
    
    debouncedFn()
    debouncedFn()
    debouncedFn()
    
    expect(mockFn).not.toHaveBeenCalled()
    
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('throttles function calls', async () => {
    const { throttle } = usePerformance()
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)
    
    throttledFn()
    throttledFn()
    throttledFn()
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    
    await new Promise(resolve => setTimeout(resolve, 150))
    
    throttledFn()
    
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('measures performance', () => {
    const { measurePerformance } = usePerformance()
    
    const result = measurePerformance('test', () => {
      return 'test result'
    })
    
    expect(result).toBe('test result')
  })

  it('measures async performance', async () => {
    const { measurePerformance } = usePerformance()
    
    const result = await measurePerformance('async-test', async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
      return 'async result'
    })
    
    expect(result).toBe('async result')
  })
})
