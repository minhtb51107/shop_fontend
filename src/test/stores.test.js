import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useI18nStore } from '@/stores/i18n'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const authStore = useAuthStore()
    
    expect(authStore.user).toBeNull()
    expect(authStore.token).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })

  it('sets user and token on login', () => {
    const authStore = useAuthStore()
    const user = { id: 1, email: 'test@example.com', fullname: 'Test User' }
    const token = 'test-token'
    
    authStore.setUser(user)
    authStore.setToken(token)
    
    expect(authStore.user).toEqual(user)
    expect(authStore.token).toBe(token)
    expect(authStore.isAuthenticated).toBe(true)
  })

  it('clears user and token on logout', () => {
    const authStore = useAuthStore()
    const user = { id: 1, email: 'test@example.com', fullname: 'Test User' }
    const token = 'test-token'
    
    authStore.setUser(user)
    authStore.setToken(token)
    
    authStore.logout()
    
    expect(authStore.user).toBeNull()
    expect(authStore.token).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })

  it('performs mock login', async () => {
    const authStore = useAuthStore()
    
    await authStore.login('admin@shop.com', 'password')
    
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.user).toBeDefined()
    expect(authStore.user.email).toBe('admin@shop.com')
  })
})

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default theme', () => {
    const themeStore = useThemeStore()
    
    expect(themeStore.isDarkMode).toBe(false)
    expect(themeStore.currentTheme).toBe('light')
  })

  it('toggles theme', () => {
    const themeStore = useThemeStore()
    
    themeStore.toggleTheme()
    
    expect(themeStore.isDarkMode).toBe(true)
    expect(themeStore.currentTheme).toBe('dark')
  })

  it('sets theme from localStorage', () => {
    const themeStore = useThemeStore()
    
    localStorage.setItem('theme', 'dark')
    themeStore.initializeTheme()
    
    expect(themeStore.isDarkMode).toBe(true)
  })

  it('saves theme to localStorage', () => {
    const themeStore = useThemeStore()
    
    themeStore.toggleTheme()
    
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})

describe('I18n Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default locale', () => {
    const i18nStore = useI18nStore()
    
    expect(i18nStore.locale).toBe('vi')
    expect(i18nStore.availableLocales).toHaveLength(2)
  })

  it('sets locale', () => {
    const i18nStore = useI18nStore()
    
    i18nStore.setLocale('en')
    
    expect(i18nStore.locale).toBe('en')
    expect(i18nStore.currentLocale.code).toBe('en')
  })

  it('gets locale flag', () => {
    const i18nStore = useI18nStore()
    
    expect(i18nStore.getLocaleFlag('vi')).toBe('🇻🇳')
    expect(i18nStore.getLocaleFlag('en')).toBe('🇺🇸')
  })

  it('gets locale name', () => {
    const i18nStore = useI18nStore()
    
    expect(i18nStore.getLocaleName('vi')).toBe('Tiếng Việt')
    expect(i18nStore.getLocaleName('en')).toBe('English')
  })

  it('saves locale to localStorage', () => {
    const i18nStore = useI18nStore()
    
    i18nStore.setLocale('en')
    
    expect(localStorage.getItem('locale')).toBe('en')
  })

  it('initializes locale from localStorage', () => {
    const i18nStore = useI18nStore()
    
    localStorage.setItem('locale', 'en')
    i18nStore.initializeLocale()
    
    expect(i18nStore.locale).toBe('en')
  })
})
