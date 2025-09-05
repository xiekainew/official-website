<template>
  <nav class="navigation" :class="{ 'navigation--scrolled': isScrolled }">
    <div class="navigation__container">
      <!-- Logo -->
      <router-link to="/" class="navigation__logo">
        <div class="logo-text">
          <span class="logo-text__first">Tech</span>
          <span class="logo-text__second">Playground</span>
        </div>
      </router-link>
      
      <!-- Desktop Menu -->
      <ul class="navigation__menu">
        <li class="navigation__item" v-for="route in routes" :key="route.name">
          <router-link 
            :to="route.path" 
            class="navigation__link"
            :class="{ 'navigation__link--active': $route.name === route.name }"
          >
            <span class="navigation__link-text">{{ route.label }}</span>
            <span class="navigation__link-underline"></span>
          </router-link>
        </li>
      </ul>
      
      <!-- Theme Toggle -->
      <button 
        class="navigation__theme-toggle" 
        @click="themeStore.toggleTheme()"
        :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <svg v-if="!isDark" class="theme-icon" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
        <svg v-else class="theme-icon" viewBox="0 0 24 24">
          <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
        </svg>
      </button>
      
      <!-- Mobile Menu Toggle -->
      <button 
        class="navigation__mobile-toggle"
        @click="toggleMobileMenu"
        :class="{ 'navigation__mobile-toggle--active': isMobileMenuOpen }"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <div class="navigation__mobile-menu" :class="{ 'navigation__mobile-menu--open': isMobileMenuOpen }">
      <ul class="navigation__mobile-list">
        <li v-for="route in routes" :key="route.name">
          <router-link 
            :to="route.path" 
            class="navigation__mobile-link"
            @click="closeMobileMenu"
          >
            {{ route.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const routes = [
  { name: 'Home', path: '/', label: '首页' },
  { name: 'About', path: '/about', label: '关于我' },
  { name: 'Projects', path: '/projects', label: '项目展示' },
  { name: 'TechPlayground', path: '/playground', label: '技术实验' },
  { name: 'Blog', path: '/blog', label: '技术博客' },
  { name: 'Contact', path: '/contact', label: '联系我' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(var(--bg-color-rgb), 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &--scrolled {
    background: rgba(var(--bg-color-rgb), 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  &__logo {
    text-decoration: none;
    z-index: 1001;
  }
  
  .logo-text {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 700;
    
    &__first {
      color: var(--primary-color);
    }
    
    &__second {
      color: var(--text-color);
      margin-left: 0.25rem;
    }
  }
  
  &__menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  &__item {
    position: relative;
  }
  
  &__link {
    position: relative;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    padding: 0.5rem 0;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
      
      .navigation__link-underline {
        transform: scaleX(1);
      }
    }
    
    &--active {
      color: var(--primary-color);
      
      .navigation__link-underline {
        transform: scaleX(1);
      }
    }
  }
  
  &__link-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--primary-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &__theme-toggle {
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(var(--text-color-rgb), 0.1);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-left: 1rem;
    
    &:hover {
      background: rgba(var(--primary-color-rgb), 0.1);
      transform: scale(1.1);
    }
    
    .theme-icon {
      width: 20px;
      height: 20px;
      fill: var(--text-color);
      transition: fill 0.3s ease;
    }
    
    @media (max-width: 768px) {
      margin-left: 0;
      margin-right: 1rem;
    }
  }
  
  &__mobile-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;
    
    @media (max-width: 768px) {
      display: flex;
    }
    
    .hamburger-line {
      width: 100%;
      height: 3px;
      background: var(--text-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
    }
    
    &--active {
      .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }
      
      .hamburger-line:nth-child(2) {
        opacity: 0;
      }
      
      .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(8px, -8px);
      }
    }
  }
  
  &__mobile-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-color);
    border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &--open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
  
  &__mobile-list {
    list-style: none;
    margin: 0;
    padding: 1rem 2rem 2rem;
  }
  
  &__mobile-link {
    display: block;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(var(--border-color-rgb), 0.1);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
