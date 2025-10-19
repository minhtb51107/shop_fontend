<template>
  <div class="form-input-group" :class="{ 'has-error': hasError, 'has-success': hasSuccess }">
    <label v-if="label" class="form-label" :for="inputId">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-wrapper">
      <div v-if="prefixIcon" class="input-prefix">
        <i :class="prefixIcon"></i>
      </div>
      
      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        class="form-input"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.enter="handleEnter"
      />
      
      <div v-if="suffixIcon" class="input-suffix">
        <i :class="suffixIcon"></i>
      </div>
      
      <button
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="password-toggle"
        @click="togglePassword"
      >
        <i :class="passwordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
      </button>
    </div>
    
    <div v-if="hint && !hasError" class="input-hint">
      {{ hint }}
    </div>
    
    <div v-if="hasError" class="input-error">
      <i class="bi bi-exclamation-circle me-1"></i>
      {{ errorMessage }}
    </div>
    
    <div v-if="hasSuccess" class="input-success">
      <i class="bi bi-check-circle me-1"></i>
      {{ successMessage }}
    </div>
    
    <div v-if="showCharacterCount" class="character-count">
      {{ characterCount }}/{{ maxLength }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number,
    default: null
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  step: {
    type: Number,
    default: null
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  showPasswordToggle: {
    type: Boolean,
    default: true
  },
  showCharacterCount: {
    type: Boolean,
    default: false
  },
  validation: {
    type: Object,
    default: () => ({})
  },
  validateOnBlur: {
    type: Boolean,
    default: true
  },
  validateOnInput: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'enter', 'validation-change'])

// Reactive data
const isFocused = ref(false)
const isTouched = ref(false)
const passwordVisible = ref(false)
const validationErrors = ref([])

// Computed
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputType = computed(() => {
  if (props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const inputClasses = computed(() => ({
  'has-prefix': !!props.prefixIcon,
  'has-suffix': !!props.suffixIcon,
  'has-error': hasError.value,
  'has-success': hasSuccess.value,
  'is-focused': isFocused.value,
  'is-disabled': props.disabled,
  'is-readonly': props.readonly
}))

const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

const hasError = computed(() => validationErrors.value.length > 0)
const hasSuccess = computed(() => !hasError.value && isTouched.value && props.modelValue)

const errorMessage = computed(() => {
  return validationErrors.value[0] || ''
})

const successMessage = computed(() => {
  if (props.validation.successMessage) {
    return props.validation.successMessage
  }
  return 'Hợp lệ'
})

// Methods
const validate = () => {
  const errors = []
  const value = props.modelValue

  // Required validation
  if (props.required && (!value || value.toString().trim() === '')) {
    errors.push(props.validation.required || 'Trường này là bắt buộc')
  }

  // Type-specific validations
  if (value && value.toString().trim() !== '') {
    switch (props.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors.push(props.validation.email || 'Email không hợp lệ')
        }
        break
      
      case 'tel':
        const phoneRegex = /^[0-9+\-\s()]+$/
        if (!phoneRegex.test(value)) {
          errors.push(props.validation.tel || 'Số điện thoại không hợp lệ')
        }
        break
      
      case 'url':
        try {
          new URL(value)
        } catch {
          errors.push(props.validation.url || 'URL không hợp lệ')
        }
        break
      
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(props.validation.number || 'Số không hợp lệ')
        } else {
          const numValue = Number(value)
          if (props.min !== null && numValue < props.min) {
            errors.push(props.validation.min || `Giá trị tối thiểu là ${props.min}`)
          }
          if (props.max !== null && numValue > props.max) {
            errors.push(props.validation.max || `Giá trị tối đa là ${props.max}`)
          }
        }
        break
    }

    // Custom validations
    if (props.validation.custom) {
      const customResult = props.validation.custom(value)
      if (customResult !== true) {
        errors.push(customResult || 'Giá trị không hợp lệ')
      }
    }

    // Length validations
    if (props.maxLength && value.toString().length > props.maxLength) {
      errors.push(props.validation.maxLength || `Tối đa ${props.maxLength} ký tự`)
    }
  }

  validationErrors.value = errors
  emit('validation-change', {
    isValid: errors.length === 0,
    errors: errors
  })

  return errors.length === 0
}

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  
  if (props.validateOnInput) {
    validate()
  }
}

const handleBlur = (event) => {
  isFocused.value = false
  isTouched.value = true
  
  if (props.validateOnBlur) {
    validate()
  }
  
  emit('blur', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleEnter = (event) => {
  emit('enter', event)
}

const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value
}

// Watch for external validation changes
watch(() => props.validation, () => {
  if (isTouched.value) {
    validate()
  }
}, { deep: true })

// Expose validation method
defineExpose({
  validate,
  focus: () => {
    const input = document.getElementById(inputId.value)
    if (input) {
      input.focus()
    }
  },
  blur: () => {
    const input = document.getElementById(inputId.value)
    if (input) {
      input.blur()
    }
  }
})
</script>

<style scoped>
.form-input-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.required-mark {
  color: #dc3545;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-input:readonly {
  background: #f8f9fa;
  color: #495057;
}

.form-input.has-prefix {
  padding-left: 2.5rem;
}

.form-input.has-suffix {
  padding-right: 2.5rem;
}

.input-prefix,
.input-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  z-index: 2;
}

.input-prefix {
  left: 0.75rem;
}

.input-suffix {
  right: 0.75rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: #495057;
  background: rgba(0, 0, 0, 0.05);
}

.input-hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.input-error {
  font-size: 0.8rem;
  color: #dc3545;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.input-success {
  font-size: 0.8rem;
  color: #28a745;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.character-count {
  font-size: 0.8rem;
  color: #6c757d;
  text-align: right;
  margin-top: 0.25rem;
}

/* Error state */
.has-error .form-input {
  border-color: #dc3545;
}

.has-error .form-input:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

/* Success state */
.has-success .form-input {
  border-color: #28a745;
}

.has-success .form-input:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-label {
    color: white;
  }
  
  .form-input {
    background: #2c3e50;
    border-color: #495057;
    color: white;
  }
  
  .form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  .form-input:disabled {
    background: #495057;
    color: #adb5bd;
  }
  
  .form-input:readonly {
    background: #495057;
    color: #e9ecef;
  }
  
  .input-prefix,
  .input-suffix {
    color: #adb5bd;
  }
  
  .password-toggle {
    color: #adb5bd;
  }
  
  .password-toggle:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .input-hint {
    color: #adb5bd;
  }
  
  .character-count {
    color: #adb5bd;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-input {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .form-input.has-prefix {
    padding-left: 2.75rem;
  }
  
  .form-input.has-suffix {
    padding-right: 2.75rem;
  }
  
  .input-prefix {
    left: 0.875rem;
  }
  
  .input-suffix {
    right: 0.875rem;
  }
  
  .password-toggle {
    right: 0.875rem;
  }
}
</style>

