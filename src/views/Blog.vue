<template>
  <div class="blog-page">
    <!-- 左侧文章列表 -->
    <aside class="article-sidebar">
      <div class="sidebar-header">
        <h2>技术博客</h2>
      </div>
      <div class="article-list">
        <div
          v-for="article in articles"
          :key="article.id"
          class="article-item"
          :class="{ 'article-item--active': selectedArticle?.id === article.id }"
          @click="selectArticle(article)"
        >
          <h3 class="article-title">{{ article.title }}</h3>
          <!-- <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-meta">
            <span class="article-date">{{ formatDate(article.publishDate) }}</span>
            <span class="article-views">{{ article.views }} 阅读</span>
          </div> -->
          <!-- <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div> -->
        </div>
      </div>
    </aside>

    <!-- 右侧文章内容 -->
    <main class="article-content">
      <div v-if="!selectedArticle" class="welcome-message">
        <h2>欢迎来到技术博客</h2>
        <p>请从左侧选择一篇文章开始阅读</p>
      </div>
      
      <div v-else-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <article v-else class="article">
        <header class="article-header">
          <h1>{{ selectedArticle.title }}</h1>
          <div class="article-info">
            <span class="author">{{ selectedArticle.author }}</span>
            <span class="date">{{ formatDate(selectedArticle.publishDate) }}</span>
            <span class="read-time">{{ selectedArticle.readTime }} 分钟阅读</span>
            <span class="views">{{ selectedArticle.views }} 次阅读</span>
          </div>
          <div class="article-tags">
            <span v-for="tag in selectedArticle.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>
        
        <div class="article-body" v-html="selectedArticle.renderedContent"></div>
      </article>
    </main>
  </div>
</template>

<script>
import { getArticles, getArticleById } from '@/data/articles'

export default {
  name: 'Blog',
  data() {
    return {
      articles: [],
      selectedArticle: null,
      loading: false
    }
  },
  async created() {
    this.articles = getArticles()
  },
  methods: {
    async selectArticle(article) {
      if (this.selectedArticle?.id === article.id) return
      
      this.loading = true
      try {
        this.selectedArticle = await getArticleById(article.id)
      } catch (error) {
        console.error('Failed to load article:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-page {
  display: flex;
  height: 100vh;
  background: var(--bg-primary);
}

// 左侧文章列表
.article-sidebar {
  width: 300px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .sidebar-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);

    h2 {
      margin: 0;
      font-size: var(--font-size-xl);
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .article-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-sm);
  }
}

.article-item {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.1);
  }

  &--active {
    border-color: var(--primary-color);
    background: rgba(var(--primary-color-rgb), 0.05);
  }

  .article-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-md);
    color: var(--text-primary);
    font-weight: 600;
    line-height: 1.4;
  }

  .article-excerpt {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);

    .tag {
      padding: 2px 6px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border-radius: 3px;
      font-size: 10px;
      font-weight: 500;
    }
  }
}

// 右侧文章内容
.article-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  color: var(--text-secondary);

  h2 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-xl);
    color: var(--text-primary);
  }

  p {
    margin: 0;
    font-size: var(--font-size-md);
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: var(--text-secondary);
  font-size: var(--font-size-md);
}

.article {
  max-width: 800px;
  margin: 0 auto;

  .article-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);

    h1 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-2xl);
      color: var(--text-primary);
      font-weight: 700;
      line-height: 1.3;
    }

    .article-info {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);

      span {
        &::after {
          content: '•';
          margin-left: var(--spacing-md);
          color: var(--text-tertiary);
        }

        &:last-child::after {
          display: none;
        }
      }
    }

    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);

      .tag {
        padding: var(--spacing-xs) var(--spacing-sm);
        background: var(--bg-secondary);
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        border-radius: var(--border-radius);
        font-size: var(--font-size-xs);
        font-weight: 500;
      }
    }
  }

  .article-body {
    color: var(--text-primary);
    line-height: 1.7;
    font-size: var(--font-size-md);

    :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
      margin: var(--spacing-xl) 0 var(--spacing-md) 0;
      color: var(--text-primary);
      font-weight: 600;
    }

    :deep(h1) { font-size: var(--font-size-xl); }
    :deep(h2) { font-size: var(--font-size-lg); }
    :deep(h3) { font-size: var(--font-size-md); }

    :deep(p) {
      margin: 0 0 var(--spacing-md) 0;
      line-height: 1.7;
    }

    :deep(ul), :deep(ol) {
      margin: 0 0 var(--spacing-md) 0;
      padding-left: var(--spacing-lg);
    }

    :deep(li) {
      margin-bottom: var(--spacing-xs);
    }

    :deep(blockquote) {
      margin: var(--spacing-lg) 0;
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--bg-secondary);
      border-left: 4px solid var(--primary-color);
      border-radius: var(--border-radius);
      color: var(--text-secondary);
      font-style: italic;
    }

    :deep(code) {
      padding: 2px 4px;
      background: var(--bg-secondary);
      color: var(--primary-color);
      border-radius: 3px;
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }

    :deep(pre) {
      margin: var(--spacing-lg) 0;
      padding: var(--spacing-lg);
      background: var(--bg-secondary);
      border-radius: var(--border-radius);
      overflow-x: auto;
      border: 1px solid var(--border-color);

      code {
        padding: 0;
        background: none;
        color: var(--text-primary);
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      margin: var(--spacing-lg) 0;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: var(--spacing-lg) 0;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    :deep(th), :deep(td) {
      padding: var(--spacing-sm) var(--spacing-md);
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    :deep(th) {
      background: var(--bg-secondary);
      font-weight: 600;
      color: var(--text-primary);
    }

    :deep(tr:last-child td) {
      border-bottom: none;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .blog-page {
    flex-direction: column;
    height: auto;
  }

  .article-sidebar {
    width: 100%;
    height: 40vh;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .article-content {
    padding: var(--spacing-md);
  }

  .article {
    .article-header {
      h1 {
        font-size: var(--font-size-xl);
      }

      .article-info {
        flex-direction: column;
        gap: var(--spacing-xs);

        span::after {
          display: none;
        }
      }
    }
  }
}
</style>