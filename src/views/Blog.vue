<template>
  <div class="blog">
    <div class="container">
      <!-- 页面标题 -->
      <section class="blog-header">
        <h1 class="page-title gradient-text">技术博客</h1>
        <p class="page-subtitle">
          分享技术见解与学习心得
        </p>
      </section>
      
      <!-- 搜索和筛选 -->
      <section class="blog-controls">
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索文章..."
            class="search-input"
          />
        </div>
        
        <div class="filter-tags">
          <button
            v-for="tag in allTags"
            :key="tag"
            class="tag-filter"
            :class="{ 'tag-filter--active': selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </section>
      
      <!-- 文章列表 -->
      <section class="blog-content">
        <div class="articles-list">
          <TransitionGroup name="article" tag="div">
            <ArticleCard
              v-for="article in filteredArticles"
              :key="article.id"
              :article="article"
              @click="openArticle(article)"
            />
          </TransitionGroup>
          
          <!-- 空状态 -->
          <div v-if="filteredArticles.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <h3>暂无文章</h3>
            <p>没有找到匹配的文章，请尝试调整搜索条件</p>
          </div>
        </div>
        
        <!-- 侧边栏 -->
        <aside class="blog-sidebar">
          <!-- 热门文章 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">热门文章</h3>
            <div class="popular-articles">
              <a 
                v-for="article in popularArticles" 
                :key="article.id"
                href="#"
                class="popular-item"
                @click.prevent="openArticle(article)"
              >
                <div class="popular-meta">
                  <span class="popular-title">{{ article.title }}</span>
                  <span class="popular-views">{{ article.views }} 次阅读</span>
                </div>
              </a>
            </div>
          </div>
          
          <!-- 标签云 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">标签云</h3>
            <div class="tag-cloud">
              <span 
                v-for="tag in tagCloud" 
                :key="tag.name"
                class="cloud-tag"
                :style="{ fontSize: tag.size + 'rem' }"
                @click="toggleTag(tag.name)"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
          
          <!-- 归档 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">文章归档</h3>
            <div class="archive-list">
              <div 
                v-for="archive in archives" 
                :key="archive.month"
                class="archive-item"
              >
                <span class="archive-date">{{ archive.month }}</span>
                <span class="archive-count">({{ archive.count }})</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
    
    <!-- 文章详情弹窗 -->
    <ArticleModal 
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeArticle"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import ArticleCard from '@/components/ArticleCard.vue'
import ArticleModal from '@/components/ArticleModal.vue'

const searchQuery = ref('')
const selectedTags = ref([])
const selectedArticle = ref(null)

// 文章数据
const articles = [
  {
    id: 1,
    title: 'Vue 3 Composition API 最佳实践',
    excerpt: '深入探讨Vue 3 Composition API的使用技巧和最佳实践，包括逻辑复用、状态管理等方面。',
    content: `# Vue 3 Composition API 最佳实践

Vue 3 的 Composition API 为我们提供了更灵活的方式来组织和复用组件逻辑...

## 基本概念

Composition API 的核心是 \`setup\` 函数，它在组件创建之前执行...

\`\`\`javascript
import { ref, reactive, computed, watch } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({ name: 'Vue 3' })
    
    const doubleCount = computed(() => count.value * 2)
    
    watch(count, (newVal, oldVal) => {
      console.log(\`Count changed from \${oldVal} to \${newVal}\`)
    })
    
    return {
      count,
      state,
      doubleCount
    }
  }
}
\`\`\`

## 逻辑复用

使用组合式函数（Composables）来实现逻辑复用...`,
    tags: ['Vue.js', 'Composition API', '前端框架'],
    category: 'frontend',
    publishDate: '2024-01-15',
    readTime: 8,
    views: 1240,
    likes: 89,
    author: '前端工程师',
    featured: true
  },
  {
    id: 2,
    title: 'WebGL着色器编程入门',
    excerpt: '从零开始学习WebGL着色器编程，了解顶点着色器和片段着色器的基本概念。',
    content: `# WebGL着色器编程入门

WebGL着色器是运行在GPU上的小程序，用于处理图形渲染...`,
    tags: ['WebGL', 'GLSL', '图形编程'],
    category: 'graphics',
    publishDate: '2024-01-10',
    readTime: 12,
    views: 856,
    likes: 67,
    author: '前端工程师',
    featured: false
  },
  {
    id: 3,
    title: 'TypeScript 高级类型系统详解',
    excerpt: '深入理解TypeScript的高级类型系统，包括泛型、条件类型、映射类型等。',
    content: `# TypeScript 高级类型系统详解

TypeScript的类型系统非常强大，提供了许多高级特性...`,
    tags: ['TypeScript', '类型系统', '编程语言'],
    category: 'language',
    publishDate: '2024-01-08',
    readTime: 10,
    views: 1120,
    likes: 95,
    author: '前端工程师',
    featured: true
  },
  {
    id: 4,
    title: '现代CSS布局技术对比',
    excerpt: '比较Flexbox、Grid、Container Query等现代CSS布局技术的优缺点和使用场景。',
    content: `# 现代CSS布局技术对比

现代CSS提供了多种布局技术，每种都有其独特的优势...`,
    tags: ['CSS', '布局', 'Flexbox', 'Grid'],
    category: 'css',
    publishDate: '2024-01-05',
    readTime: 6,
    views: 742,
    likes: 54,
    author: '前端工程师',
    featured: false
  },
  {
    id: 5,
    title: 'Node.js性能优化实战',
    excerpt: '从内存管理、事件循环、集群等角度分析Node.js性能优化的方法和技巧。',
    content: `# Node.js性能优化实战

Node.js应用的性能优化是一个复杂的主题...`,
    tags: ['Node.js', '性能优化', '后端'],
    category: 'backend',
    publishDate: '2024-01-03',
    readTime: 15,
    views: 986,
    likes: 78,
    author: '前端工程师',
    featured: false
  },
  {
    id: 6,
    title: 'Web组件设计系统构建指南',
    excerpt: '如何从零开始构建一个可维护、可扩展的Web组件设计系统。',
    content: `# Web组件设计系统构建指南

设计系统是现代Web开发的重要组成部分...`,
    tags: ['设计系统', '组件化', 'UI/UX'],
    category: 'design',
    publishDate: '2024-01-01',
    readTime: 9,
    views: 634,
    likes: 43,
    author: '前端工程师',
    featured: false
  }
]

// 计算属性
const allTags = computed(() => {
  const tags = new Set()
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

const filteredArticles = computed(() => {
  let filtered = articles

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 标签过滤
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(article =>
      selectedTags.value.every(tag => article.tags.includes(tag))
    )
  }

  return filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
})

const popularArticles = computed(() => {
  return articles
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})

const tagCloud = computed(() => {
  const tagCounts = {}
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const maxCount = Math.max(...Object.values(tagCounts))
  const minCount = Math.min(...Object.values(tagCounts))

  return Object.entries(tagCounts).map(([tag, count]) => ({
    name: tag,
    count,
    size: 0.8 + (count - minCount) / (maxCount - minCount) * 0.8
  }))
})

const archives = computed(() => {
  const archiveMap = {}
  articles.forEach(article => {
    const date = new Date(article.publishDate)
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`
    archiveMap[monthKey] = (archiveMap[monthKey] || 0) + 1
  })

  return Object.entries(archiveMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => b.month.localeCompare(a.month))
})

// 方法
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const openArticle = (article) => {
  selectedArticle.value = article
  // 增加阅读量
  article.views++
}

const closeArticle = () => {
  selectedArticle.value = null
}

onMounted(() => {
  // 页面入场动画
  gsap.from('.blog-header', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })
  
  gsap.from('.blog-controls', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.3
  })
  
  gsap.from('.article-card', {
    duration: 0.6,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    delay: 0.5
  })
  
  gsap.from('.blog-sidebar > *', {
    duration: 0.6,
    x: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.8
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.blog {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

.blog-header {
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

.blog-controls {
  margin-bottom: var(--spacing-2xl);
}

.search-bar {
  position: relative;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
  
  .search-icon {
    position: absolute;
    left: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    stroke: var(--text-secondary);
    fill: none;
    stroke-width: 2;
  }
  
  .search-input {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) calc(var(--spacing-md) + 30px);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-full);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-fast);
    
    &:focus {
      border-color: var(--primary-color);
    }
  }
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
}

.tag-filter {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
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

.blog-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
  
  @include respond-to(lg) {
    grid-template-columns: 2fr 1fr;
  }
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--text-secondary);
  
  .empty-icon {
    width: 80px;
    height: 80px;
    fill: var(--text-secondary);
    opacity: 0.5;
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
  }
}

.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.sidebar-section {
  @include card;
}

.sidebar-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);
}

.popular-articles {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.popular-item {
  display: block;
  text-decoration: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
  }
}

.popular-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.popular-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-color);
  line-height: var(--line-height-tight);
}

.popular-views {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.cloud-tag {
  color: var(--primary-color);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    transform: scale(1.1);
  }
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.archive-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary-color);
  }
}

.archive-date {
  font-weight: var(--font-weight-medium);
}

.archive-count {
  opacity: 0.7;
}

// 文章卡片过渡动画
.article-enter-active,
.article-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.article-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.article-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

// 响应式调整
@include respond-to(md) {
  .filter-tags {
    gap: var(--spacing-md);
  }
}
</style>
