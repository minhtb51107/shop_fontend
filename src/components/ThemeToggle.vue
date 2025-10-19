<template>
  <div class="theme-toggle" :class="{ 'theme-toggle-expanded': expanded }">
    <!-- Toggle Button -->
    <button 
      class="toggle-button"
      @click="toggleExpanded"
      :title="toggleTitle"
    >
      <i :class="themeIcon"></i>
    </button>

    <!-- Theme Panel -->
    <transition name="theme-panel">
      <div v-if="expanded" class="theme-panel">
        <div class="panel-header">
          <h3>Cài đặt giao diện</h3>
          <button class="btn-close" @click="expanded = false">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="panel-body">
          <!-- Theme Mode -->
          <div class="setting-group">
            <label class="setting-label">Chế độ hiển thị</label>
            <div class="mode-options">
              <button 
                v-for="mode in themeModes" 
                :key="mode.value"
                class="mode-option"
                :class="{ active: themeStore.mode === mode.value }"
                @click="themeStore.setMode(mode.value)"
              >
                <i :class="mode.icon"></i>
                <span>{{ mode.label }}</span>
              </button>
            </div>
          </div>

          <!-- Color Scheme -->
          <div class="setting-group">
            <label class="setting-label">Màu chủ đạo</label>
            <div class="color-picker">
              <input 
                type="color" 
                :value="themeStore.primaryColor"
                @input="themeStore.setPrimaryColor($event.target.value)"
                class="color-input"
              >
              <span class="color-label">{{ themeStore.primaryColor }}</span>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">Màu phụ</label>
            <div class="color-picker">
              <input 
                type="color" 
                :value="themeStore.secondaryColor"
                @input="themeStore.setSecondaryColor($event.target.value)"
                class="color-input"
              >
              <span class="color-label">{{ themeStore.secondaryColor }}</span>
            </div>
          </div>

          <!-- Font Size -->
          <div class="setting-group">
            <label class="setting-label">Kích thước chữ</label>
            <div class="font-size-options">
              <button 
                v-for="size in fontSizes" 
                :key="size.value"
                class="font-size-option"
                :class="{ active: themeStore.fontSize === size.value }"
                @click="themeStore.setFontSize(size.value)"
              >
                <span :style="{ fontSize: size.preview }">{{ size.label }}</span>
              </button>
            </div>
          </div>

          <!-- Font Family -->
          <div class="setting-group">
            <label class="setting-label">Font chữ</label>
            <div class="font-family-options">
              <button 
                v-for="family in fontFamilies" 
                :key="family.value"
                class="font-family-option"
                :class="{ active: themeStore.fontFamily === family.value }"
                @click="themeStore.setFontFamily(family.value)"
                :style="{ fontFamily: family.style }"
              >
                {{ family.label }}
              </button>
            </div>
          </div>

          <!-- Accessibility -->
          <div class="setting-group">
            <label class="setting-label">Trợ năng</label>
            <div class="accessibility-options">
              <label class="checkbox-option">
                <input 
                  type="checkbox" 
                  :checked="themeStore.animationsEnabled"
                  @change="themeStore.toggleAnimations()"
                >
                <span>Hiệu ứng chuyển động</span>
              </label>
              <label class="checkbox-option">
                <input 
                  type="checkbox" 
                  :checked="themeStore.reducedMotion"
                  @change="themeStore.toggleReducedMotion()"
                >
                <span>Giảm chuyển động</span>
              </label>
            </div>
          </div>

          <!-- Preset Themes -->
          <div class="setting-group">
            <label class="setting-label">Chủ đề có sẵn</label>
            <div class="preset-themes">
              <button 
                v-for="preset in presetThemes" 
                :key="preset.name"
                class="preset-theme"
                @click="applyPreset(preset)"
                :title="preset.description"
              >
                <div class="preset-preview" :style="preset.preview"></div>
                <span>{{ preset.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <button class="btn-reset" @click="resetTheme">
            <i class="bi bi-arrow-clockwise me-2"></i>
            Đặt lại
          </button>
          <button class="btn-export" @click="exportTheme">
            <i class="bi bi-download me-2"></i>
            Xuất
          </button>
        </div>
      </div>
    </transition>

    <!-- Overlay -->
    <div 
      v-if="expanded" 
      class="theme-overlay" 
      @click="expanded = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Reactive data
const expanded = ref(false)

// Computed
const themeIcon = computed(() => {
  if (themeStore.mode === 'dark') return 'bi bi-moon-fill'
  if (themeStore.mode === 'light') return 'bi bi-sun-fill'
  return 'bi bi-circle-half'
})

const toggleTitle = computed(() => {
  const mode = themeStore.mode
  if (mode === 'dark') return 'Chế độ tối'
  if (mode === 'light') return 'Chế độ sáng'
  return 'Chế độ tự động'
})

// Theme modes
const themeModes = [
  { value: 'light', label: 'Sáng', icon: 'bi bi-sun' },
  { value: 'dark', label: 'Tối', icon: 'bi bi-moon' },
  { value: 'auto', label: 'Tự động', icon: 'bi bi-circle-half' }
]

// Font sizes
const fontSizes = [
  { value: 'small', label: 'Nhỏ', preview: '12px' },
  { value: 'medium', label: 'Vừa', preview: '16px' },
  { value: 'large', label: 'Lớn', preview: '20px' }
]

// Font families
const fontFamilies = [
  { value: 'system', label: 'Hệ thống', style: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { value: 'serif', label: 'Serif', style: '"Times New Roman", Times, serif' },
  { value: 'mono', label: 'Monospace', style: '"Courier New", Courier, monospace' }
]

// Preset themes
const presetThemes = [
  {
    name: 'Mặc định',
    description: 'Chủ đề mặc định của hệ thống',
    preview: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: 'Xanh lá',
    description: 'Chủ đề màu xanh lá cây',
    preview: 'background: linear-gradient(135deg, #28a745 0%, #20c997 100%)'
  },
  {
    name: 'Cam',
    description: 'Chủ đề màu cam',
    preview: 'background: linear-gradient(135deg, #fd7e14 0%, #ffc107 100%)'
  },
  {
    name: 'Đỏ',
    description: 'Chủ đề màu đỏ',
    preview: 'background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)'
  },
  {
    name: 'Tím',
    description: 'Chủ đề màu tím',
    preview: 'background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)'
  },
  {
    name: 'Xanh dương',
    description: 'Chủ đề màu xanh dương',
    preview: 'background: linear-gradient(135deg, #007bff 0%, #17a2b8 100%)'
  }
]

// Methods
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const applyPreset = (preset) => {
  switch (preset.name) {
    case 'Mặc định':
      themeStore.setPrimaryColor('#667eea')
      themeStore.setSecondaryColor('#764ba2')
      break
    case 'Xanh lá':
      themeStore.setPrimaryColor('#28a745')
      themeStore.setSecondaryColor('#20c997')
      break
    case 'Cam':
      themeStore.setPrimaryColor('#fd7e14')
      themeStore.setSecondaryColor('#ffc107')
      break
    case 'Đỏ':
      themeStore.setPrimaryColor('#dc3545')
      themeStore.setSecondaryColor('#e83e8c')
      break
    case 'Tím':
      themeStore.setPrimaryColor('#6f42c1')
      themeStore.setSecondaryColor('#e83e8c')
      break
    case 'Xanh dương':
      themeStore.setPrimaryColor('#007bff')
      themeStore.setSecondaryColor('#17a2b8')
      break
  }
}

const resetTheme = () => {
  themeStore.resetTheme()
  expanded.value = false
}

const exportTheme = () => {
  const themeData = themeStore.exportTheme()
  const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'theme-settings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  z-index: 1000;
}

.toggle-button {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.theme-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 350px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transform: translateX(100%);
}

.theme-toggle-expanded .theme-panel {
  transform: translateX(0);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.btn-close {
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.2);
}

.panel-body {
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.mode-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.mode-option:hover {
  background: #f8f9fa;
}

.mode-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.mode-option i {
  font-size: 1.1rem;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
}

.color-label {
  font-family: monospace;
  font-size: 0.9rem;
  color: #6c757d;
}

.font-size-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.font-size-option {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.font-size-option:hover {
  background: #f8f9fa;
}

.font-size-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.font-family-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.font-family-option {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.font-family-option:hover {
  background: #f8f9fa;
}

.font-family-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.accessibility-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.preset-themes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.preset-theme {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-theme:hover {
  background: #f8f9fa;
}

.preset-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.panel-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.btn-reset,
.btn-export {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-reset:hover {
  background: #f8f9fa;
}

.btn-export:hover {
  background: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.theme-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: -1;
}

/* Transitions */
.theme-panel-enter-active,
.theme-panel-leave-active {
  transition: all 0.3s ease;
}

.theme-panel-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.theme-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .theme-panel {
    background: #2c3e50;
  }
  
  .panel-header {
    background: #495057;
    border-bottom-color: #6c757d;
  }
  
  .panel-header h3 {
    color: white;
  }
  
  .btn-close {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .btn-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .setting-label {
    color: white;
  }
  
  .mode-option,
  .font-size-option,
  .font-family-option,
  .preset-theme {
    background: #495057;
    border-color: #6c757d;
    color: white;
  }
  
  .mode-option:hover,
  .font-size-option:hover,
  .font-family-option:hover,
  .preset-theme:hover {
    background: #6c757d;
  }
  
  .color-label {
    color: #adb5bd;
  }
  
  .panel-footer {
    background: #495057;
    border-top-color: #6c757d;
  }
  
  .btn-reset,
  .btn-export {
    background: #495057;
    border-color: #6c757d;
    color: white;
  }
  
  .btn-reset:hover {
    background: #6c757d;
  }
  
  .btn-export:hover {
    background: #3d4f63;
    border-color: #1976d2;
    color: #1976d2;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .theme-toggle {
    right: 1rem;
  }
  
  .theme-panel {
    width: 300px;
  }
  
  .panel-header,
  .panel-body,
  .panel-footer {
    padding: 1rem;
  }
  
  .preset-themes {
    grid-template-columns: 1fr;
  }
  
  .panel-footer {
    flex-direction: column;
  }
}
</style>
