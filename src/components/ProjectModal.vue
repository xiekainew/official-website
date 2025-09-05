<template>
  <div class="project-modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <div class="modal-title-section">
          <h2 class="modal-title">{{ project.title }}</h2>
          <div class="modal-meta">
            <span class="project-year">{{ project.year }}</span>
            <span 
              class="status-badge" 
              :class="`status-badge--${project.status}`"
            >
              {{ getStatusText(project.status) }}
            </span>
          </div>
        </div>
        
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <!-- 项目预览图 -->
      <div class="project-preview">
        <div class="preview-image">
          <div class="image-placeholder">
            <svg viewBox="0 0 24 24" class="placeholder-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
          </div>
        </div>
        
        <!-- 项目链接 -->
        <div class="preview-actions">
          <a 
            v-if="project.liveUrl"
            :href="project.liveUrl" 
            class="preview-btn preview-btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            在线预览
          </a>
          
          <a 
            v-if="project.githubUrl"
            :href="project.githubUrl" 
            class="preview-btn preview-btn--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            查看源码
          </a>
        </div>
      </div>
      
      <!-- 项目详情 -->
      <div class="modal-body">
        <!-- 技术栈 -->
        <div class="detail-section">
          <h3 class="section-title">技术栈</h3>
          <div class="tech-list">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="tech-item"
            >
              {{ tech }}
            </span>
          </div>
        </div>
        
        <!-- 项目概述 -->
        <div class="detail-section" v-if="project.details?.overview">
          <h3 class="section-title">项目概述</h3>
          <p class="section-content">{{ project.details.overview }}</p>
        </div>
        
        <!-- 核心功能 -->
        <div class="detail-section" v-if="project.details?.features">
          <h3 class="section-title">核心功能</h3>
          <ul class="feature-list">
            <li 
              v-for="feature in project.details.features" 
              :key="feature"
              class="feature-item"
            >
              <svg viewBox="0 0 24 24" class="feature-icon">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              {{ feature }}
            </li>
          </ul>
        </div>
        
        <!-- 技术挑战 -->
        <div class="detail-section" v-if="project.details?.challenges">
          <h3 class="section-title">技术挑战</h3>
          <ul class="challenge-list">
            <li 
              v-for="challenge in project.details.challenges" 
              :key="challenge"
              class="challenge-item"
            >
              <svg viewBox="0 0 24 24" class="challenge-icon">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ challenge }}
            </li>
          </ul>
        </div>
        
        <!-- 项目成果 -->
        <div class="detail-section" v-if="project.details?.results">
          <h3 class="section-title">项目成果</h3>
          <div class="results-grid">
            <div 
              v-for="(result, index) in project.details.results" 
              :key="index"
              class="result-item"
            >
              <div class="result-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span class="result-text">{{ result }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    'in-progress': '开发中',
    planning: '计划中',
    archived: '已归档'
  }
  return statusMap[status] || status
}

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  // 阻止背景滚动
  document.body.style.overflow = 'hidden'
  
  // 监听ESC键
  document.addEventListener('keydown', handleEscape)
  
  // 入场动画
  gsap.fromTo('.project-modal', {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
  
  gsap.fromTo('.modal-content', {
    scale: 0.9,
    y: 50,
    opacity: 0
  }, {
    scale: 1,
    y: 0,
    opacity: 1,
    duration: 0.4,
    ease: 'back.out(1.7)'
  })
})

onUnmounted(() => {
  // 恢复背景滚动
  document.body.style.overflow = ''
  
  // 移除事件监听
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
  overflow-y: auto;
}

.modal-content {
  background: var(--bg-color);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
  gap: var(--spacing-lg);
}

.modal-title-section {
  flex: 1;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-tight);
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.project-year {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--surface-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: white;
  
  &--completed {
    background: #2ecc71;
  }
  
  &--in-progress {
    background: #f39c12;
  }
  
  &--planning {
    background: #3498db;
  }
  
  &--archived {
    background: #95a5a6;
  }
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--surface-color);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
  }
}

.project-preview {
  position: relative;
  margin: var(--spacing-xl);
  margin-top: 0;
}

.preview-image {
  width: 100%;
  height: 300px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .placeholder-icon {
    width: 80px;
    height: 80px;
    stroke: white;
    fill: none;
    stroke-width: 1.5;
    opacity: 0.6;
  }
}

.preview-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--transition-fast);
  
  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
  
  &--primary {
    background: var(--primary-color);
    color: white;
    
    &:hover {
      background: var(--primary-color);
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &--secondary {
    background: var(--surface-color);
    color: var(--text-color);
    border: 2px solid var(--border-color);
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateY(-2px);
    }
  }
}

.modal-body {
  padding: var(--spacing-xl);
  padding-top: 0;
}

.detail-section {
  margin-bottom: var(--spacing-2xl);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);
}

.section-content {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tech-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.feature-list,
.challenge-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.feature-item,
.challenge-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.feature-icon,
.challenge-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
  stroke: var(--primary-color);
  fill: none;
  stroke-width: 2;
}

.challenge-icon {
  stroke: #f39c12;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  
  @include respond-to(md) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

.result-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.result-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
}

.result-text {
  color: var(--text-color);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
}

// 响应式调整
@include respond-to(md) {
  .modal-content {
    margin: var(--spacing-2xl);
  }
  
  .preview-actions {
    gap: var(--spacing-lg);
  }
}
</style>
