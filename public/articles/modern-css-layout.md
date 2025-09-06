# 现代CSS布局技术对比

现代CSS提供了多种布局技术，每种都有其独特的优势和适用场景。本文将详细对比Flexbox、Grid、Container Query等技术。

## Flexbox 布局

Flexbox（弹性盒子布局）是一维布局方法，特别适合处理行或列的布局：

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.flex-item {
  flex: 1; /* 等分剩余空间 */
}

.flex-item--grow {
  flex-grow: 2; /* 占用更多空间 */
}
```

### Flexbox 优势

- 简单易用，学习成本低
- 完美的垂直居中解决方案
- 灵活的空间分配
- 良好的浏览器支持

### 适用场景

- 导航栏布局
- 卡片内容对齐
- 表单元素排列
- 工具栏按钮组

## Grid 布局

CSS Grid 是二维布局系统，可以同时处理行和列：

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### Grid 优势

- 强大的二维布局能力
- 精确的网格控制
- 响应式设计友好
- 复杂布局的最佳选择

### 适用场景

- 页面整体布局
- 复杂的卡片网格
- 仪表板布局
- 图片画廊

## Container Queries

Container Queries 允许根据容器大小而不是视口大小来应用样式：

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
  
  .card__image {
    width: 40%;
  }
  
  .card__content {
    width: 60%;
  }
}

@container card (max-width: 399px) {
  .card {
    display: block;
  }
  
  .card__image {
    width: 100%;
  }
}
```

### Container Queries 优势

- 真正的组件级响应式设计
- 更精确的布局控制
- 组件可重用性更强

## 实际应用对比

### 导航栏布局

```css
/* Flexbox 方案 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.navbar__brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar__menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

/* Grid 方案 */
.navbar-grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 1rem 2rem;
}
```

### 卡片网格布局

```css
/* Grid 方案（推荐） */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Flexbox 方案 */
.card-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card-flex > * {
  flex: 1 1 300px;
}
```

### 响应式侧边栏

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .sidebar {
    order: 2;
  }
}
```

## 性能考虑

### Flexbox 性能

- 计算复杂度相对较低
- 适合简单的一维布局
- 在大量元素时性能良好

### Grid 性能

- 初始计算成本较高
- 复杂布局时性能优势明显
- 浏览器优化程度高

### 优化建议

```css
/* 使用 will-change 提示浏览器优化 */
.dynamic-grid {
  will-change: grid-template-columns;
}

/* 避免不必要的重排 */
.optimized-flex {
  contain: layout style;
}
```

## 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Flexbox | 29+ | 28+ | 9+ | 12+ |
| Grid | 57+ | 52+ | 10.1+ | 16+ |
| Container Queries | 105+ | 110+ | 16+ | 105+ |

## 选择指南

### 使用 Flexbox 当：
- 需要一维布局（行或列）
- 简单的对齐需求
- 动态内容大小
- 需要良好的旧浏览器支持

### 使用 Grid 当：
- 需要二维布局
- 复杂的网格系统
- 精确的布局控制
- 响应式设计需求

### 使用 Container Queries 当：
- 组件级响应式设计
- 可重用组件
- 复杂的容器适配需求

## 最佳实践

1. **渐进增强**：从基础布局开始，逐步添加高级特性
2. **组合使用**：Flexbox 和 Grid 可以很好地配合使用
3. **性能优先**：选择最适合场景的技术
4. **可维护性**：保持代码简洁和可读性

## 总结

现代CSS布局技术为我们提供了强大的工具来创建复杂而灵活的布局。关键是要理解每种技术的优势和适用场景，并根据具体需求做出合适的选择。
