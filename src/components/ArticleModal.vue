<template>
  <div class="article-modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <div class="header-content">
          <h1 class="article-title">{{ article.title }}</h1>
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
            <div class="meta-item">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>{{ article.readTime }}分钟阅读</span>
            </div>
          </div>
          
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
        </div>
        
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <!-- 文章内容 -->
      <div class="modal-body">
        <div class="article-content" v-html="renderedContent"></div>
        
        <!-- 文章统计 -->
        <div class="article-stats">
          <div class="stat-item">
            <svg viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{{ article.views }} 次阅读</span>
          </div>
          
          <button 
            class="stat-button"
            :class="{ 'stat-button--active': isLiked }"
            @click="toggleLike"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{{ currentLikes }} 点赞</span>
          </button>
          
          <button class="stat-button">
            <svg viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>评论</span>
          </button>
          
          <button class="stat-button">
            <svg viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>分享</span>
          </button>
        </div>
      </div>
      
      <!-- 滚动指示器 -->
      <div class="scroll-indicator">
        <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { getArticleById, incrementArticleViews, toggleArticleLike } from '@/data/articles.js'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const isLiked = ref(false)
const scrollProgress = ref(0)
const currentLikes = ref(props.article.likes)
const isLoading = ref(false)
const fullArticle = ref(null)

// 渲染的内容
const renderedContent = computed(() => {
  if (fullArticle.value && fullArticle.value.renderedContent) {
    return fullArticle.value.renderedContent
  }
  
  // 如果还没有加载完整文章，显示摘要
  return `<p>${props.article.excerpt}</p>`
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 加载完整文章内容
const loadFullArticle = async () => {
  if (fullArticle.value) return // 已经加载过了
  
  isLoading.value = true
  try {
    const article = await getArticleById(props.article.id)
    if (article) {
      fullArticle.value = article
      // 增加阅读量
      incrementArticleViews(props.article.id)
    }
  } catch (error) {
    console.error('Failed to load article:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  currentLikes.value += isLiked.value ? 1 : -1
  
  // 更新数据
  toggleArticleLike(props.article.id, isLiked.value)
  
  // 点赞动画
  gsap.fromTo('.stat-button--active svg', {
    scale: 1
  }, {
    scale: 1.3,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out'
  })
}

const updateScrollProgress = () => {
  const modalBody = document.querySelector('.modal-body')
  if (!modalBody) return
  
  const scrollTop = modalBody.scrollTop
  const scrollHeight = modalBody.scrollHeight - modalBody.clientHeight
  const progress = (scrollTop / scrollHeight) * 100
  scrollProgress.value = Math.min(100, Math.max(0, progress))
}

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(async () => {
  // 阻止背景滚动
  document.body.style.overflow = 'hidden'
  
  // 监听ESC键
  document.addEventListener('keydown', handleEscape)
  
  // 监听滚动事件
  const modalBody = document.querySelector('.modal-body')
  if (modalBody) {
    modalBody.addEventListener('scroll', updateScrollProgress)
  }
  
  // 加载完整文章内容
  await loadFullArticle()
  
  // 入场动画
  gsap.fromTo('.article-modal', {
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

// 导入代码高亮样式
@import 'highlight.js/styles/github-dark.css';
.article-modal {
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
}

.modal-content {
  background: var(--bg-color);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-2xl);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
  gap: var(--spacing-lg);
}

.header-content {
  flex: 1;
}

.article-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-tight);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.meta-item {
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

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
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

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
}

.article-content {
  color: var(--text-color);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-2xl);
  
  :deep(h1) {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-xl) 0 var(--spacing-lg) 0;
    color: var(--text-color);
  }
  
  :deep(h2) {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    margin: var(--spacing-lg) 0 var(--spacing-md) 0;
    color: var(--text-color);
  }
  
  :deep(h3) {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin: var(--spacing-lg) 0 var(--spacing-md) 0;
    color: var(--text-color);
  }
  
  :deep(p) {
    margin-bottom: var(--spacing-lg);
    color: var(--text-secondary);
  }
  
  :deep(code) {
    font-family: var(--font-family-mono);
    font-size: 0.9em;
    background: rgba(var(--primary-color-rgb), 0.1);
    padding: 0.2em 0.4em;
    border-radius: var(--radius-sm);
    color: var(--primary-color);
  }
  
  :deep(pre) {
    background: #0d1117;
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    margin: var(--spacing-lg) 0;
    border: 1px solid var(--border-color);
    position: relative;
    
    code {
      background: none;
      padding: 0;
      color: #e6edf3;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    // 添加复制按钮样式
    &::before {
      content: 'Code';
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      background: rgba(255, 255, 255, 0.1);
      color: #e6edf3;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-family: var(--font-family-sans);
    }
  }
  
  // 代码高亮主题覆盖
  :deep(.hljs) {
    background: #0d1117 !important;
    color: #e6edf3 !important;
  }
  
  :deep(.hljs-keyword) {
    color: #ff7b72 !important;
  }
  
  :deep(.hljs-string) {
    color: #a5d6ff !important;
  }
  
  :deep(.hljs-comment) {
    color: #8b949e !important;
  }
  
  :deep(.hljs-number) {
    color: #79c0ff !important;
  }
  
  :deep(.hljs-function) {
    color: #d2a8ff !important;
  }
  
  :deep(strong) {
    font-weight: var(--font-weight-bold);
    color: var(--text-color);
  }
  
  :deep(em) {
    font-style: italic;
  }
}

.article-stats {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  
  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
}

.stat-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    transition: all var(--transition-fast);
  }
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
  }
  
  &--active {
    color: #ff6b6b;
    
    svg {
      stroke: #ff6b6b;
      fill: #ff6b6b;
    }
  }
}

.scroll-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--surface-color);
  z-index: 1;
}

.scroll-progress {
  height: 100%;
  background: var(--gradient-primary);
  transition: width 0.1s ease;
}

// 响应式调整
@include respond-to(md) {
  .article-title {
    font-size: var(--font-size-4xl);
  }
  
  .modal-content {
    margin: var(--spacing-2xl);
  }
  
  .article-stats {
    gap: var(--spacing-xl);
  }
}

// 自定义滚动条
.modal-body {
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--surface-color);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--text-color-rgb), 0.3);
    border-radius: var(--radius-full);
    
    &:hover {
      background: rgba(var(--text-color-rgb), 0.5);
    }
  }
}
</style>
