// 懒加载路由组件 - 支持代码分割和加载提示
const Home = () => import(
  /* webpackChunkName: "home" */ 
  /* webpackPreload: true */
  '@/views/Index.vue'
)
const About = () => import(
  /* webpackChunkName: "about" */ 
  '@/views/Abouts.vue'
)
const Projects = () => import(
  /* webpackChunkName: "projects" */ 
  '@/views/Projects.vue'
)
const TechPlayground = () => import(
  /* webpackChunkName: "playground" */ 
  '@/views/TechPlayground.vue'
)
const Blog = () => import(
  /* webpackChunkName: "blog" */ 
  '@/views/Blog.vue'
)
const Contact = () => import(
  /* webpackChunkName: "contact" */ 
  '@/views/Contact.vue'
)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页 - 交互式技术游乐场'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于我 - 技术探索者'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: {
      title: '项目展示 - 技术实现'
    }
  },
  {
    path: '/playground',
    name: 'TechPlayground',
    component: TechPlayground,
    meta: {
      title: '技术实验场 - 前端技术演示'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: '技术博客 - 知识分享'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: '联系方式 - 技术合作'
    }
  }
]

export default routes
