<template>
  <div class="about">
    <div class="container">
      <!-- 页面标题 -->
      <section class="about-header">
        <h1 class="page-title gradient-text">关于我</h1>
        <p class="page-subtitle">
          了解我的技能、经历和专业背景
        </p>
      </section>
      
      <!-- 个人简介 -->
      <section class="about-intro">
        <div class="intro-grid">
          <div class="intro-content">
            <h2>你好，我是前端工程师</h2>
            <p>
              专注于现代Web开发技术，拥有 <strong>5+年</strong> 的前端开发经验。
              热衷于探索新技术，致力于创建优雅、高性能的用户体验。
            </p>
            <p>
              我相信技术的力量能够改变世界，通过代码实现创意，
              将复杂的业务逻辑转化为直观易用的界面。
            </p>
            
            <div class="intro-stats">
              <div class="stat-item">
                <span class="stat-number">50+</span>
                <span class="stat-label">完成项目</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">5+</span>
                <span class="stat-label">工作经验</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">100+</span>
                <span class="stat-label">技术文章</span>
              </div>
            </div>
          </div>
          
          <div class="intro-avatar">
            <div class="avatar-container">
              <div class="avatar-image">
                <svg viewBox="0 0 24 24" class="avatar-placeholder">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M20 20c0-4.4-3.6-8-8-8s-8 3.6-8 8"/>
                </svg>
              </div>
              <div class="avatar-ring"></div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 技能雷达图 -->
      <section class="skills-section">
        <h2 class="section-title">技能雷达图</h2>
        <div class="skills-radar-container">
          <SkillRadar :skills="radarSkills" />
        </div>
      </section>
      
      <!-- 技术栈标签云 -->
      <section class="tech-stack-section">
        <h2 class="section-title">技术栈</h2>
        <TechStackCloud :technologies="technologies" />
      </section>
      
      <!-- 职业时间线 -->
      <section class="timeline-section">
        <h2 class="section-title">职业经历</h2>
        <CareerTimeline :experiences="experiences" />
      </section>
      
      <!-- 教育背景 -->
      <section class="education-section">
        <h2 class="section-title">教育背景</h2>
        <div class="education-grid">
          <div class="education-item card" v-for="edu in education" :key="edu.id">
            <div class="education-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <div class="education-content">
              <h3>{{ edu.degree }}</h3>
              <p class="education-school">{{ edu.school }}</p>
              <p class="education-year">{{ edu.year }}</p>
              <p class="education-description">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SkillRadar from '@/components/SkillRadar.vue'
import TechStackCloud from '@/components/TechStackCloud.vue'
import CareerTimeline from '@/components/CareerTimeline.vue'

gsap.registerPlugin(ScrollTrigger)

// 技能雷达图数据
const radarSkills = [
  { name: 'Vue.js', value: 95 },
  { name: 'React', value: 90 },
  { name: 'TypeScript', value: 88 },
  { name: 'Node.js', value: 82 },
  { name: 'Python', value: 75 },
  { name: 'Three.js', value: 85 },
  { name: 'WebGL', value: 78 },
  { name: 'UI/UX设计', value: 80 }
]

// 技术栈数据
const technologies = [
  { name: 'Vue.js', level: 'expert', category: 'frontend' },
  { name: 'React', level: 'expert', category: 'frontend' },
  { name: 'TypeScript', level: 'expert', category: 'language' },
  { name: 'JavaScript', level: 'expert', category: 'language' },
  { name: 'HTML5', level: 'expert', category: 'frontend' },
  { name: 'CSS3', level: 'expert', category: 'frontend' },
  { name: 'Sass/SCSS', level: 'expert', category: 'frontend' },
  { name: 'Tailwind CSS', level: 'advanced', category: 'frontend' },
  { name: 'Webpack', level: 'advanced', category: 'build' },
  { name: 'Vite', level: 'expert', category: 'build' },
  { name: 'Node.js', level: 'advanced', category: 'backend' },
  { name: 'Express', level: 'advanced', category: 'backend' },
  { name: 'MongoDB', level: 'intermediate', category: 'database' },
  { name: 'PostgreSQL', level: 'intermediate', category: 'database' },
  { name: 'Docker', level: 'intermediate', category: 'devops' },
  { name: 'Git', level: 'expert', category: 'tools' },
  { name: 'GSAP', level: 'advanced', category: 'animation' },
  { name: 'Three.js', level: 'advanced', category: 'graphics' },
  { name: 'WebGL', level: 'intermediate', category: 'graphics' },
  { name: 'D3.js', level: 'intermediate', category: 'graphics' }
]

// 职业经历数据
const experiences = [
  {
    id: 1,
    title: '资深前端工程师',
    company: '高途教育科技',
    period: '2020.03 - 2025.1',
    description: '负责小程序项目的前端架构设计和开发，带领团队完成多个重要项目。',
    achievements: [
      '主导前端架构升级，性能提升40%',
      '建立组件库和设计系统',
      '管理技术团队，完成项目目标'
    ],
    technologies: ['Vue 3', 'React', 'Vite', 'Pinia', '小程序', 'Uniapp', 'Node.js']
  },
  {
    id: 2,
    title: '高级前端工程师',
    company: '字节跳动',
    period: '2019.03 - 2020.03',
    description: '参与多个B端产品的开发，专注于用户体验优化和性能提升。',
    achievements: [
      '开发复杂数据可视化界面',
      '优化首屏加载时间至2秒内',
      '实现响应式设计适配'
    ],
    technologies: ['Vue', 'Vuex', 'Element UI', 'ECharts']
  },
  {
    id: 3,
    title: '中级前端工程师',
    company: '牛投邦科技',
    period: '2017.11 - 2019.03',
    description: '完成公司vue1.0到2.0的迁移工作，并负责新功能的开发。',
    achievements: [
      '开发nb-form、nb-table组件',
      '制定开发规范',
      '指导初级工程师'
    ],
    technologies: ['Vue 2', 'JavaScript', 'Element UI', 'Vuex']
  },
  {
    id: 3,
    title: '初级前端工程师',
    company: '北京厅客科技',
    period: '2015.09 - 2017.11',
    description: '完成公司vue1.0到2.0的迁移工作，并负责新功能的开发。',
    achievements: [
      '开发nb-form、nb-table组件',
      '制定开发规范',
      '指导初级工程师'
    ],
    technologies: ['Vue 2', 'JavaScript', 'Element UI', 'Vuex']
  }
]

// 教育背景数据
const education = [
  {
    id: 1,
    degree: '电子信息工程',
    school: '烟台大学',
    year: '2011 - 2015',
    description: '主修电子信息工程核心课程，专注于电子计算机和Web技术方向。'
  },
  // {
  //   id: 2,
  //   degree: '前端工程师认证',
  //   school: '在线学习平台',
  //   year: '2019',
  //   description: '系统学习现代前端开发技术，包括框架、工程化工具等。'
  // }
]

onMounted(() => {
  // 页面入场动画
  const tl = gsap.timeline()
  
  tl.from('.about-header', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })
  .from('.intro-content > *', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.intro-avatar', {
    duration: 1,
    scale: 0.8,
    opacity: 0,
    ease: 'back.out(1.7)'
  }, '-=0.8')
  
  // 滚动触发动画
  gsap.from('.section-title', {
    scrollTrigger: {
      trigger: '.section-title',
      start: 'top 80%',
      end: 'bottom 20%'
    },
    duration: 0.8,
    y: 30,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.about {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

.about-header {
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

.about-intro {
  margin-bottom: var(--spacing-3xl);
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
  
  @include respond-to(lg) {
    grid-template-columns: 2fr 1fr;
  }
}

.intro-content {
  h2 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-lg);
    color: var(--text-color);
  }
  
  p {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-lg);
    
    strong {
      color: var(--primary-color);
      font-weight: var(--font-weight-bold);
    }
  }
}

.intro-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

.stat-item {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
  }
  
  .stat-label {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
  }
}

.intro-avatar {
  display: flex;
  justify-content: center;
  
  @include respond-to(lg) {
    justify-content: flex-end;
  }
}

.avatar-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  
  .avatar-placeholder {
    width: 150px;
    height: 150px;
    fill: white;
  }
}

.avatar-ring {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border: 3px solid transparent;
  border-radius: 50%;
  background: var(--gradient-secondary);
  background-clip: padding-box;
  z-index: 1;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.section-title {
  font-size: var(--font-size-3xl);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  @include gradient-text;
}

.skills-section {
  margin-bottom: var(--spacing-3xl);
}

.skills-radar-container {
  display: flex;
  justify-content: center;
}

.tech-stack-section {
  margin-bottom: var(--spacing-3xl);
}

.timeline-section {
  margin-bottom: var(--spacing-3xl);
}

.education-section {
  margin-bottom: var(--spacing-2xl);
}

.education-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  
  @include respond-to(md) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.education-item {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
  
  .education-icon {
    width: 60px;
    height: 60px;
    background: var(--gradient-primary);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
  }
  
  .education-content {
    flex: 1;
    
    h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-sm);
      color: var(--text-color);
    }
    
    .education-school {
      color: var(--primary-color);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-xs);
    }
    
    .education-year {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-sm);
    }
    
    .education-description {
      color: var(--text-secondary);
      line-height: var(--line-height-relaxed);
    }
  }
}

// 响应式调整
@include respond-to(md) {
  .intro-stats {
    gap: var(--spacing-2xl);
  }
  
  .stat-item .stat-number {
    font-size: var(--font-size-5xl);
  }
}
</style>
