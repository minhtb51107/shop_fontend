// src/plugins/vuetify.js

import 'vuetify/styles' // Import styles của Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labsComponents from 'vuetify/labs/components' // Import components từ labs
import { aliases, mdi } from 'vuetify/iconsets/mdi' // Import icon set Material Design Icons
import '@mdi/font/css/materialdesignicons.css' // Import CSS cho icons

// Bạn có thể tùy chỉnh theme tại đây
const lightTheme = {
  dark: false,
  colors: {
    primary: '#1976D2', // Blue
    secondary: '#424242', // Grey dark
    accent: '#82B1FF', // Blue light
    error: '#FF5252', // Red
    info: '#2196F3', // Blue info
    success: '#4CAF50', // Green
    warning: '#FB8C00', // Orange
    background: '#FFFFFF', // White background
    surface: '#FFFFFF', // White surface for cards, etc.
  },
}

const darkTheme = {
    dark: true,
    colors: {
        primary: '#2196F3', // Blue for dark theme
        secondary: '#757575', // Grey medium
        accent: '#FF4081', // Pink accent
        error: '#FF5252', // Red
        info: '#2196F3', // Blue info
        success: '#4CAF50', // Green
        warning: '#FFC107', // Amber warning
        background: '#121212', // Very dark grey
        surface: '#1E1E1E', // Dark grey for surfaces
    },
}

const vuetify = createVuetify({
  components: { // Gộp components và labsComponents
    ...components,
    ...labsComponents,
  },
  directives,
  theme: {
    defaultTheme: 'light', // Chọn theme mặc định (light hoặc dark)
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  icons: { // Cấu hình icon set
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

export default vuetify