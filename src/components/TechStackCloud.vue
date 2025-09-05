<template>
  <div class="tech-stack-cloud">
    <!-- 过滤器 -->
    <div class="cloud-filters">
      <button
        v-for="category in categories"
        :key="category.key"
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === category.key }"
        @click="setFilter(category.key)"
      >
        {{ category.label }}
      </button>
    </div>
    
    <!-- 技术标签云 -->
    <div class="cloud-container" ref="cloudContainer">
      <div
        v-for="tech in filteredTechnologies"
        :key="tech.name"
        class="tech-tag"
        :class="[
          `tech-tag--${tech.level}`,
          `tech-tag--${tech.category}`,
          { 'tech-tag--hidden': !isVisible(tech) }
        ]"
        :style="getTagStyle(tech)"
        @mouseenter="onTagHover(tech)"
        @mouseleave="onTagLeave(tech)"
        @click="onTagClick(tech)"
      >
        <span class="tech-name">{{ tech.name }}</span>
        <div class="tech-level-indicator">
          <div 
            class="level-bar" 
            v-for="i in 5" 
            :key="i"
            :class="{ 'level-bar--filled': i <= getLevelNumber(tech.level) }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 技术详情弹窗 -->
    <div 
      v-if="selectedTech"
      class="tech-modal"
      @click="closeTechModal"
    >
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeTechModal">
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <h3 class="modal-title">{{ selectedTech.name }}</h3>
        <div class="modal-meta">
          <span class="tech-category">{{ getCategoryLabel(selectedTech.category) }}</span>
          <span class="tech-level">{{ getLevelLabel(selectedTech.level) }}</span>
        </div>
        <p class="modal-description">
          {{ getTechDescription(selectedTech.name) }}
        </p>
        
        <div class="modal-projects">
          <h4>相关项目</h4>
          <div class="project-tags">
            <span 
              v-for="project in getTechProjects(selectedTech.name)"
              :key="project"
              class="project-tag"
            >
              {{ project }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  technologies: {
    type: Array,
    required: true
  }
})

const cloudContainer = ref(null)
const activeFilter = ref('all')
const selectedTech = ref(null)

// 分类定义
const categories = [
  { key: 'all', label: '全部' },
  { key: 'frontend', label: '前端框架' },
  { key: 'language', label: '编程语言' },
  { key: 'build', label: '构建工具' },
  { key: 'backend', label: '后端技术' },
  { key: 'database', label: '数据库' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: '开发工具' },
  { key: 'animation', label: '动画库' },
  { key: 'graphics', label: '图形技术' }
]

// 过滤后的技术列表
const filteredTechnologies = computed(() => {
  if (activeFilter.value === 'all') {
    return props.technologies
  }
  return props.technologies.filter(tech => tech.category === activeFilter.value)
})

// 设置过滤器
const setFilter = (category) => {
  activeFilter.value = category
  
  nextTick(() => {
    animateTags()
  })
}

// 检查标签是否可见
const isVisible = (tech) => {
  if (activeFilter.value === 'all') return true
  return tech.category === activeFilter.value
}

// 获取标签样式
const getTagStyle = (tech) => {
  const levelSizes = {
    expert: { fontSize: '1.2rem', padding: '12px 20px' },
    advanced: { fontSize: '1.1rem', padding: '10px 16px' },
    intermediate: { fontSize: '1rem', padding: '8px 14px' },
    beginner: { fontSize: '0.9rem', padding: '6px 12px' }
  }
  
  const size = levelSizes[tech.level] || levelSizes.intermediate
  
  return {
    fontSize: size.fontSize,
    padding: size.padding,
    '--tag-color': getCategoryColor(tech.category)
  }
}

// 获取分类颜色
const getCategoryColor = (category) => {
  const colors = {
    frontend: '#61DAFB',
    language: '#F7DF1E',
    build: '#FF6B6B',
    backend: '#68D391',
    database: '#9F7AEA',
    devops: '#F56565',
    tools: '#4299E1',
    animation: '#48BB78',
    graphics: '#ED8936'
  }
  return colors[category] || '#007ACC'
}

// 获取等级数字
const getLevelNumber = (level) => {
  const levels = {
    expert: 5,
    advanced: 4,
    intermediate: 3,
    beginner: 2
  }
  return levels[level] || 3
}

// 获取分类标签
const getCategoryLabel = (category) => {
  const cat = categories.find(c => c.key === category)
  return cat ? cat.label : category
}

// 获取等级标签
const getLevelLabel = (level) => {
  const labels = {
    expert: '专家级',
    advanced: '高级',
    intermediate: '中级',
    beginner: '初级'
  }
  return labels[level] || '中级'
}

// 获取技术描述
const getTechDescription = (techName) => {
  const descriptions = {
    'Vue.js': '渐进式JavaScript框架，用于构建用户界面。具有响应式数据绑定和组合式API等特性。',
    'React': 'Facebook开发的用于构建用户界面的JavaScript库，采用组件化和虚拟DOM的设计理念。',
    'TypeScript': 'JavaScript的超集，提供静态类型检查，提高代码质量和开发效率。',
    'Node.js': '基于Chrome V8引擎的JavaScript运行时，用于构建高性能的服务端应用。',
    'GSAP': '强大的JavaScript动画库，提供丰富的动画API和优秀的性能。',
    'Three.js': '基于WebGL的3D图形库，简化了3D场景的创建和渲染。'
  }
  return descriptions[techName] || `${techName}是一个优秀的技术工具，在项目开发中发挥重要作用。`
}

// 获取相关项目
const getTechProjects = (techName) => {
  const projects = {
    'Vue.js': ['个人网站', '管理后台', '移动端H5'],
    'React': ['数据可视化平台', '企业官网', '在线编辑器'],
    'TypeScript': ['大型Web应用', 'Node.js后端', '组件库'],
    'Three.js': ['3D展示平台', '虚拟展厅', '游戏原型'],
    'GSAP': ['交互动画', '页面转场', '数据动画']
  }
  return projects[techName] || ['待补充项目']
}

// 标签悬停事件
const onTagHover = (tech) => {
  gsap.to(event.target, {
    duration: 0.3,
    scale: 1.1,
    y: -5,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    ease: 'back.out(1.7)'
  })
}

const onTagLeave = (tech) => {
  gsap.to(event.target, {
    duration: 0.3,
    scale: 1,
    y: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    ease: 'power2.out'
  })
}

// 标签点击事件
const onTagClick = (tech) => {
  selectedTech.value = tech
}

// 关闭技术详情弹窗
const closeTechModal = () => {
  selectedTech.value = null
}

// 动画效果
const animateTags = () => {
  gsap.from('.tech-tag:not(.tech-tag--hidden)', {
    duration: 0.6,
    scale: 0,
    opacity: 0,
    stagger: 0.05,
    ease: 'back.out(1.7)'
  })
}

onMounted(() => {
  nextTick(() => {
    animateTags()
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.tech-stack-cloud {
  width: 100%;
}

.cloud-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-bottom: var(--spacing-2xl);
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

.cloud-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: var(--spacing-xl);
}

.tech-tag {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--surface-color);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--tag-color, var(--primary-color));
    opacity: 0.8;
  }
  
  &:hover {
    border-color: var(--tag-color, var(--primary-color));
    transform: translateY(-2px);
  }
  
  &--hidden {
    opacity: 0;
    transform: scale(0);
    pointer-events: none;
  }
  
  &--expert {
    font-weight: var(--font-weight-bold);
  }
  
  &--advanced {
    font-weight: var(--font-weight-semibold);
  }
  
  &--intermediate {
    font-weight: var(--font-weight-medium);
  }
  
  &--beginner {
    font-weight: var(--font-weight-normal);
    opacity: 0.8;
  }
}

.tech-name {
  color: var(--text-color);
  white-space: nowrap;
}

.tech-level-indicator {
  display: flex;
  gap: 2px;
}

.level-bar {
  width: 4px;
  height: 4px;
  background: var(--border-color);
  border-radius: 50%;
  transition: background-color var(--transition-fast);
  
  &--filled {
    background: var(--tag-color, var(--primary-color));
  }
}

// 技术详情弹窗
.tech-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
}

.modal-content {
  background: var(--bg-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-color);
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  border: none;
  background: var(--surface-color);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
}

.modal-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.tech-category,
.tech-level {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--surface-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tech-category {
  color: var(--primary-color);
}

.tech-level {
  color: var(--text-secondary);
}

.modal-description {
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
}

.modal-projects {
  h4 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.project-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

// 响应式调整
@include respond-to(sm) {
  .cloud-container {
    gap: var(--spacing-lg);
    padding: var(--spacing-2xl);
  }
}
</style>
