<template>
  <div id="app" :data-theme="themeStore.isDark ? 'dark' : 'light'">
    <Navigation />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <div v-if="Component" :key="route.path">
            <Suspense>
              <template #default>
                <component :is="Component" />
              </template>
              <template #fallback>
                <div class="page-loading">
                  <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p class="loading-text">正在加载页面...</p>
                  </div>
                </div>
              </template>
            </Suspense>
          </div>
        </transition>
      </router-view>
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

// 页面加载状态
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

.loading-text {
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>
