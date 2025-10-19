import { createI18n } from 'vue-i18n'
import vi from '../locales/vi/index.js'
import en from '../locales/en/index.js'

const messages = {
  vi,
  en
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'vi', // Default locale
  fallbackLocale: 'en', // Fallback locale
  messages,
  globalInjection: true, // Enable global $t
  silentTranslationWarn: true, // Disable translation warnings
  silentFallbackWarn: true, // Disable fallback warnings
  missingWarn: false, // Disable missing translation warnings
  fallbackWarn: false // Disable fallback warnings
})

export default i18n
