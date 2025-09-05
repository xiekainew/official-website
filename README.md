# 个人官网 - Vue3 微前端应用

## 🎯 项目概述

这是一个基于Vue 3的现代化个人官网项目，集成了qiankun微前端架构，具备完整的技术展示、项目展示、博客等功能。项目采用组件化开发，支持主题切换，包含丰富的动画效果和技术实验。

## 🚀 技术栈

### 核心框架
- **Vue 3** - 采用 Composition API + `<script setup>` 语法
- **Vue Router 4** - 单页应用路由管理
- **Pinia** - 现代化状态管理
- **qiankun** - 微前端框架支持

### 构建工具
- **Vue CLI** - 项目构建和开发服务器
- **Webpack** - 模块打包工具

### 样式技术
- **Sass/SCSS** - CSS 预处理器
- **CSS 变量** - 动态主题系统
- **现代 CSS 特性** - Grid、Flexbox、动画等

### 动画与交互
- **GSAP** - 高性能动画库
- **Three.js** - 3D 图形渲染
- **D3.js** - 数据可视化
- **CSS 动画** - 纯 CSS 实现的各种效果

### 其他特性
- **@vueuse/core** - Vue 组合式工具库
- **Sentry** - 错误监控和性能追踪
- **响应式设计** - 适配所有设备
- **主题系统** - 支持明暗主题自动切换

## 📁 项目结构

```
src/
├── components/              # 可复用组件
│   ├── Navigation.vue       # 导航栏组件
│   ├── TypewriterText.vue   # 打字机效果组件
│   ├── SkillCard.vue        # 技能卡片组件
│   ├── SkillRadar.vue       # 技能雷达图组件
│   ├── TechStackCloud.vue   # 技术栈标签云组件
│   ├── CareerTimeline.vue   # 职业时间线组件
│   ├── ProjectCard.vue      # 项目卡片组件
│   ├── ProjectModal.vue     # 项目详情弹窗
│   ├── ExperimentCard.vue   # 技术实验卡片
│   ├── ArticleCard.vue      # 文章卡片组件
│   └── ArticleModal.vue     # 文章详情弹窗
├── views/                   # 页面组件
│   ├── Index.vue            # 首页（带3D背景效果）
│   ├── Abouts.vue           # 关于我页面
│   ├── Projects.vue         # 项目展示页面
│   ├── TechPlayground.vue   # 技术实验场
│   ├── Blog.vue             # 技术博客页面
│   └── Contact.vue          # 联系页面
├── experiments/             # 技术实验演示
│   ├── ParticleSystem.vue   # 粒子系统演示
│   └── CSSAnimations.vue    # CSS 动画演示
├── stores/                  # 状态管理
│   ├── index.js             # Pinia 配置
│   └── theme.js             # 主题状态管理
├── styles/                  # 全局样式
│   ├── variables.scss       # CSS 变量和混入
│   └── global.scss          # 全局样式定义
├── router/                  # 路由配置
│   └── index.js             # 路由定义和配置
├── utils/                   # 工具函数
├── hooks/                   # Vue 组合式函数
├── public-path.js           # qiankun 微前端资源路径配置
└── main.js                  # 应用入口文件
```

## 🎨 核心功能

### 1. 首页 (Index.vue)
- ✅ 3D 交互式背景效果（Canvas + WebGL）
- ✅ 打字机效果的文字动画
- ✅ 响应式英雄区域设计
- ✅ 平滑滚动导航
- ✅ 技能预览卡片展示

### 2. 关于我页面 (Abouts.vue)
- ✅ 技能雷达图（D3.js 实现）
- ✅ 职业时间线动画
- ✅ 技术栈标签云展示
- ✅ 个人信息和经历展示

### 3. 项目展示 (Projects.vue)
- ✅ 项目卡片式展示
- ✅ 项目详情弹窗
- ✅ 项目筛选和分类
- ✅ 外部链接跳转

### 4. 技术实验场 (TechPlayground.vue)
- ✅ 粒子系统演示
- ✅ CSS 3D 动画效果
- ✅ 交互式技术演示
- ✅ 实验代码展示

### 5. 技术博客 (Blog.vue)
- ✅ 文章列表展示
- ✅ 文章详情弹窗
- ✅ 文章搜索和筛选
- ✅ 标签分类系统

### 6. 联系页面 (Contact.vue)
- ✅ 联系方式展示
- ✅ 社交媒体链接
- ✅ 交互式联系表单

## 🎯 核心特性

### 微前端支持
- **qiankun 集成** - 支持作为微应用运行
- **独立部署** - 可单独运行或集成到主应用
- **资源隔离** - 完整的样式和 JS 隔离

### 主题系统
- **明暗主题** - 自动检测系统主题偏好
- **动态切换** - 实时主题切换效果
- **CSS 变量** - 基于 CSS 自定义属性的主题系统

### 性能优化
- **组件懒加载** - 按需加载页面组件
- **错误监控** - Sentry 集成的错误追踪
- **动画优化** - GSAP 高性能动画实现

### 用户体验
- **响应式设计** - 完美适配移动端和桌面端
- **平滑动画** - 页面切换和交互动画
- **无障碍支持** - 语义化 HTML 和键盘导航

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
yarn install
```

### 开发服务器
```bash
yarn dev
# 开发服务器运行在 http://localhost:8001
```

### 构建生产版本
```bash
yarn build
```

### 代码检查
```bash
yarn lint
```

## ⚙️ 配置说明

### 微前端配置
项目已配置为 qiankun 微应用：
- 端口：8001
- UMD 格式打包
- 支持跨域资源共享
- 动态 public path 配置

### 主题配置
在 `src/stores/theme.js` 中配置主题：
```javascript
const theme = computed(() => ({
  mode: isDark.value ? 'dark' : 'light',
  primary: primaryColor.value,
  background: isDark.value ? '#0a0a0a' : '#ffffff',
  // ... 更多主题配置
}))
```

### 路由配置
支持的路由页面：
- `/` - 首页
- `/about` - 关于我
- `/projects` - 项目展示
- `/playground` - 技术实验场
- `/blog` - 技术博客
- `/contact` - 联系方式

## 📱 响应式设计

项目采用移动端优先的响应式设计：
- 手机端：< 768px
- 平板端：768px - 1024px
- 桌面端：> 1024px

## 🎨 自定义配置

### 修改个人信息
1. 更新 `src/views/Index.vue` 中的个人介绍
2. 修改 `src/views/Abouts.vue` 中的技能和经历
3. 更新 `src/views/Projects.vue` 中的项目数据
4. 配置 `src/views/Contact.vue` 中的联系方式

### 添加新的技术实验
在 `src/experiments/` 目录下创建新的 Vue 组件，然后在 `TechPlayground.vue` 中引用。

### 自定义主题
修改 `src/styles/variables.scss` 中的 CSS 变量来自定义主题样式。

## 🔧 部署建议

### 作为独立应用部署
```bash
yarn build
# 将 dist 目录部署到静态服务器
```

### 作为微前端应用部署
确保主应用正确配置了 qiankun，并注册本应用的入口地址。

## 📝 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 采用 Vue 3 Composition API
- 使用 `<script setup>` 语法糖
- 遵循组件化开发原则

### Git 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 样式调整
- refactor: 代码重构
- perf: 性能优化

## 🐛 问题反馈

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- Email：[您的邮箱]

## 📄 许可证

MIT License

---

**注意**: 这是一个个人网站项目，展示了现代前端技术的综合应用。项目集成了微前端架构、3D 动画、数据可视化等多种技术，适合作为前端技术学习和展示的参考。