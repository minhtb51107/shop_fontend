<template>
  <div class="form-select-group" :class="{ 'has-error': hasError, 'has-success': hasSuccess }">
    <label v-if="label" class="form-label" :for="selectId">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="select-wrapper">
      <div v-if="prefixIcon" class="select-prefix">
        <i :class="prefixIcon"></i>
      </div>
      
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="form-select"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
          :disabled="getOptionDisabled(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      
      <div class="select-arrow">
        <i class="bi bi-chevron-down"></i>
      </div>
    </div>
    
    <div v-if="hint && !hasError" class="select-hint">
      {{ hint }}
    </div>
    
    <div v-if="hasError" class="select-error">
      <i class="bi bi-exclamation-circle me-1"></i>
      {{ errorMessage }}
    </div>
    
    <div v-if="hasSuccess" class="select-success">
      <i class="bi bi-check-circle me-1"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
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
  options: {
    type: Array,
    default: () => []
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionDisabled: {
    type: String,
    default: 'disabled'
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  validation: {
    type: Object,
    default: () => ({})
  },
  validateOnBlur: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus', 'validation-change'])

// Reactive data
const isFocused = ref(false)
const isTouched = ref(false)
const validationErrors = ref([])

// Computed
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectClasses = computed(() => ({
  'has-prefix': !!props.prefixIcon,
  'has-error': hasError.value,
  'has-success': hasSuccess.value,
  'is-focused': isFocused.value,
  'is-disabled': props.disabled
}))

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
const getOptionValue = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionValue]
}

const getOptionLabel = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionLabel]
}

const getOptionDisabled = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return false
  }
  return option[props.optionDisabled] || false
}

const validate = () => {
  const errors = []
  const value = props.modelValue

  // Required validation
  if (props.required && (!value || value.toString().trim() === '')) {
    errors.push(props.validation.required || 'Trường này là bắt buộc')
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

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
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
    const select = document.getElementById(selectId.value)
    if (select) {
      select.focus()
    }
  },
  blur: () => {
    const select = document.getElementById(selectId.value)
    if (select) {
      select.blur()
    }
  }
})
</script>

<style scoped>
.form-select-group {
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

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-select.has-prefix {
  padding-left: 2.5rem;
}

.select-prefix {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
  z-index: 2;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 2;
}

.select-hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.select-error {
  font-size: 0.8rem;
  color: #dc3545;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.select-success {
  font-size: 0.8rem;
  color: #28a745;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

/* Error state */
.has-error .form-select {
  border-color: #dc3545;
}

.has-error .form-select:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

/* Success state */
.has-success .form-select {
  border-color: #28a745;
}

.has-success .form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .form-label {
    color: white;
  }
  
  .form-select {
    background: #2c3e50;
    border-color: #495057;
    color: white;
  }
  
  .form-select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  .form-select:disabled {
    background: #495057;
    color: #adb5bd;
  }
  
  .select-prefix {
    color: #adb5bd;
  }
  
  .select-arrow {
    color: #adb5bd;
  }
  
  .select-hint {
    color: #adb5bd;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-select {
    padding: 0.875rem 2.75rem 0.875rem 1rem;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .form-select.has-prefix {
    padding-left: 2.75rem;
  }
  
  .select-prefix {
    left: 0.875rem;
  }
  
  .select-arrow {
    right: 0.875rem;
  }
}
</style>

