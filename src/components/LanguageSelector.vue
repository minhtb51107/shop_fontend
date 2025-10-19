<template>
  <div class="language-selector">
    <div class="dropdown">
      <button 
        class="btn btn-outline-light dropdown-toggle d-flex align-items-center"
        type="button" 
        id="languageDropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        <span class="me-2">{{ currentLocale.flag }}</span>
        <span class="d-none d-md-inline">{{ currentLocale.name }}</span>
      </button>
      
      <ul class="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="languageDropdown">
        <li v-for="locale in availableLocales" :key="locale.code">
          <a 
            class="dropdown-item d-flex align-items-center" 
            href="#" 
            @click.prevent="setLocale(locale.code)"
            :class="{ 'active': locale.code === currentLocale.code }"
          >
            <span class="me-2">{{ locale.flag }}</span>
            <span>{{ locale.name }}</span>
            <i v-if="locale.code === currentLocale.code" class="bi bi-check ms-auto text-primary"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nStore } from '@/stores/i18n'

const { locale } = useI18n()
const i18nStore = useI18nStore()

const availableLocales = computed(() => i18nStore.availableLocales)
const currentLocale = computed(() => i18nStore.currentLocale)

const setLocale = (localeCode) => {
  i18nStore.setLocale(localeCode)
  locale.value = localeCode
}
</script>

<style scoped>
.language-selector .dropdown-toggle {
  border: 1px solid var(--border-color);
  background-color: var(--button-light-bg);
  color: var(--button-light-color);
  transition: all 0.3s ease;
}

.language-selector .dropdown-toggle:hover {
  background-color: var(--button-light-hover-bg);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.language-selector .dropdown-menu {
  border: none;
  box-shadow: var(--dropdown-shadow);
  background-color: var(--dropdown-bg);
  min-width: 180px;
}

.language-selector .dropdown-item {
  color: var(--dropdown-item-color);
  transition: all 0.2s ease;
  padding: 0.75rem 1rem;
}

.language-selector .dropdown-item:hover {
  background-color: var(--dropdown-item-hover-bg);
  color: var(--primary-color);
}

.language-selector .dropdown-item.active {
  background-color: var(--primary-color);
  color: white;
}

.language-selector .dropdown-item.active:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Dark mode adjustments */
.dark-mode .language-selector .dropdown-toggle {
  border-color: var(--dark-border-color);
  background-color: var(--dark-button-light-bg);
  color: var(--dark-button-light-color);
}

.dark-mode .language-selector .dropdown-toggle:hover {
  background-color: var(--dark-button-light-hover-bg);
  color: var(--dark-primary-color);
  border-color: var(--dark-primary-color);
}

.dark-mode .language-selector .dropdown-menu {
  box-shadow: var(--dark-dropdown-shadow);
  background-color: var(--dark-dropdown-bg);
}

.dark-mode .language-selector .dropdown-item {
  color: var(--dark-dropdown-item-color);
}

.dark-mode .language-selector .dropdown-item:hover {
  background-color: var(--dark-dropdown-item-hover-bg);
  color: var(--dark-primary-color);
}

.dark-mode .language-selector .dropdown-item.active {
  background-color: var(--dark-primary-color);
  color: white;
}

.dark-mode .language-selector .dropdown-item.active:hover {
  background-color: var(--dark-primary-color);
  color: white;
}
</style>
