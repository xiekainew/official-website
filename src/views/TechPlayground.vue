<template>
  <div class="tech-playground">
    <div class="container">
      <!-- 页面标题 -->
      <section class="playground-header">
        <h1 class="page-title gradient-text">技术实验场</h1>
        <p class="page-subtitle">
          体验前端技术的无限可能
        </p>
      </section>
      
      <!-- 实验分类 -->
      <section class="experiment-categories">
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.key"
            class="category-tab"
            :class="{ 'category-tab--active': activeCategory === category.key }"
            @click="setCategory(category.key)"
          >
            <div class="tab-icon">
              <component :is="category.icon" />
            </div>
            <span class="tab-label">{{ category.label }}</span>
          </button>
        </div>
      </section>
      
      <!-- 实验展示区 -->
      <section class="experiments-showcase">
        <TransitionGroup 
          name="experiment" 
          tag="div" 
          class="experiments-grid"
        >
          <ExperimentCard
            v-for="experiment in filteredExperiments"
            :key="experiment.id"
            :experiment="experiment"
            @launch="launchExperiment"
          />
        </TransitionGroup>
      </section>
      
      <!-- 实验运行区 -->
      <section v-if="activeExperiment" class="experiment-runner">
        <div class="runner-header">
          <h3 class="runner-title">{{ activeExperiment.title }}</h3>
          <div class="runner-controls">
            <button class="control-btn" @click="resetExperiment">
              <svg viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            <button class="control-btn" @click="toggleFullscreen">
              <svg viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
            <button class="control-btn control-btn--close" @click="closeExperiment">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="runner-content" ref="runnerContent">
          <!-- 动态加载实验组件 -->
          <component 
            :is="activeExperiment.component" 
            v-if="activeExperiment.component"
            :config="activeExperiment.config"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import ExperimentCard from '@/components/ExperimentCard.vue'

// 实验组件懒加载
const ParticleSystem = () => import('@/experiments/ParticleSystem.vue')
const CSSAnimations = () => import('@/experiments/CSSAnimations.vue')
// 其他实验组件待创建
// const FluidSimulation = () => import('@/experiments/FluidSimulation.vue')
// const GeometryMorph = () => import('@/experiments/GeometryMorph.vue')
// const AudioVisualizer = () => import('@/experiments/AudioVisualizer.vue')
// const PhysicsEngine = () => import('@/experiments/PhysicsEngine.vue')
// const ShaderEffects = () => import('@/experiments/ShaderEffects.vue')
// const InteractiveCanvas = () => import('@/experiments/InteractiveCanvas.vue')

const activeCategory = ref('all')
const activeExperiment = ref(null)
const runnerContent = ref(null)

// 实验分类
const categories = [
  { 
    key: 'all', 
    label: '全部实验', 
    icon: 'AllIcon' 
  },
  { 
    key: 'webgl', 
    label: 'WebGL/3D', 
    icon: 'CubeIcon' 
  },
  { 
    key: 'canvas', 
    label: 'Canvas 2D', 
    icon: 'PaintIcon' 
  },
  { 
    key: 'css', 
    label: 'CSS 动画', 
    icon: 'StyleIcon' 
  },
  { 
    key: 'audio', 
    label: '音频可视化', 
    icon: 'AudioIcon' 
  },
  { 
    key: 'physics', 
    label: '物理引擎', 
    icon: 'PhysicsIcon' 
  }
]

// 实验数据
const experiments = [
  {
    id: 1,
    title: '粒子星空',
    description: '基于WebGL的交互式粒子系统，模拟星空效果',
    category: 'webgl',
    difficulty: 'intermediate',
    technologies: ['WebGL', 'GLSL', 'Three.js'],
    thumbnail: '/images/experiment-particles.jpg',
    component: ParticleSystem,
    config: {
      particleCount: 10000,
      interactive: true,
      colors: ['#ffffff', '#87CEEB', '#FFB6C1']
    }
  },
  {
    id: 7,
    title: 'CSS 3D 魔方',
    description: '纯CSS实现的3D魔方旋转效果',
    category: 'css',
    difficulty: 'intermediate',
    technologies: ['CSS 3D', 'Transforms', 'Animations'],
    thumbnail: '/images/experiment-css3d.jpg',
    component: CSSAnimations,
    config: {
      effect: 'cube',
      autoRotate: true
    }
  }
]

// 待实现的实验（已注释）
/*
const futureExperiments = [
  {
    id: 2,
    title: '流体模拟',
    description: '实时流体动力学模拟，支持用户交互',
    category: 'webgl',
    difficulty: 'advanced',
    technologies: ['WebGL', 'Compute Shaders', 'Physics'],
    thumbnail: '/images/experiment-fluid.jpg',
    component: FluidSimulation,
    config: {
      viscosity: 0.1,
      density: 1.0,
      interactive: true
    }
  },
  {
    id: 3,
    title: '几何变形',
    description: '3D几何体的平滑变形动画',
    category: 'webgl',
    difficulty: 'intermediate',
    technologies: ['Three.js', 'Morphing', 'GSAP'],
    thumbnail: '/images/experiment-morph.jpg',
    component: GeometryMorph,
    config: {
      shapes: ['sphere', 'cube', 'torus'],
      animationSpeed: 2
    }
  },
  {
    id: 4,
    title: '音频可视化',
    description: '实时音频频谱分析和可视化效果',
    category: 'audio',
    difficulty: 'advanced',
    technologies: ['Web Audio API', 'Canvas', 'FFT'],
    thumbnail: '/images/experiment-audio.jpg',
    component: AudioVisualizer,
    config: {
      fftSize: 2048,
      smoothing: 0.8,
      visualStyle: 'bars'
    }
  },
  {
    id: 5,
    title: '物理弹球',
    description: '基于物理引擎的弹球游戏',
    category: 'physics',
    difficulty: 'intermediate',
    technologies: ['Matter.js', 'Canvas', 'Physics'],
    thumbnail: '/images/experiment-physics.jpg',
    component: PhysicsEngine,
    config: {
      gravity: 0.8,
      restitution: 0.8,
      interactive: true
    }
  },
  {
    id: 6,
    title: '着色器效果',
    description: '各种WebGL着色器的视觉效果展示',
    category: 'webgl',
    difficulty: 'advanced',
    technologies: ['WebGL', 'GLSL', 'Fragment Shaders'],
    thumbnail: '/images/experiment-shaders.jpg',
    component: ShaderEffects,
    config: {
      effects: ['wave', 'noise', 'kaleidoscope'],
      autoSwitch: true
    }
  },
  {
    id: 8,
    title: '交互画板',
    description: '支持多种笔刷效果的Canvas绘图板',
    category: 'canvas',
    difficulty: 'beginner',
    technologies: ['Canvas 2D', 'Touch Events', 'Pressure'],
    thumbnail: '/images/experiment-canvas.jpg',
    component: InteractiveCanvas,
    config: {
      brushes: ['pen', 'marker', 'airbrush'],
      pressureSupport: true
    }
  }
]
*/

// 过滤实验
const filteredExperiments = computed(() => {
  if (activeCategory.value === 'all') {
    return experiments
  }
  return experiments.filter(exp => exp.category === activeCategory.value)
})

// 设置分类
const setCategory = (category) => {
  activeCategory.value = category
}

// 启动实验
const launchExperiment = (experiment) => {
  activeExperiment.value = experiment
  
  // 滚动到实验运行区
  setTimeout(() => {
    const runner = document.querySelector('.experiment-runner')
    if (runner) {
      runner.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

// 重置实验
const resetExperiment = () => {
  if (activeExperiment.value) {
    // 重新挂载组件以重置状态
    const current = activeExperiment.value
    activeExperiment.value = null
    setTimeout(() => {
      activeExperiment.value = current
    }, 50)
  }
}

// 全屏切换
const toggleFullscreen = () => {
  const element = runnerContent.value
  if (!element) return
  
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    element.requestFullscreen()
  }
}

// 关闭实验
const closeExperiment = () => {
  gsap.to('.experiment-runner', {
    duration: 0.3,
    opacity: 0,
    y: 20,
    onComplete: () => {
      activeExperiment.value = null
    }
  })
}

onMounted(() => {
  // 页面入场动画
  gsap.from('.playground-header', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })
  
  gsap.from('.experiment-categories', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.3
  })
  
  gsap.from('.experiment-card', {
    duration: 0.6,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    delay: 0.5
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.tech-playground {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

.playground-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  
  .page-title {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--spacing-lg);
  }
  
  .page-subtitle {
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }
}

.experiment-categories {
  margin-bottom: var(--spacing-2xl);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 120px;
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &--active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    
    .tab-icon svg {
      fill: white;
    }
  }
}

.tab-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    fill: var(--text-color);
    transition: fill var(--transition-fast);
  }
}

.tab-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

.experiments-showcase {
  margin-bottom: var(--spacing-3xl);
}

.experiments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

// 实验运行区
.experiment-runner {
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-top: var(--spacing-3xl);
}

.runner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
}

.runner-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color);
}

.runner-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--surface-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  svg {
    width: 20px;
    height: 20px;
    fill: var(--text-color);
  }
  
  &:hover {
    background: var(--primary-color);
    
    svg {
      fill: white;
    }
  }
  
  &--close:hover {
    background: #ff4757;
  }
}

.runner-content {
  min-height: 400px;
  padding: var(--spacing-xl);
  
  &:fullscreen {
    background: var(--bg-color);
    padding: 0;
  }
}

// 实验卡片过渡动画
.experiment-enter-active,
.experiment-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.experiment-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.experiment-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.experiment-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

// 响应式调整
@include respond-to(md) {
  .category-tabs {
    gap: var(--spacing-lg);
  }
  
  .category-tab {
    min-width: 140px;
  }
  
  .experiments-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@include respond-to(lg) {
  .experiments-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}
</style>
