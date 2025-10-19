import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref('vi')
  const availableLocales = ref([
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ])

  const currentLocale = computed(() => {
    return availableLocales.value.find(l => l.code === locale.value) || availableLocales.value[0]
  })

  const setLocale = (newLocale) => {
    if (availableLocales.value.some(l => l.code === newLocale)) {
      locale.value = newLocale
      localStorage.setItem('locale', newLocale)
      
      // Update document language
      document.documentElement.lang = newLocale
    }
  }

  const initializeLocale = () => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && availableLocales.value.some(l => l.code === savedLocale)) {
      setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLocale = navigator.language.split('-')[0]
      if (availableLocales.value.some(l => l.code === browserLocale)) {
        setLocale(browserLocale)
      } else {
        setLocale('vi') // Default to Vietnamese
      }
    }
  }

  const getLocaleFlag = (localeCode) => {
    const locale = availableLocales.value.find(l => l.code === localeCode)
    return locale ? locale.flag : '🌐'
  }

  const getLocaleName = (localeCode) => {
    const locale = availableLocales.value.find(l => l.code === localeCode)
    return locale ? locale.name : localeCode
  }

  return {
    locale,
    availableLocales,
    currentLocale,
    setLocale,
    initializeLocale,
    getLocaleFlag,
    getLocaleName
  }
})
