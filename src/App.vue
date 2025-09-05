<template>
  <div id="app" :data-theme="themeStore.isDark ? 'dark' : 'light'">
    <Navigation />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const route = useRoute()

// 更新页面标题
watch(() => route.meta?.title, (newTitle) => {
  if (newTitle) {
    document.title = newTitle
  }
}, { immediate: true })

// 初始化主题
onMounted(() => {
  // 检测系统主题偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  themeStore.setTheme(prefersDark)
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    themeStore.setTheme(e.matches)
  })
})
</script>

<style lang="scss">
@use '@/styles/global.scss';

#app {
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
  transition: all var(--transition-normal);
}

.main-content {
  padding-top: 70px; // Navigation height
  min-height: calc(100vh - 70px);
}

// 页面切换动画
.router-link-active {
  color: var(--primary-color);
}

// 全局动画
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
