import { marked } from 'marked'
import hljs from 'highlight.js'

// 配置marked
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true
})

// 文章元数据
const articlesMetadata = [
  {
    id: 1,
    title: 'Vue 3 Composition API 最佳实践',
    excerpt: '深入探讨Vue 3 Composition API的使用技巧和最佳实践，包括逻辑复用、状态管理等方面。',
    tags: ['Vue.js', 'Composition API', '前端框架'],
    category: 'frontend',
    publishDate: '2024-01-15',
    readTime: 8,
    views: 1240,
    likes: 89,
    author: '前端工程师',
    featured: true,
    filename: 'vue3-composition-api.md'
  },
  {
    id: 2,
    title: 'WebGL着色器编程入门',
    excerpt: '从零开始学习WebGL着色器编程，了解顶点着色器和片段着色器的基本概念。',
    tags: ['WebGL', 'GLSL', '图形编程'],
    category: 'graphics',
    publishDate: '2024-01-10',
    readTime: 12,
    views: 856,
    likes: 67,
    author: '前端工程师',
    featured: false,
    filename: 'webgl-shader-programming.md'
  },
  {
    id: 3,
    title: 'TypeScript 高级类型系统详解',
    excerpt: '深入理解TypeScript的高级类型系统，包括泛型、条件类型、映射类型等。',
    tags: ['TypeScript', '类型系统', '编程语言'],
    category: 'language',
    publishDate: '2024-01-08',
    readTime: 10,
    views: 1120,
    likes: 95,
    author: '前端工程师',
    featured: true,
    filename: 'typescript-advanced-types.md'
  },
  {
    id: 4,
    title: '现代CSS布局技术对比',
    excerpt: '比较Flexbox、Grid、Container Query等现代CSS布局技术的优缺点和使用场景。',
    tags: ['CSS', '布局', 'Flexbox', 'Grid'],
    category: 'css',
    publishDate: '2024-01-05',
    readTime: 6,
    views: 742,
    likes: 54,
    author: '前端工程师',
    featured: false,
    filename: 'modern-css-layout.md'
  },
  {
    id: 5,
    title: 'Node.js性能优化实战',
    excerpt: '从内存管理、事件循环、集群等角度分析Node.js性能优化的方法和技巧。',
    tags: ['Node.js', '性能优化', '后端'],
    category: 'backend',
    publishDate: '2024-01-03',
    readTime: 15,
    views: 986,
    likes: 78,
    author: '前端工程师',
    featured: false,
    filename: 'nodejs-performance-optimization.md'
  },
  {
    id: 6,
    title: 'Web组件设计系统构建指南',
    excerpt: '如何从零开始构建一个可维护、可扩展的Web组件设计系统。',
    tags: ['设计系统', '组件化', 'UI/UX'],
    category: 'design',
    publishDate: '2024-01-01',
    readTime: 9,
    views: 634,
    likes: 43,
    author: '前端工程师',
    featured: false,
    filename: 'web-component-design-system.md'
  }
]

// 缓存已加载的文章内容
const articleContentCache = new Map()

/**
 * 动态导入Markdown文件内容
 * @param {string} filename - 文件名
 * @returns {Promise<string>} - 文章内容
 */
async function loadArticleContent(filename) {
  if (articleContentCache.has(filename)) {
    return articleContentCache.get(filename)
  }

  try {
    // 使用fetch从public目录加载markdown文件
    const response = await fetch(`/articles/${filename}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const content = await response.text()
    
    // 缓存内容
    articleContentCache.set(filename, content)
    return content
  } catch (error) {
    console.error(`Failed to load article: ${filename}`, error)
    return '# 文章加载失败\n\n抱歉，无法加载此文章内容。'
  }
}

/**
 * 渲染Markdown内容为HTML
 * @param {string} markdown - Markdown内容
 * @returns {string} - 渲染后的HTML
 */
function renderMarkdown(markdown) {
  return marked(markdown)
}

/**
 * 获取所有文章列表（仅元数据）
 * @returns {Array} - 文章元数据数组
 */
export function getArticles() {
  return articlesMetadata.map(article => ({
    ...article,
    // 不包含完整内容，只有摘要
    content: article.excerpt
  }))
}

/**
 * 根据ID获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise<Object|null>} - 文章详情对象
 */
export async function getArticleById(id) {
  const metadata = articlesMetadata.find(article => article.id === id)
  if (!metadata) {
    return null
  }

  try {
    const content = await loadArticleContent(metadata.filename)
    const renderedContent = renderMarkdown(content)
    
    return {
      ...metadata,
      content: content, // 原始Markdown内容
      renderedContent: renderedContent // 渲染后的HTML内容
    }
  } catch (error) {
    console.error(`Error loading article ${id}:`, error)
    return {
      ...metadata,
      content: '# 文章加载失败\n\n抱歉，无法加载此文章内容。',
      renderedContent: '<h1>文章加载失败</h1><p>抱歉，无法加载此文章内容。</p>'
    }
  }
}

/**
 * 根据标签筛选文章
 * @param {Array<string>} tags - 标签数组
 * @returns {Array} - 筛选后的文章数组
 */
export function getArticlesByTags(tags) {
  if (!tags || tags.length === 0) {
    return getArticles()
  }

  return articlesMetadata
    .filter(article => 
      tags.every(tag => article.tags.includes(tag))
    )
    .map(article => ({
      ...article,
      content: article.excerpt
    }))
}

/**
 * 根据分类获取文章
 * @param {string} category - 分类名称
 * @returns {Array} - 筛选后的文章数组
 */
export function getArticlesByCategory(category) {
  return articlesMetadata
    .filter(article => article.category === category)
    .map(article => ({
      ...article,
      content: article.excerpt
    }))
}

/**
 * 搜索文章
 * @param {string} query - 搜索关键词
 * @returns {Array} - 搜索结果数组
 */
export function searchArticles(query) {
  if (!query || query.trim() === '') {
    return getArticles()
  }

  const searchTerm = query.toLowerCase().trim()
  
  return articlesMetadata
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
    .map(article => ({
      ...article,
      content: article.excerpt
    }))
}

/**
 * 获取热门文章
 * @param {number} limit - 限制数量
 * @returns {Array} - 热门文章数组
 */
export function getPopularArticles(limit = 5) {
  return articlesMetadata
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(article => ({
      ...article,
      content: article.excerpt
    }))
}

/**
 * 获取精选文章
 * @returns {Array} - 精选文章数组
 */
export function getFeaturedArticles() {
  return articlesMetadata
    .filter(article => article.featured)
    .map(article => ({
      ...article,
      content: article.excerpt
    }))
}

/**
 * 获取最新文章
 * @param {number} limit - 限制数量
 * @returns {Array} - 最新文章数组
 */
export function getLatestArticles(limit = 10) {
  return articlesMetadata
    .slice()
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, limit)
    .map(article => ({
      ...article,
      content: article.excerpt
    }))
}

/**
 * 获取所有标签
 * @returns {Array<string>} - 标签数组
 */
export function getAllTags() {
  const tags = new Set()
  articlesMetadata.forEach(article => {
    article.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
}

/**
 * 获取标签云数据
 * @returns {Array<Object>} - 标签云数据
 */
export function getTagCloud() {
  const tagCounts = {}
  articlesMetadata.forEach(article => {
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
}

/**
 * 获取文章归档数据
 * @returns {Array<Object>} - 归档数据
 */
export function getArchives() {
  const archiveMap = {}
  articlesMetadata.forEach(article => {
    const date = new Date(article.publishDate)
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`
    archiveMap[monthKey] = (archiveMap[monthKey] || 0) + 1
  })

  return Object.entries(archiveMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => b.month.localeCompare(a.month))
}

/**
 * 增加文章阅读量
 * @param {number} id - 文章ID
 */
export function incrementArticleViews(id) {
  const article = articlesMetadata.find(article => article.id === id)
  if (article) {
    article.views++
  }
}

/**
 * 切换文章点赞状态
 * @param {number} id - 文章ID
 * @param {boolean} isLiked - 是否点赞
 */
export function toggleArticleLike(id, isLiked) {
  const article = articlesMetadata.find(article => article.id === id)
  if (article) {
    article.likes += isLiked ? 1 : -1
  }
}
