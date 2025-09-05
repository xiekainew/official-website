<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero__container">
        <!-- 3D背景画布 -->
        <canvas ref="heroCanvas" class="hero__canvas"></canvas>
        
        <!-- 主要内容 -->
        <div class="hero__content">
          <div class="hero__text">
            <h1 class="hero__title">
              <span class="hero__greeting">你好，我是</span>
              <span class="hero__name gradient-text">前端工程师</span>
            </h1>
            
            <div class="hero__subtitle">
              <TypewriterText 
                :texts="typewriterTexts"
                :speed="100"
                :pause="2000"
                class="hero__typewriter"
              />
            </div>
            
            <p class="hero__description">
              专注于创建美观、高性能的现代Web应用。
              热衷于探索前端技术的无限可能，
              将创意与技术完美结合。
            </p>
            
            <div class="hero__actions">
              <button 
                class="hero__cta-primary btn-primary"
                @click="scrollToProjects"
              >
                <span>查看我的作品</span>
                <svg class="cta-icon" viewBox="0 0 24 24">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                </svg>
              </button>
              
              <button 
                class="hero__cta-secondary"
                @click="scrollToAbout"
              >
                <span>了解更多</span>
                <svg class="scroll-icon" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 浮动元素 -->
          <div class="hero__floating-elements">
            <div class="floating-element floating-element--1">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="floating-element floating-element--2">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l2 2 4-4"/>
              </svg>
            </div>
            <div class="floating-element floating-element--3">
              <svg viewBox="0 0 24 24">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- 滚动指示器 -->
        <div class="hero__scroll-indicator" @click="scrollToAbout">
          <div class="scroll-indicator__line"></div>
          <div class="scroll-indicator__text">滚动探索</div>
          <div class="scroll-indicator__arrow">
            <svg viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 技能预览区域 -->
    <section class="skills-preview">
      <div class="container">
        <h2 class="skills-preview__title">核心技术栈</h2>
        <div class="skills-preview__grid">
          <SkillCard 
            v-for="skill in coreSkills" 
            :key="skill.name"
            :skill="skill"
            class="skill-card"
          />
        </div>
      </div>
    </section>
    
    <!-- 快速导航 -->
    <section class="quick-nav">
      <div class="container">
        <div class="quick-nav__grid">
          <router-link 
            v-for="navItem in quickNavItems" 
            :key="navItem.name"
            :to="navItem.path"
            class="quick-nav__item"
          >
            <div class="quick-nav__icon">
              <component :is="navItem.icon" />
            </div>
            <h3 class="quick-nav__title">{{ navItem.title }}</h3>
            <p class="quick-nav__description">{{ navItem.description }}</p>
            <div class="quick-nav__arrow">
              <svg viewBox="0 0 24 24">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import * as THREE from 'three'
import TypewriterText from '@/components/TypewriterText.vue'
import SkillCard from '@/components/SkillCard.vue'

// 响应式数据
const heroCanvas = ref(null)
let scene, camera, renderer, particles

// 打字机文本
const typewriterTexts = [
  '创造卓越的用户体验',
  '探索前端技术的边界',
  '构建现代化Web应用',
  '用代码实现创意想法'
]

// 核心技能
const coreSkills = [
  {
    name: 'Vue.js',
    icon: 'vue',
    level: 95,
    color: '#4FC08D'
  },
  {
    name: 'React',
    icon: 'react',
    level: 90,
    color: '#61DAFB'
  },
  {
    name: 'TypeScript',
    icon: 'typescript',
    level: 88,
    color: '#3178C6'
  },
  {
    name: 'Three.js',
    icon: 'threejs',
    level: 85,
    color: '#000000'
  },
  {
    name: 'Node.js',
    icon: 'nodejs',
    level: 82,
    color: '#339933'
  },
  {
    name: 'WebGL',
    icon: 'webgl',
    level: 78,
    color: '#990000'
  }
]

// 快速导航
const quickNavItems = [
  {
    name: 'about',
    path: '/about',
    title: '关于我',
    description: '了解我的技能、经历和专业背景',
    icon: 'UserIcon'
  },
  {
    name: 'projects',
    path: '/projects',
    title: '项目展示',
    description: '查看我的精选作品和技术实现',
    icon: 'CodeIcon'
  },
  {
    name: 'playground',
    path: '/playground',
    title: '技术实验',
    description: '体验各种前端技术的创新应用',
    icon: 'BeakerIcon'
  },
  {
    name: 'blog',
    path: '/blog',
    title: '技术博客',
    description: '阅读我的技术分享和学习心得',
    icon: 'DocumentIcon'
  }
]

// 3D粒子背景初始化
const initThreeJS = () => {
  if (!heroCanvas.value) return

  // 场景设置
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ 
    canvas: heroCanvas.value, 
    alpha: true,
    antialias: true
  })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 创建粒子系统
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 5000
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#007acc',
    transparent: true,
    opacity: 0.8
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  camera.position.z = 3

  // 动画循环
  const animate = () => {
    requestAnimationFrame(animate)
    
    particles.rotation.x += 0.0005
    particles.rotation.y += 0.0005
    
    renderer.render(scene, camera)
  }
  
  animate()
}

// 窗口大小调整
const handleResize = () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 滚动到指定区域
const scrollToAbout = () => {
  const aboutSection = document.querySelector('.skills-preview')
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToProjects = () => {
  // 导航到项目页面
  // this.$router.push('/projects')
}

// 页面动画
const initAnimations = () => {
  // GSAP时间线
  const tl = gsap.timeline()
  
  // 标题动画
  tl.from('.hero__greeting', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })
  .from('.hero__name', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero__typewriter', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.hero__description', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero__actions', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out'
  }, '-=0.3')
  
  // 浮动元素动画
  gsap.to('.floating-element--1', {
    duration: 3,
    y: -20,
    rotation: 360,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
  
  gsap.to('.floating-element--2', {
    duration: 4,
    y: -15,
    x: 10,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
  
  gsap.to('.floating-element--3', {
    duration: 5,
    y: -25,
    rotation: -360,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
  
  // 滚动指示器动画
  gsap.to('.scroll-indicator__arrow', {
    duration: 1.5,
    y: 10,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
}

onMounted(() => {
  initThreeJS()
  initAnimations()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.home {
  overflow-x: hidden;
}

.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    @include container;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  
  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    padding: 0 var(--spacing-md);
  }
  
  &__title {
    margin-bottom: var(--spacing-lg);
    
    .hero__greeting {
      display: block;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-normal);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-sm);
    }
    
    .hero__name {
      display: block;
      font-size: var(--font-size-6xl);
      font-weight: var(--font-weight-extrabold);
      line-height: 1.1;
      
      @include respond-to(md) {
        font-size: 4rem;
      }
    }
  }
  
  &__subtitle {
    margin-bottom: var(--spacing-xl);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__typewriter {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-medium);
    color: var(--primary-color);
  }
  
  &__description {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-2xl);
    color: var(--text-secondary);
  }
  
  &__actions {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: center;
    flex-wrap: wrap;
  }
  
  &__cta-primary {
    @include button-primary;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) var(--spacing-xl);
    
    .cta-icon {
      width: 20px;
      height: 20px;
      fill: currentColor;
      transition: transform var(--transition-fast);
    }
    
    &:hover .cta-icon {
      transform: translateX(4px);
    }
  }
  
  &__cta-secondary {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: transparent;
    color: var(--text-color);
    border: 2px solid var(--border-color);
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateY(-2px);
    }
    
    .scroll-icon {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  }
  
  &__floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }
  
  &__scroll-indicator {
    position: absolute;
    bottom: var(--spacing-xl);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: var(--text-secondary);
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--primary-color);
    }
  }
}

.floating-element {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.1;
  
  svg {
    width: 100%;
    height: 100%;
    fill: var(--primary-color);
  }
  
  &--1 {
    top: 20%;
    left: 10%;
  }
  
  &--2 {
    top: 60%;
    right: 15%;
  }
  
  &--3 {
    top: 30%;
    right: 20%;
  }
}

.scroll-indicator {
  &__line {
    width: 2px;
    height: 40px;
    background: var(--border-color);
    margin-bottom: var(--spacing-sm);
  }
  
  &__text {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  
  &__arrow {
    svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  }
}

.skills-preview {
  padding: var(--spacing-3xl) 0;
  background: var(--surface-color);
  
  &__title {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    @include gradient-text;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
    
    @include respond-to(md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.quick-nav {
  padding: var(--spacing-3xl) 0;
  
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    
    @include respond-to(md) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @include respond-to(lg) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  &__item {
    @include card;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    
    &:hover {
      .quick-nav__arrow {
        transform: translateX(4px);
      }
    }
  }
  
  &__icon {
    width: 60px;
    height: 60px;
    background: var(--gradient-primary);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
    
    svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
  }
  
  &__title {
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
  }
  
  &__description {
    color: var(--text-secondary);
    flex-grow: 1;
    margin-bottom: var(--spacing-lg);
  }
  
  &__arrow {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    width: 24px;
    height: 24px;
    opacity: 0.5;
    transition: all var(--transition-fast);
    
    svg {
      width: 100%;
      height: 100%;
      fill: var(--primary-color);
    }
  }
}

// 响应式调整
@include respond-to(md) {
  .hero {
    &__content {
      padding: 0 var(--spacing-xl);
    }
    
    &__actions {
      gap: var(--spacing-xl);
    }
  }
}
</style>
