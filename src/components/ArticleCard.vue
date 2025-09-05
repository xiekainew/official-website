<template>
  <article 
    class="article-card" 
    :class="{ 'article-card--featured': article.featured }"
    @click="$emit('click', article)"
  >
    <!-- 文章图片/缩略图 -->
    <div class="article-thumbnail">
      <div class="thumbnail-placeholder">
        <svg viewBox="0 0 24 24" class="placeholder-icon">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </div>
      
      <!-- 分类标签 -->
      <div class="category-badge">
        <span class="category-text">{{ getCategoryText(article.category) }}</span>
      </div>
      
      <!-- 阅读时间 -->
      <div class="read-time">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
        <span>{{ article.readTime }}分钟</span>
      </div>
    </div>
    
    <!-- 文章内容 -->
    <div class="article-content">
      <!-- 文章头部信息 -->
      <div class="article-header">
        <h2 class="article-title">{{ article.title }}</h2>
        <div class="article-meta">
          <div class="meta-item">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
            <span>{{ article.author }}</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{{ formatDate(article.publishDate) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 文章摘要 -->
      <p class="article-excerpt">{{ article.excerpt }}</p>
      
      <!-- 文章标签 -->
      <div class="article-tags">
        <span 
          v-for="tag in article.tags" 
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- 文章统计 -->
      <div class="article-stats">
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{{ article.views }}</span>
        </div>
        
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{{ article.likes }}</span>
        </div>
        
        <div class="stat-item">
          <svg viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{{ article.comments || 0 }}</span>
        </div>
        
        <button class="bookmark-btn" :class="{ 'bookmark-btn--active': isBookmarked }">
          <svg viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 精选文章光效 -->
    <div v-if="article.featured" class="featured-glow"></div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const isBookmarked = ref(false)

const getCategoryText = (category) => {
  const categoryMap = {
    frontend: '前端开发',
    backend: '后端开发',
    graphics: '图形编程',
    language: '编程语言',
    css: 'CSS样式',
    design: 'UI设计',
    tutorial: '教程指南',
    experience: '经验分享'
  }
  return categoryMap[category] || category
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else if (diffDays < 30) {
    return `${Math.ceil(diffDays / 7)}周前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

onMounted(() => {
  // 卡片悬停动画
  const card = document.querySelector('.article-card')
  if (!card) return
  
  const handleMouseEnter = () => {
    gsap.to(card, {
      duration: 0.3,
      y: -5,
      scale: 1.02,
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
      ease: 'power2.out'
    })
    
    // 标题动画
    gsap.to(card.querySelector('.article-title'), {
      duration: 0.3,
      color: 'var(--primary-color)',
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
    
    gsap.to(card.querySelector('.article-title'), {
      duration: 0.3,
      color: 'var(--text-color)',
      ease: 'power2.out'
    })
  }
  
  card.addEventListener('mouseenter', handleMouseEnter)
  card.addEventListener('mouseleave', handleMouseLeave)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.article-card {
  @include card;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all var(--transition-normal);
  
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
}

.article-thumbnail {
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
  
  .placeholder-icon {
    width: 60px;
    height: 60px;
    fill: white;
    opacity: 0.6;
  }
}

.category-badge {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
}

.category-text {
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.read-time {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  svg {
    width: 14px;
    height: 14px;
    stroke: var(--text-secondary);
    fill: none;
    stroke-width: 2;
  }
  
  span {
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-header {
  margin-bottom: var(--spacing-md);
}

.article-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-sm);
  transition: color var(--transition-fast);
}

.article-meta {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  
  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
}

.article-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  
  // 点赞图标特殊处理
  &:nth-child(2) svg {
    stroke: #ff6b6b;
  }
}

.bookmark-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  svg {
    width: 18px;
    height: 18px;
    stroke: var(--text-secondary);
    fill: none;
    stroke-width: 2;
    transition: all var(--transition-fast);
  }
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    
    svg {
      stroke: var(--primary-color);
    }
  }
  
  &--active {
    svg {
      stroke: var(--primary-color);
      fill: var(--primary-color);
    }
  }
}

.featured-glow {
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
  transition: opacity var(--transition-normal);
  
  .article-card:hover & {
    opacity: 0.3;
  }
}

// 点击波纹效果
.article-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(var(--primary-color-rgb), 0.2);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  z-index: 0;
  pointer-events: none;
}

.article-card:active::after {
  width: 400px;
  height: 400px;
}

// 响应式调整
@include respond-to(md) {
  .article-title {
    font-size: var(--font-size-2xl);
  }
  
  .article-meta {
    gap: var(--spacing-xl);
  }
}
</style>
