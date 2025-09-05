<template>
  <div class="career-timeline">
    <div class="timeline-container">
      <div class="timeline-line" ref="timelineLine"></div>
      
      <div 
        v-for="(experience, index) in experiences" 
        :key="experience.id"
        class="timeline-item"
        :class="{ 'timeline-item--alternate': index % 2 === 1 }"
        ref="timelineItems"
      >
        <!-- 时间节点 -->
        <div class="timeline-node">
          <div class="node-inner">
            <svg viewBox="0 0 24 24" class="node-icon">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 15H4V8h2v1c0 .55.45 1 1 1s1-.45 1-1V8h8v1c0 .55.45 1 1 1s1-.45 1-1V8h2v11z"/>
            </svg>
          </div>
          <div class="node-pulse"></div>
        </div>
        
        <!-- 经历内容 -->
        <div class="timeline-content">
          <div class="content-card">
            <div class="card-header">
              <h3 class="job-title">{{ experience.title }}</h3>
              <div class="job-meta">
                <span class="company">{{ experience.company }}</span>
                <span class="period">{{ experience.period }}</span>
              </div>
            </div>
            
            <p class="job-description">{{ experience.description }}</p>
            
            <div class="achievements" v-if="experience.achievements?.length">
              <h4 class="achievements-title">主要成就</h4>
              <ul class="achievements-list">
                <li 
                  v-for="achievement in experience.achievements" 
                  :key="achievement"
                  class="achievement-item"
                >
                  <svg viewBox="0 0 24 24" class="achievement-icon">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                  {{ achievement }}
                </li>
              </ul>
            </div>
            
            <div class="technologies" v-if="experience.technologies?.length">
              <h4 class="tech-title">使用技术</h4>
              <div class="tech-tags">
                <span 
                  v-for="tech in experience.technologies" 
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  experiences: {
    type: Array,
    required: true
  }
})

const timelineLine = ref(null)
const timelineItems = ref([])

// 初始化动画
const initAnimations = () => {
  // 时间线绘制动画
  gsap.fromTo(timelineLine.value, 
    {
      scaleY: 0,
      transformOrigin: 'top center'
    },
    {
      scaleY: 1,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: timelineLine.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    }
  )
  
  // 时间线项目动画
  timelineItems.value.forEach((item, index) => {
    const isAlternate = index % 2 === 1
    
    gsap.from(item, {
      duration: 0.8,
      x: isAlternate ? 100 : -100,
      opacity: 0,
      scale: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse'
      }
    })
    
    // 节点脉冲动画
    const pulse = item.querySelector('.node-pulse')
    gsap.to(pulse, {
      duration: 2,
      scale: 2,
      opacity: 0,
      repeat: -1,
      ease: 'power2.out',
      delay: index * 0.5
    })
  })
}

onMounted(() => {
  initAnimations()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.career-timeline {
  padding: var(--spacing-2xl) 0;
}

.timeline-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transform: translateX(-50%);
  z-index: 1;
  
  @include respond-to(md) {
    left: 50%;
  }
  
  @media (max-width: 767px) {
    left: 30px;
  }
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-3xl);
  display: flex;
  align-items: center;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @include respond-to(md) {
    &--alternate {
      flex-direction: row-reverse;
      
      .timeline-content {
        padding-right: var(--spacing-2xl);
        padding-left: 0;
        text-align: right;
        
        .content-card {
          margin-right: 0;
          margin-left: auto;
        }
      }
      
      .timeline-node {
        right: auto;
        left: 50%;
      }
    }
  }
  
  @media (max-width: 767px) {
    flex-direction: row;
    
    &--alternate {
      flex-direction: row;
      
      .timeline-content {
        padding-right: 0;
        padding-left: var(--spacing-xl);
        text-align: left;
        
        .content-card {
          margin-right: auto;
          margin-left: 0;
        }
      }
    }
  }
}

.timeline-node {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  
  @media (max-width: 767px) {
    left: 30px;
  }
}

.node-inner {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--bg-color);
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 3;
  
  .node-icon {
    width: 24px;
    height: 24px;
    fill: white;
  }
}

.node-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
  pointer-events: none;
}

.timeline-content {
  flex: 1;
  padding-left: var(--spacing-2xl);
  
  @include respond-to(md) {
    max-width: calc(50% - 30px);
  }
  
  @media (max-width: 767px) {
    padding-left: var(--spacing-xl);
    max-width: calc(100% - 80px);
  }
}

.content-card {
  @include card;
  max-width: 500px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 30px;
    left: -15px;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right: 15px solid var(--surface-color);
    
    @include respond-to(md) {
      .timeline-item--alternate & {
        left: auto;
        right: -15px;
        border-right: none;
        border-left: 15px solid var(--surface-color);
      }
    }
    
    @media (max-width: 767px) {
      left: -15px;
      border-right: 15px solid var(--surface-color);
      border-left: none;
    }
  }
}

.card-header {
  margin-bottom: var(--spacing-lg);
}

.job-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.job-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  
  @include respond-to(sm) {
    flex-direction: row;
    gap: var(--spacing-md);
  }
}

.company {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
}

.period {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  background: var(--surface-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  align-self: flex-start;
}

.job-description {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.achievements,
.technologies {
  margin-bottom: var(--spacing-lg);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.achievements-title,
.tech-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  
  .achievement-icon {
    width: 16px;
    height: 16px;
    fill: var(--primary-color);
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tech-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

// 响应式调整
@include respond-to(md) {
  .timeline-item--alternate {
    .achievements-list,
    .tech-tags {
      justify-content: flex-end;
    }
    
    .tech-tags {
      flex-direction: row-reverse;
    }
  }
}
</style>
