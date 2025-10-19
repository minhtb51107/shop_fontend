import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('btn')
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    
    variants.forEach(variant => {
      const wrapper = mount(Button, {
        props: { variant },
        slots: { default: 'Button' }
      })
      
      expect(wrapper.classes()).toContain(`btn-${variant}`)
    })
  })

  it('renders with different sizes', () => {
    const sizes = ['sm', 'lg']
    
    sizes.forEach(size => {
      const wrapper = mount(Button, {
        props: { size },
        slots: { default: 'Button' }
      })
      
      expect(wrapper.classes()).toContain(`btn-${size}`)
    })
  })

  it('renders as different HTML elements', () => {
    const wrapper = mount(Button, {
      props: { tag: 'a' },
      slots: { default: 'Link Button' }
    })
    
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.classes()).toContain('btn')
  })

  it('shows loading state', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Loading' }
    })
    
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
    expect(wrapper.find('.spinner-border-sm').exists()).toBe(true)
  })

  it('is disabled when loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Loading' }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Disabled' }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click event when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Disabled' }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click event when loading', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Loading' }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('applies custom classes', () => {
    const wrapper = mount(Button, {
      props: { class: 'custom-class' },
      slots: { default: 'Custom' }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('applies custom styles', () => {
    const wrapper = mount(Button, {
      props: { style: { color: 'red' } },
      slots: { default: 'Styled' }
    })
    
    expect(wrapper.attributes('style')).toContain('color: red')
  })
})
