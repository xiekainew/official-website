<template>
  <div 
    class="project-card" 
    :class="{ 
      'project-card--list': viewMode === 'list',
      'project-card--featured': project.featured 
    }"
    @click="$emit('click', project)"
  >
    <!-- 项目图片 -->
    <div class="project-image">
      <div class="image-placeholder">
        <svg viewBox="0 0 24 24" class="placeholder-icon">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      </div>
      
      <!-- 状态标签 -->
      <div class="project-status">
        <span 
          class="status-badge" 
          :class="`status-badge--${project.status}`"
        >
          {{ getStatusText(project.status) }}
        </span>
      </div>
      
      <!-- 悬停时显示的技术栈 -->
      <div class="tech-overlay">
        <div class="tech-tags">
          <span 
            v-for="tech in project.technologies" 
            :key="tech"
            class="tech-tag"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 项目信息 -->
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">{{ project.title }}</h3>
        <div class="project-meta">
          <span class="project-year">{{ project.year }}</span>
          <span v-if="project.featured" class="featured-badge">
            <svg viewBox="0 0 24 24">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            精选
          </span>
        </div>
      </div>
      
      <p class="project-description">{{ project.description }}</p>
      
      <!-- 项目统计 -->
      <div class="project-stats" v-if="viewMode === 'list'">
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{{ project.views || 0 }}</span>
        </div>
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{{ project.likes || 0 }}</span>
        </div>
      </div>
      
      <!-- 项目链接 -->
      <div class="project-actions">
        <a 
          v-if="project.liveUrl"
          :href="project.liveUrl" 
          class="action-btn action-btn--primary"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          <svg viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15,3 21,3 21,9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span>在线预览</span>
        </a>
        
        <a 
          v-if="project.githubUrl"
          :href="project.githubUrl" 
          class="action-btn action-btn--secondary"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          <span>查看源码</span>
        </a>
        
        <button class="action-btn action-btn--tertiary">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
          <span>了解更多</span>
        </button>
      </div>
    </div>
    
    <!-- 3D 效果层 -->
    <div class="card-glow" v-if="project.featured"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})

defineEmits(['click'])

const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    'in-progress': '开发中',
    planning: '计划中',
    archived: '已归档'
  }
  return statusMap[status] || status
}

onMounted(() => {
  // 卡片悬停动画
  const card = document.querySelector('.project-card')
  if (!card) return
  
  const handleMouseEnter = () => {
    gsap.to(card, {
      duration: 0.3,
      y: -8,
      rotationX: 5,
      rotationY: 5,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      ease: 'power2.out'
    })
    
    gsap.to(card.querySelector('.tech-overlay'), {
      duration: 0.3,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    })
  }
  
  const handleMouseLeave = () => {
    gsap.to(card, {
      duration: 0.3,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      ease: 'power2.out'
    })
    
    gsap.to(card.querySelector('.tech-overlay'), {
      duration: 0.3,
      opacity: 0,
      y: 10,
      ease: 'power2.out'
    })
  }
  
  card.addEventListener('mouseenter', handleMouseEnter)
  card.addEventListener('mouseleave', handleMouseLeave)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.project-card {
  @include card;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
  
  &--featured {
    border: 2px solid var(--primary-color);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
      z-index: 1;
    }
  }
  
  &--list {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    
    .project-image {
      width: 200px;
      height: 120px;
      flex-shrink: 0;
    }
    
    .project-content {
      flex: 1;
    }
  }
}

.project-image {
  position: relative;
  width: 100%;
  height: 200px;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
  
  .project-card--list & {
    margin-bottom: 0;
  }
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .placeholder-icon {
    width: 60px;
    height: 60px;
    stroke: white;
    fill: none;
    stroke-width: 1.5;
    opacity: 0.6;
  }
}

.project-status {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 2;
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

.tech-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: var(--spacing-lg);
  opacity: 0;
  transform: translateY(10px);
  transition: all var(--transition-normal);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tech-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  color: white;
  font-weight: var(--font-weight-medium);
}

.project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.project-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color);
  line-height: var(--line-height-tight);
}

.project-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.project-year {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--surface-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
}

.featured-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  
  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
}

.project-description {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
  flex-grow: 1;
}

.project-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  
  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
}

.project-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  svg {
    width: 16px;
    height: 16px;
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
      transform: translateY(-1px);
    }
  }
  
  &--secondary {
    background: var(--surface-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
  
  &--tertiary {
    background: transparent;
    color: var(--text-secondary);
    
    &:hover {
      color: var(--primary-color);
      background: rgba(var(--primary-color-rgb), 0.1);
    }
  }
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  z-index: -1;
  opacity: 0;
  filter: blur(20px);
  transition: opacity var(--transition-normal);
  
  .project-card:hover & {
    opacity: 0.3;
  }
}

// 响应式调整
@include respond-to(md) {
  .project-card--list {
    .project-image {
      width: 250px;
      height: 140px;
    }
  }
  
  .project-actions {
    gap: var(--spacing-md);
  }
}
</style>
