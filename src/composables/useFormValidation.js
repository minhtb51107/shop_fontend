// src/composables/useFormValidation.js
import { ref, reactive, computed } from 'vue'

export function useFormValidation(initialData = {}) {
  // Reactive data
  const formData = reactive({ ...initialData })
  const validationErrors = reactive({})
  const isSubmitting = ref(false)
  const isValidating = ref(false)

  // Computed
  const hasErrors = computed(() => {
    return Object.keys(validationErrors).some(key => 
      validationErrors[key] && validationErrors[key].length > 0
    )
  })

  const isValid = computed(() => {
    return !hasErrors.value && Object.keys(formData).length > 0
  })

  // Validation rules
  const rules = {
    required: (value, message = 'Trường này là bắt buộc') => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return message
      }
      return true
    },

    email: (value, message = 'Email không hợp lệ') => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || message
    },

    phone: (value, message = 'Số điện thoại không hợp lệ') => {
      if (!value) return true
      const phoneRegex = /^[0-9+\-\s()]+$/
      return phoneRegex.test(value) || message
    },

    minLength: (min, message) => (value) => {
      if (!value) return true
      return value.length >= min || (message || `Tối thiểu ${min} ký tự`)
    },

    maxLength: (max, message) => (value) => {
      if (!value) return true
      return value.length <= max || (message || `Tối đa ${max} ký tự`)
    },

    min: (min, message) => (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= min || (message || `Giá trị tối thiểu là ${min}`)
    },

    max: (max, message) => (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue <= max || (message || `Giá trị tối đa là ${max}`)
    },

    pattern: (regex, message) => (value) => {
      if (!value) return true
      return regex.test(value) || message
    },

    url: (value, message = 'URL không hợp lệ') => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return message
      }
    },

    date: (value, message = 'Ngày không hợp lệ') => {
      if (!value) return true
      const date = new Date(value)
      return !isNaN(date.getTime()) || message
    },

    custom: (validator, message) => (value) => {
      if (!value) return true
      const result = validator(value)
      return result === true || (message || 'Giá trị không hợp lệ')
    }
  }

  // Methods
  const validateField = (fieldName, value, fieldRules = []) => {
    const errors = []
    
    for (const rule of fieldRules) {
      let result
      
      if (typeof rule === 'function') {
        result = rule(value)
      } else if (typeof rule === 'object' && rule.rule) {
        result = rule.rule(value, rule.message)
      } else if (typeof rule === 'string') {
        result = rules[rule](value)
      }
      
      if (result !== true) {
        errors.push(result)
      }
    }
    
    validationErrors[fieldName] = errors
    return errors.length === 0
  }

  const validateForm = (validationSchema = {}) => {
    isValidating.value = true
    let isFormValid = true
    
    // Clear previous errors
    Object.keys(validationErrors).forEach(key => {
      validationErrors[key] = []
    })
    
    // Validate each field
    Object.keys(validationSchema).forEach(fieldName => {
      const fieldRules = validationSchema[fieldName]
      const fieldValue = formData[fieldName]
      
      const isFieldValid = validateField(fieldName, fieldValue, fieldRules)
      if (!isFieldValid) {
        isFormValid = false
      }
    })
    
    isValidating.value = false
    return isFormValid
  }

  const validateAsync = async (validationSchema = {}) => {
    isValidating.value = true
    
    try {
      // Clear previous errors
      Object.keys(validationErrors).forEach(key => {
        validationErrors[key] = []
      })
      
      let isFormValid = true
      
      // Validate each field
      for (const fieldName of Object.keys(validationSchema)) {
        const fieldRules = validationSchema[fieldName]
        const fieldValue = formData[fieldName]
        
        // Handle async rules
        const asyncRules = fieldRules.filter(rule => 
          typeof rule === 'function' && rule.constructor.name === 'AsyncFunction'
        )
        
        const syncRules = fieldRules.filter(rule => 
          typeof rule === 'function' && rule.constructor.name !== 'AsyncFunction'
        )
        
        // Validate sync rules first
        const isFieldValid = validateField(fieldName, fieldValue, syncRules)
        if (!isFieldValid) {
          isFormValid = false
        }
        
        // Validate async rules
        for (const asyncRule of asyncRules) {
          try {
            const result = await asyncRule(fieldValue)
            if (result !== true) {
              validationErrors[fieldName] = validationErrors[fieldName] || []
              validationErrors[fieldName].push(result)
              isFormValid = false
            }
          } catch (error) {
            validationErrors[fieldName] = validationErrors[fieldName] || []
            validationErrors[fieldName].push('Lỗi xác thực')
            isFormValid = false
          }
        }
      }
      
      isValidating.value = false
      return isFormValid
    } catch (error) {
      isValidating.value = false
      throw error
    }
  }

  const setFieldError = (fieldName, error) => {
    validationErrors[fieldName] = Array.isArray(error) ? error : [error]
  }

  const clearFieldError = (fieldName) => {
    validationErrors[fieldName] = []
  }

  const clearAllErrors = () => {
    Object.keys(validationErrors).forEach(key => {
      validationErrors[key] = []
    })
  }

  const setFieldValue = (fieldName, value) => {
    formData[fieldName] = value
  }

  const getFieldValue = (fieldName) => {
    return formData[fieldName]
  }

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName]?.[0] || ''
  }

  const hasFieldError = (fieldName) => {
    return validationErrors[fieldName] && validationErrors[fieldName].length > 0
  }

  const resetForm = (newData = {}) => {
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
    Object.assign(formData, newData)
    clearAllErrors()
    isSubmitting.value = false
    isValidating.value = false
  }

  const submitForm = async (submitFn, validationSchema = {}) => {
    if (isSubmitting.value) return false
    
    isSubmitting.value = true
    
    try {
      // Validate form first
      const isFormValid = await validateAsync(validationSchema)
      
      if (!isFormValid) {
        isSubmitting.value = false
        return false
      }
      
      // Submit form
      const result = await submitFn(formData)
      isSubmitting.value = false
      return result
    } catch (error) {
      isSubmitting.value = false
      throw error
    }
  }

  // Async validation rules
  const asyncRules = {
    uniqueEmail: (message = 'Email đã tồn tại') => async (value) => {
      if (!value) return true
      
      try {
        // Simulate API call
        const response = await fetch(`/api/check-email?email=${encodeURIComponent(value)}`)
        const data = await response.json()
        
        return !data.exists || message
      } catch {
        return 'Lỗi kiểm tra email'
      }
    },

    uniquePhone: (message = 'Số điện thoại đã tồn tại') => async (value) => {
      if (!value) return true
      
      try {
        // Simulate API call
        const response = await fetch(`/api/check-phone?phone=${encodeURIComponent(value)}`)
        const data = await response.json()
        
        return !data.exists || message
      } catch {
        return 'Lỗi kiểm tra số điện thoại'
      }
    }
  }

  return {
    // Data
    formData,
    validationErrors,
    isSubmitting,
    isValidating,
    
    // Computed
    hasErrors,
    isValid,
    
    // Rules
    rules: { ...rules, ...asyncRules },
    
    // Methods
    validateField,
    validateForm,
    validateAsync,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setFieldValue,
    getFieldValue,
    getFieldError,
    hasFieldError,
    resetForm,
    submitForm
  }
}

export default useFormValidation

