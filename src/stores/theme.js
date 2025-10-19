// src/stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // Theme mode
    mode: localStorage.getItem('theme-mode') || 'light', // 'light', 'dark', 'auto'
    
    // Color scheme
    primaryColor: localStorage.getItem('theme-primary-color') || '#667eea',
    secondaryColor: localStorage.getItem('theme-secondary-color') || '#764ba2',
    
    // Layout preferences
    sidebarCollapsed: localStorage.getItem('theme-sidebar-collapsed') === 'true',
    sidebarWidth: parseInt(localStorage.getItem('theme-sidebar-width')) || 280,
    
    // Typography
    fontSize: localStorage.getItem('theme-font-size') || 'medium', // 'small', 'medium', 'large'
    fontFamily: localStorage.getItem('theme-font-family') || 'system',
    
    // Animations
    animationsEnabled: localStorage.getItem('theme-animations-enabled') !== 'false',
    reducedMotion: localStorage.getItem('theme-reduced-motion') === 'true',
    
    // Custom CSS variables
    customVariables: JSON.parse(localStorage.getItem('theme-custom-variables') || '{}')
  }),

  getters: {
    // Check if dark mode is active
    isDarkMode: (state) => {
      if (state.mode === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return state.mode === 'dark'
    },

    // Get current theme class for body
    themeClass: (state) => {
      const classes = []
      
      if (state.mode === 'dark' || (state.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        classes.push('dark-theme')
      } else {
        classes.push('light-theme')
      }
      
      if (state.fontSize !== 'medium') {
        classes.push(`font-size-${state.fontSize}`)
      }
      
      if (state.fontFamily !== 'system') {
        classes.push(`font-family-${state.fontFamily}`)
      }
      
      if (!state.animationsEnabled) {
        classes.push('no-animations')
      }
      
      if (state.reducedMotion) {
        classes.push('reduced-motion')
      }
      
      return classes.join(' ')
    },

    // Get CSS custom properties
    cssVariables: (state) => {
      return {
        '--primary-color': state.primaryColor,
        '--secondary-color': state.secondaryColor,
        '--sidebar-width': `${state.sidebarWidth}px`,
        '--font-size-base': state.fontSize === 'small' ? '14px' : state.fontSize === 'large' ? '18px' : '16px',
        '--font-family': state.fontFamily === 'system' ? 
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' :
          state.fontFamily === 'serif' ?
          '"Times New Roman", Times, serif' :
          '"Courier New", Courier, monospace',
        ...state.customVariables
      }
    }
  },

  actions: {
    // Set theme mode
    setMode(mode) {
      this.mode = mode
      localStorage.setItem('theme-mode', mode)
      this.applyTheme()
    },

    // Toggle between light and dark mode
    toggleMode() {
      if (this.mode === 'auto') {
        this.setMode('light')
      } else if (this.mode === 'light') {
        this.setMode('dark')
      } else {
        this.setMode('auto')
      }
    },

    // Set primary color
    setPrimaryColor(color) {
      this.primaryColor = color
      localStorage.setItem('theme-primary-color', color)
      this.applyTheme()
    },

    // Set secondary color
    setSecondaryColor(color) {
      this.secondaryColor = color
      localStorage.setItem('theme-secondary-color', color)
      this.applyTheme()
    },

    // Set sidebar collapsed state
    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
      localStorage.setItem('theme-sidebar-collapsed', collapsed.toString())
    },

    // Set sidebar width
    setSidebarWidth(width) {
      this.sidebarWidth = width
      localStorage.setItem('theme-sidebar-width', width.toString())
      this.applyTheme()
    },

    // Set font size
    setFontSize(size) {
      this.fontSize = size
      localStorage.setItem('theme-font-size', size)
      this.applyTheme()
    },

    // Set font family
    setFontFamily(family) {
      this.fontFamily = family
      localStorage.setItem('theme-font-family', family)
      this.applyTheme()
    },

    // Toggle animations
    toggleAnimations() {
      this.animationsEnabled = !this.animationsEnabled
      localStorage.setItem('theme-animations-enabled', this.animationsEnabled.toString())
      this.applyTheme()
    },

    // Toggle reduced motion
    toggleReducedMotion() {
      this.reducedMotion = !this.reducedMotion
      localStorage.setItem('theme-reduced-motion', this.reducedMotion.toString())
      this.applyTheme()
    },

    // Set custom CSS variable
    setCustomVariable(name, value) {
      this.customVariables[name] = value
      localStorage.setItem('theme-custom-variables', JSON.stringify(this.customVariables))
      this.applyTheme()
    },

    // Remove custom CSS variable
    removeCustomVariable(name) {
      delete this.customVariables[name]
      localStorage.setItem('theme-custom-variables', JSON.stringify(this.customVariables))
      this.applyTheme()
    },

    // Apply theme to document
    applyTheme() {
      const body = document.body
      
      // Remove existing theme classes
      body.classList.remove('light-theme', 'dark-theme', 'no-animations', 'reduced-motion')
      body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
      body.classList.remove('font-family-system', 'font-family-serif', 'font-family-mono')
      
      // Add new theme classes (split by space and add individually)
      body.className = body.className.replace(/\btheme-\S+/g, '')
      const classes = this.themeClass.split(' ')
      classes.forEach(className => {
        if (className) {
          body.classList.add(className)
        }
      })
      
      // Apply CSS variables
      const root = document.documentElement
      Object.entries(this.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.content = this.isDarkMode ? '#2c3e50' : '#ffffff'
      }
    },

    // Reset to default theme
    resetTheme() {
      this.mode = 'light'
      this.primaryColor = '#667eea'
      this.secondaryColor = '#764ba2'
      this.sidebarCollapsed = false
      this.sidebarWidth = 280
      this.fontSize = 'medium'
      this.fontFamily = 'system'
      this.animationsEnabled = true
      this.reducedMotion = false
      this.customVariables = {}
      
      // Clear localStorage
      localStorage.removeItem('theme-mode')
      localStorage.removeItem('theme-primary-color')
      localStorage.removeItem('theme-secondary-color')
      localStorage.removeItem('theme-sidebar-collapsed')
      localStorage.removeItem('theme-sidebar-width')
      localStorage.removeItem('theme-font-size')
      localStorage.removeItem('theme-font-family')
      localStorage.removeItem('theme-animations-enabled')
      localStorage.removeItem('theme-reduced-motion')
      localStorage.removeItem('theme-custom-variables')
      
      this.applyTheme()
    },

    // Initialize theme
    initializeTheme() {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (this.mode === 'auto') {
          this.applyTheme()
        }
      })
      
      // Listen for reduced motion preference
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      motionQuery.addEventListener('change', (e) => {
        if (e.matches && !this.reducedMotion) {
          this.reducedMotion = true
          this.applyTheme()
        }
      })
      
      // Apply initial theme
      this.applyTheme()
    },

    // Export theme settings
    exportTheme() {
      return {
        mode: this.mode,
        primaryColor: this.primaryColor,
        secondaryColor: this.secondaryColor,
        sidebarCollapsed: this.sidebarCollapsed,
        sidebarWidth: this.sidebarWidth,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        animationsEnabled: this.animationsEnabled,
        reducedMotion: this.reducedMotion,
        customVariables: this.customVariables
      }
    },

    // Import theme settings
    importTheme(settings) {
      if (settings.mode) this.mode = settings.mode
      if (settings.primaryColor) this.primaryColor = settings.primaryColor
      if (settings.secondaryColor) this.secondaryColor = settings.secondaryColor
      if (settings.sidebarCollapsed !== undefined) this.sidebarCollapsed = settings.sidebarCollapsed
      if (settings.sidebarWidth) this.sidebarWidth = settings.sidebarWidth
      if (settings.fontSize) this.fontSize = settings.fontSize
      if (settings.fontFamily) this.fontFamily = settings.fontFamily
      if (settings.animationsEnabled !== undefined) this.animationsEnabled = settings.animationsEnabled
      if (settings.reducedMotion !== undefined) this.reducedMotion = settings.reducedMotion
      if (settings.customVariables) this.customVariables = settings.customVariables
      
      this.applyTheme()
    }
  }
})
