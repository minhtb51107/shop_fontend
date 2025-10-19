import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormInput from '@/components/FormInput.vue'

describe('FormInput Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label'
      }
    })
    
    expect(wrapper.find('label').text()).toBe('Test Label')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders with different input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url']
    
    types.forEach(type => {
      const wrapper = mount(FormInput, {
        props: {
          modelValue: '',
          label: 'Test Label',
          type
        }
      })
      
      expect(wrapper.find('input').attributes('type')).toBe(type)
    })
  })

  it('renders with placeholder', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        placeholder: 'Enter text here'
      }
    })
    
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text here')
  })

  it('renders with help text', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        helpText: 'This is help text'
      }
    })
    
    expect(wrapper.find('.form-text').text()).toBe('This is help text')
  })

  it('renders with error message', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        error: 'This is an error'
      }
    })
    
    expect(wrapper.find('.invalid-feedback').text()).toBe('This is an error')
    expect(wrapper.find('input').classes()).toContain('is-invalid')
  })

  it('renders as required when required prop is true', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        required: true
      }
    })
    
    expect(wrapper.find('input').attributes('required')).toBeDefined()
    expect(wrapper.find('label').classes()).toContain('required')
  })

  it('renders as disabled when disabled prop is true', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        disabled: true
      }
    })
    
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('renders as readonly when readonly prop is true', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        readonly: true
      }
    })
    
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('renders with different sizes', () => {
    const sizes = ['sm', 'lg']
    
    sizes.forEach(size => {
      const wrapper = mount(FormInput, {
        props: {
          modelValue: '',
          label: 'Test Label',
          size
        }
      })
      
      expect(wrapper.find('input').classes()).toContain(`form-control-${size}`)
    })
  })

  it('renders with prepend icon', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        prependIcon: 'bi-envelope'
      }
    })
    
    expect(wrapper.find('.input-group-text').exists()).toBe(true)
    expect(wrapper.find('.bi-envelope').exists()).toBe(true)
  })

  it('renders with append icon', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        appendIcon: 'bi-eye'
      }
    })
    
    expect(wrapper.find('.input-group-text').exists()).toBe(true)
    expect(wrapper.find('.bi-eye').exists()).toBe(true)
  })

  it('emits update:modelValue when input value changes', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label'
      }
    })
    
    const input = wrapper.find('input')
    await input.setValue('test value')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
  })

  it('emits focus event when input is focused', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label'
      }
    })
    
    const input = wrapper.find('input')
    await input.trigger('focus')
    
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('emits blur event when input loses focus', async () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label'
      }
    })
    
    const input = wrapper.find('input')
    await input.trigger('blur')
    
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('renders with custom classes', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        class: 'custom-class'
      }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('renders with custom styles', () => {
    const wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Test Label',
        style: { color: 'red' }
      }
    })
    
    expect(wrapper.attributes('style')).toContain('color: red')
  })
})
