import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const primaryColor = ref('#007acc')
  
  const theme = computed(() => ({
    mode: isDark.value ? 'dark' : 'light',
    primary: primaryColor.value,
    background: isDark.value ? '#0a0a0a' : '#ffffff',
    surface: isDark.value ? '#1a1a1a' : '#f5f5f5',
    text: isDark.value ? '#ffffff' : '#333333',
    textSecondary: isDark.value ? '#cccccc' : '#666666'
  }))
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }
  
  const setTheme = (dark) => {
    isDark.value = dark
  }
  
  const setPrimaryColor = (color) => {
    primaryColor.value = color
  }
  
  return {
    isDark,
    primaryColor,
    theme,
    toggleTheme,
    setTheme,
    setPrimaryColor
  }
})
