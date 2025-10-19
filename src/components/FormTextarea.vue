<template>
  <div class="form-textarea-group" :class="{ 'has-error': hasError, 'has-success': hasSuccess }">
    <label v-if="label" class="form-label" :for="textareaId">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="textarea-wrapper">
      <textarea
        :id="textareaId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :rows="rows"
        :cols="cols"
        class="form-textarea"
        :class="textareaClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.enter="handleEnter"
      ></textarea>
    </div>
    
    <div v-if="hint && !hasError" class="textarea-hint">
      {{ hint }}
    </div>
    
    <div v-if="hasError" class="textarea-error">
      <i class="bi bi-exclamation-circle me-1"></i>
      {{ errorMessage }}
    </div>
    
    <div v-if="hasSuccess" class="textarea-success">
      <i class="bi bi-check-circle me-1"></i>
      {{ successMessage }}
    </div>
    
    <div v-if="showCharacterCount" class="character-count">
      {{ characterCount }}/{{ maxLength }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
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
  rows: {
    type: Number,
    default: 3
  },
  cols: {
    type: Number,
    default: null
  },
  showCharacterCount: {
    type: Boolean,
    default: false
  },
  autoResize: {
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
const validationErrors = ref([])

// Computed
const textareaId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)

const textareaClasses = computed(() => ({
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

  // Length validations
  if (value && value.toString().trim() !== '') {
    if (props.maxLength && value.length > props.maxLength) {
      errors.push(props.validation.maxLength || `Tối đa ${props.maxLength} ký tự`)
    }
  }

  // Custom validations
  if (props.validation.custom) {
    const customResult = props.validation.custom(value)
    if (customResult !== true) {
      errors.push(customResult || 'Giá trị không hợp lệ')
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
  
  // Auto resize
  if (props.autoResize) {
    autoResize(event.target)
  }
  
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

const autoResize = (textarea) => {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
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
    const textarea = document.getElementById(textareaId.value)
    if (textarea) {
      textarea.focus()
    }
  },
  blur: () => {
    const textarea = document.getElementById(textareaId.value)
    if (textarea) {
      textarea.blur()
    }
  }
})
</script>

<style scoped>
.form-textarea-group {
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

.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-textarea:readonly {
  background: #f8f9fa;
  color: #495057;
}

.textarea-hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.textarea-error {
  font-size: 0.8rem;
  color: #dc3545;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.textarea-success {
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
.has-error .form-textarea {
  border-color: #dc3545;
}

.has-error .form-textarea:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

/* Success state */
.has-success .form-textarea {
  border-color: #28a745;
}

.has-success .form-textarea:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-label {
    color: white;
  }
  
  .form-textarea {
    background: #2c3e50;
    border-color: #495057;
    color: white;
  }
  
  .form-textarea:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  .form-textarea:disabled {
    background: #495057;
    color: #adb5bd;
  }
  
  .form-textarea:readonly {
    background: #495057;
    color: #e9ecef;
  }
  
  .textarea-hint {
    color: #adb5bd;
  }
  
  .character-count {
    color: #adb5bd;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-textarea {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>

