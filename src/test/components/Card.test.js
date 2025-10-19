import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '@/components/Card.vue'

describe('Card Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'Card content'
      }
    })
    
    expect(wrapper.text()).toBe('Card content')
    expect(wrapper.classes()).toContain('card')
  })

  it('renders with title', () => {
    const wrapper = mount(Card, {
      props: { title: 'Card Title' },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.find('.card-title').text()).toBe('Card Title')
  })

  it('renders with subtitle', () => {
    const wrapper = mount(Card, {
      props: { 
        title: 'Card Title',
        subtitle: 'Card Subtitle'
      },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.find('.card-subtitle').text()).toBe('Card Subtitle')
  })

  it('renders with header slot', () => {
    const wrapper = mount(Card, {
      slots: {
        header: 'Custom Header',
        default: 'Card content'
      }
    })
    
    expect(wrapper.find('.card-header').text()).toBe('Custom Header')
  })

  it('renders with footer slot', () => {
    const wrapper = mount(Card, {
      slots: {
        default: 'Card content',
        footer: 'Custom Footer'
      }
    })
    
    expect(wrapper.find('.card-footer').text()).toBe('Custom Footer')
  })

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    
    variants.forEach(variant => {
      const wrapper = mount(Card, {
        props: { variant },
        slots: { default: 'Card content' }
      })
      
      expect(wrapper.classes()).toContain(`card-${variant}`)
    })
  })

  it('renders with different sizes', () => {
    const sizes = ['sm', 'lg']
    
    sizes.forEach(size => {
      const wrapper = mount(Card, {
        props: { size },
        slots: { default: 'Card content' }
      })
      
      expect(wrapper.classes()).toContain(`card-${size}`)
    })
  })

  it('renders with hover effect when hoverable', () => {
    const wrapper = mount(Card, {
      props: { hoverable: true },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.classes()).toContain('card-hoverable')
  })

  it('renders with shadow when shadow prop is true', () => {
    const wrapper = mount(Card, {
      props: { shadow: true },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.classes()).toContain('card-shadow')
  })

  it('renders with border when borderless is false', () => {
    const wrapper = mount(Card, {
      props: { borderless: false },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.classes()).toContain('card-border')
  })

  it('does not render border when borderless is true', () => {
    const wrapper = mount(Card, {
      props: { borderless: true },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.classes()).not.toContain('card-border')
  })

  it('applies custom classes', () => {
    const wrapper = mount(Card, {
      props: { class: 'custom-class' },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('applies custom styles', () => {
    const wrapper = mount(Card, {
      props: { style: { backgroundColor: 'red' } },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.attributes('style')).toContain('background-color: red')
  })

  it('renders with loading state', () => {
    const wrapper = mount(Card, {
      props: { loading: true },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.find('.card-loading').exists()).toBe(true)
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
  })

  it('renders with empty state', () => {
    const wrapper = mount(Card, {
      props: { empty: true },
      slots: { default: 'Card content' }
    })
    
    expect(wrapper.find('.card-empty').exists()).toBe(true)
  })
})
