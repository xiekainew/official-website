<template>
  <div class="projects">
    <div class="container">
      <!-- 页面标题 -->
      <section class="projects-header">
        <h1 class="page-title gradient-text">项目展示</h1>
        <p class="page-subtitle">
          探索我的技术实现和创意作品
        </p>
      </section>
      
      <!-- 项目筛选器 -->
      <section class="projects-filters">
        <div class="filter-buttons">
          <button
            v-for="filter in projectFilters"
            :key="filter.key"
            class="filter-btn"
            :class="{ 'filter-btn--active': activeFilter === filter.key }"
            @click="setFilter(filter.key)"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <div class="view-toggle">
          <button 
            class="view-btn"
            :class="{ 'view-btn--active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button 
            class="view-btn"
            :class="{ 'view-btn--active': viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <svg viewBox="0 0 24 24">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </section>
      
      <!-- 项目网格 -->
      <section class="projects-grid">
        <TransitionGroup 
          name="project-card" 
          tag="div" 
          class="grid-container"
          :class="{ 'grid-container--list': viewMode === 'list' }"
        >
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
            :view-mode="viewMode"
            @click="openProjectModal(project)"
          />
        </TransitionGroup>
      </section>
      
      <!-- 项目详情弹窗 -->
      <ProjectModal 
        v-if="selectedProject"
        :project="selectedProject"
        @close="closeProjectModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectModal from '@/components/ProjectModal.vue'

gsap.registerPlugin(ScrollTrigger)

// 响应式数据
const activeFilter = ref('all')
const viewMode = ref('grid')
const selectedProject = ref(null)

// 项目筛选器
const projectFilters = [
  { key: 'all', label: '全部项目' },
  { key: 'web', label: 'Web应用' },
  { key: 'mobile', label: '移动端' },
  { key: '3d', label: '3D/WebGL' },
  { key: 'animation', label: '动画效果' },
  { key: 'opensource', label: '开源项目' }
]

// 项目数据
const projects = [
  {
    id: 1,
    title: '3D产品展示平台',
    description: '基于Three.js构建的交互式3D产品展示系统，支持模型加载、材质编辑和实时渲染。',
    image: '/images/project-3d-showcase.jpg',
    category: '3d',
    technologies: ['Three.js', 'Vue 3', 'TypeScript', 'WebGL'],
    githubUrl: 'https://github.com/username/3d-showcase',
    liveUrl: 'https://3d-showcase.demo.com',
    status: 'completed',
    featured: true,
    year: 2024,
    details: {
      overview: '这是一个为电商平台开发的3D产品展示系统，允许用户以360度全方位查看产品。',
      features: [
        '支持glTF/GLB模型格式',
        '实时材质和光照调节',
        '移动端触控操作优化',
        '产品配置器集成',
        'AR模式预览'
      ],
      challenges: [
        '移动端性能优化',
        '大型模型的加载优化',
        '不同设备的兼容性'
      ],
      results: [
        '产品转化率提升35%',
        '用户停留时间增加50%',
        '退货率降低20%'
      ]
    }
  },
  {
    id: 2,
    title: '数据可视化大屏',
    description: '企业级数据可视化大屏系统，实时展示业务数据和关键指标。',
    image: '/images/project-dataviz.jpg',
    category: 'web',
    technologies: ['Vue 3', 'ECharts', 'D3.js', 'WebSocket'],
    githubUrl: 'https://github.com/username/dataviz-dashboard',
    liveUrl: 'https://dataviz.demo.com',
    status: 'completed',
    featured: true,
    year: 2023,
    details: {
      overview: '为大型企业打造的实时数据监控大屏，支持多种图表类型和自定义配置。',
      features: [
        '实时数据更新',
        '多种图表组件',
        '响应式布局',
        '主题定制',
        '数据钻取功能'
      ],
      challenges: [
        '大量数据的性能优化',
        '多种数据源整合',
        '实时性要求'
      ],
      results: [
        '决策效率提升40%',
        '数据响应时间 < 500ms',
        '支持百万级数据展示'
      ]
    }
  },
  {
    id: 3,
    title: '移动端H5游戏',
    description: '基于Canvas的移动端小游戏，具有流畅的动画效果和物理引擎。',
    image: '/images/project-h5-game.jpg',
    category: 'mobile',
    technologies: ['Canvas', 'JavaScript', 'Matter.js', 'GSAP'],
    githubUrl: 'https://github.com/username/h5-game',
    liveUrl: 'https://h5game.demo.com',
    status: 'completed',
    featured: false,
    year: 2023,
    details: {
      overview: '一款基于物理引擎的休闲小游戏，玩家需要通过策略性操作完成关卡挑战。',
      features: [
        '流畅的物理动画',
        '触控操作优化',
        '关卡编辑器',
        '成就系统',
        '社交分享'
      ],
      challenges: [
        '移动端性能优化',
        '不同屏幕适配',
        '物理引擎调优'
      ],
      results: [
        '日活用户 10K+',
        '平均游戏时长 8分钟',
        '用户留存率 65%'
      ]
    }
  },
  {
    id: 4,
    title: '在线代码编辑器',
    description: 'Web端的代码编辑和运行环境，支持多种编程语言。',
    image: '/images/project-code-editor.jpg',
    category: 'web',
    technologies: ['Monaco Editor', 'Node.js', 'Docker', 'WebSocket'],
    githubUrl: 'https://github.com/username/code-editor',
    liveUrl: 'https://codeeditor.demo.com',
    status: 'in-progress',
    featured: true,
    year: 2024,
    details: {
      overview: '一个功能完整的在线代码编辑器，提供代码编写、调试和运行功能。',
      features: [
        '语法高亮和智能提示',
        '实时协作编辑',
        '代码运行环境',
        '版本控制集成',
        '插件系统'
      ],
      challenges: [
        '代码执行安全性',
        '实时协作同步',
        '多语言支持'
      ],
      results: [
        '支持15种编程语言',
        '响应时间 < 100ms',
        '日活用户 5K+'
      ]
    }
  },
  {
    id: 5,
    title: 'Vue组件库',
    description: '企业级Vue组件库，提供丰富的UI组件和设计规范。',
    image: '/images/project-component-lib.jpg',
    category: 'opensource',
    technologies: ['Vue 3', 'TypeScript', 'Vite', 'Storybook'],
    githubUrl: 'https://github.com/username/vue-components',
    liveUrl: 'https://components.demo.com',
    status: 'completed',
    featured: false,
    year: 2023,
    details: {
      overview: '一个现代化的Vue 3组件库，遵循设计系统原则，提供一致的用户体验。',
      features: [
        '50+ 高质量组件',
        'TypeScript支持',
        '暗黑模式',
        '国际化',
        '主题定制'
      ],
      challenges: [
        '组件API设计',
        '性能优化',
        '兼容性测试'
      ],
      results: [
        'GitHub Stars 2K+',
        'NPM下载量 50K+',
        '10+ 企业采用'
      ]
    }
  },
  {
    id: 6,
    title: 'WebGL粒子系统',
    description: '基于WebGL的高性能粒子效果系统，支持复杂的粒子动画。',
    image: '/images/project-particles.jpg',
    category: 'animation',
    technologies: ['WebGL', 'GLSL', 'JavaScript', 'Canvas'],
    githubUrl: 'https://github.com/username/webgl-particles',
    liveUrl: 'https://particles.demo.com',
    status: 'completed',
    featured: false,
    year: 2022,
    details: {
      overview: '一个高性能的WebGL粒子系统，可用于创建各种视觉效果。',
      features: [
        '支持百万粒子',
        '自定义着色器',
        '物理模拟',
        '纹理贴图',
        '实时编辑'
      ],
      challenges: [
        'GPU性能优化',
        '着色器编程',
        '内存管理'
      ],
      results: [
        '渲染性能提升90%',
        '支持移动端',
        '开源社区认可'
      ]
    }
  }
]

// 过滤后的项目
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projects
  }
  return projects.filter(project => project.category === activeFilter.value)
})

// 设置筛选器
const setFilter = (filter) => {
  activeFilter.value = filter
}

// 打开项目详情
const openProjectModal = (project) => {
  selectedProject.value = project
}

// 关闭项目详情
const closeProjectModal = () => {
  selectedProject.value = null
}

onMounted(() => {
  // 页面入场动画
  gsap.from('.projects-header', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })
  
  gsap.from('.projects-filters', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.3
  })
  
  // 项目卡片动画
  gsap.from('.project-card', {
    duration: 0.6,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    delay: 0.5,
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 80%'
    }
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.projects {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

.projects-header {
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

.projects-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  
  &--active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
}

.view-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  svg {
    width: 20px;
    height: 20px;
    stroke: var(--text-secondary);
    fill: none;
    stroke-width: 2;
  }
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    
    svg {
      stroke: var(--primary-color);
    }
  }
  
  &--active {
    background: var(--primary-color);
    
    svg {
      stroke: white;
    }
  }
}

.projects-grid {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-xl);
    
    &--list {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }
  }
}

// 项目卡片过渡动画
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.project-card-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.project-card-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

// 响应式调整
@include respond-to(md) {
  .projects-filters {
    flex-wrap: nowrap;
  }
  
  .filter-buttons {
    gap: var(--spacing-md);
  }
}

@include respond-to(lg) {
  .projects-grid .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}
</style>
