import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '@/components/Modal.vue'

describe('Modal Component', () => {
  it('renders when show prop is true', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal'
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal').exists()).toBe(true)
    expect(wrapper.find('.modal-title').text()).toBe('Test Modal')
    expect(wrapper.find('.modal-body').text()).toBe('Modal content')
  })

  it('does not render when show prop is false', () => {
    const wrapper = mount(Modal, {
      props: {
        show: false,
        title: 'Test Modal'
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal').exists()).toBe(false)
  })

  it('renders with different sizes', () => {
    const sizes = ['sm', 'lg', 'xl']
    
    sizes.forEach(size => {
      const wrapper = mount(Modal, {
        props: {
          show: true,
          title: 'Test Modal',
          size
        },
        slots: {
          default: 'Modal content'
        }
      })
      
      expect(wrapper.find('.modal-dialog').classes()).toContain(`modal-${size}`)
    })
  })

  it('renders with centered alignment when centered prop is true', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        centered: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal-dialog').classes()).toContain('modal-dialog-centered')
  })

  it('renders with scrollable content when scrollable prop is true', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        scrollable: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal-dialog').classes()).toContain('modal-dialog-scrollable')
  })

  it('renders with header slot', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal'
      },
      slots: {
        header: 'Custom Header',
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal-header').text()).toBe('Custom Header')
  })

  it('renders with footer slot', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal'
      },
      slots: {
        default: 'Modal content',
        footer: 'Custom Footer'
      }
    })
    
    expect(wrapper.find('.modal-footer').text()).toBe('Custom Footer')
  })

  it('renders with default footer when showFooter is true', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        showFooter: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal-footer').exists()).toBe(true)
    expect(wrapper.find('.btn-secondary').text()).toBe('Cancel')
    expect(wrapper.find('.btn-primary').text()).toBe('Save')
  })

  it('does not render footer when showFooter is false', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        showFooter: false
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal-footer').exists()).toBe(false)
  })

  it('renders with custom footer buttons', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        showFooter: true,
        cancelText: 'Close',
        confirmText: 'OK'
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.btn-secondary').text()).toBe('Close')
    expect(wrapper.find('.btn-primary').text()).toBe('OK')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal'
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    const closeButton = wrapper.find('.btn-close')
    await closeButton.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when backdrop is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        closeOnBackdrop: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    const backdrop = wrapper.find('.modal-backdrop')
    await backdrop.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close event when backdrop is clicked and closeOnBackdrop is false', async () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        closeOnBackdrop: false
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    const backdrop = wrapper.find('.modal-backdrop')
    await backdrop.trigger('click')
    
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('emits confirm event when confirm button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        showFooter: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    const confirmButton = wrapper.find('.btn-primary')
    await confirmButton.trigger('click')
    
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        showFooter: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    const cancelButton = wrapper.find('.btn-secondary')
    await cancelButton.trigger('click')
    
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('renders with loading state', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        loading: true
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.find('.modal-loading').exists()).toBe(true)
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
  })

  it('renders with custom classes', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        class: 'custom-class'
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('renders with custom styles', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
        style: { backgroundColor: 'red' }
      },
      slots: {
        default: 'Modal content'
      }
    })
    
    expect(wrapper.attributes('style')).toContain('background-color: red')
  })
})
