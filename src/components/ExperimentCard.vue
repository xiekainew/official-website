<template>
  <div 
    class="experiment-card" 
    :class="`experiment-card--${experiment.difficulty}`"
    @click="$emit('launch', experiment)"
  >
    <!-- 实验缩略图 -->
    <div class="experiment-thumbnail">
      <div class="thumbnail-placeholder">
        <svg viewBox="0 0 24 24" class="placeholder-icon">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
          <polygon points="12 8 20 12.5 20 15.5 12 20 4 15.5 4 12.5 12 8"/>
        </svg>
      </div>
      
      <!-- 难度标签 -->
      <div class="difficulty-badge">
        <span class="difficulty-text">{{ getDifficultyText(experiment.difficulty) }}</span>
        <div class="difficulty-stars">
          <svg 
            v-for="i in 3" 
            :key="i"
            class="star"
            :class="{ 'star--filled': i <= getDifficultyLevel(experiment.difficulty) }"
            viewBox="0 0 24 24"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </div>
      </div>
      
      <!-- 播放按钮 -->
      <div class="play-button">
        <svg viewBox="0 0 24 24">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      </div>
    </div>
    
    <!-- 实验信息 -->
    <div class="experiment-info">
      <h3 class="experiment-title">{{ experiment.title }}</h3>
      <p class="experiment-description">{{ experiment.description }}</p>
      
      <!-- 技术标签 -->
      <div class="tech-tags">
        <span 
          v-for="tech in experiment.technologies" 
          :key="tech"
          class="tech-tag"
        >
          {{ tech }}
        </span>
      </div>
      
      <!-- 实验统计 -->
      <div class="experiment-stats">
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <span>{{ getEstimatedTime() }}</span>
        </div>
        
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{{ experiment.views || 0 }}</span>
        </div>
        
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{{ experiment.likes || 0 }}</span>
        </div>
      </div>
    </div>
    
    <!-- 悬停效果 -->
    <div class="card-glow"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  experiment: {
    type: Object,
    required: true
  }
})

defineEmits(['launch'])

const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家'
  }
  return difficultyMap[difficulty] || difficulty
}

const getDifficultyLevel = (difficulty) => {
  const levelMap = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 3
  }
  return levelMap[difficulty] || 1
}

const getEstimatedTime = () => {
  const timeMap = {
    beginner: '5-10分钟',
    intermediate: '10-20分钟',
    advanced: '20-30分钟',
    expert: '30+分钟'
  }
  return timeMap[props.experiment.difficulty] || '10分钟'
}

onMounted(() => {
  // 卡片悬停动画
  const card = document.querySelector('.experiment-card')
  if (!card) return
  
  const playButton = card.querySelector('.play-button')
  const glow = card.querySelector('.card-glow')
  
  const handleMouseEnter = () => {
    // 卡片悬停效果
    gsap.to(card, {
      duration: 0.3,
      y: -10,
      scale: 1.03,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      ease: 'power2.out'
    })
    
    // 播放按钮动画
    gsap.to(playButton, {
      duration: 0.3,
      scale: 1.2,
      opacity: 1,
      ease: 'back.out(1.7)'
    })
    
    // 光晕效果
    gsap.to(glow, {
      duration: 0.3,
      opacity: 0.6,
      scale: 1.1,
      ease: 'power2.out'
    })
  }
  
  const handleMouseLeave = () => {
    gsap.to(card, {
      duration: 0.3,
      y: 0,
      scale: 1,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      ease: 'power2.out'
    })
    
    gsap.to(playButton, {
      duration: 0.3,
      scale: 1,
      opacity: 0.8,
      ease: 'power2.out'
    })
    
    gsap.to(glow, {
      duration: 0.3,
      opacity: 0,
      scale: 1,
      ease: 'power2.out'
    })
  }
  
  card.addEventListener('mouseenter', handleMouseEnter)
  card.addEventListener('mouseleave', handleMouseLeave)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.experiment-card {
  @include card;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all var(--transition-normal);
  
  &--beginner {
    border-left: 4px solid #2ecc71;
  }
  
  &--intermediate {
    border-left: 4px solid #f39c12;
  }
  
  &--advanced {
    border-left: 4px solid #e74c3c;
  }
  
  &--expert {
    border-left: 4px solid #9b59b6;
  }
}

.experiment-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  
  .placeholder-icon {
    width: 60px;
    height: 60px;
    fill: white;
    opacity: 0.6;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.difficulty-badge {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.difficulty-text {
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.difficulty-stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 12px;
  height: 12px;
  fill: rgba(255, 255, 255, 0.3);
  
  &--filled {
    fill: #ffd700;
  }
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all var(--transition-normal);
  
  svg {
    width: 24px;
    height: 24px;
    fill: var(--primary-color);
    margin-left: 2px; // 视觉居中调整
  }
}

.experiment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.experiment-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-tight);
}

.experiment-description {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
  flex-grow: 1;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
}

.tech-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
}

.experiment-stats {
  display: flex;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
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
  
  // 特殊图标处理
  &:nth-child(3) svg {
    stroke: #ff6b6b;
  }
}

.card-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  z-index: -1;
  opacity: 0;
  filter: blur(20px);
  transition: all var(--transition-normal);
}

// 点击波纹效果
.experiment-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(var(--primary-color-rgb), 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.5s ease;
  z-index: 0;
  pointer-events: none;
}

.experiment-card:active::before {
  width: 300px;
  height: 300px;
}

// 响应式调整
@include respond-to(md) {
  .experiment-thumbnail {
    height: 220px;
  }
  
  .play-button {
    width: 70px;
    height: 70px;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
