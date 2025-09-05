<template>
  <div class="skill-card" @mouseenter="animateProgress" ref="cardRef">
    <div class="skill-card__icon" :style="{ backgroundColor: skill.color }">
      <svg class="skill-icon" viewBox="0 0 24 24">
        <!-- Vue.js图标 -->
        <path v-if="skill.icon === 'vue'" d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0057,10.0057,0,0,0,12,2.2467Z"/>
        
        <!-- React图标 -->
        <circle v-else-if="skill.icon === 'react'" cx="12" cy="12" r="2"/>
        <path v-if="skill.icon === 'react'" d="M12,8a3,3,0,0,1,3,3 12.18,12.18,0,0,1,7.82,1.41c1.11.63,1.18,1.68.23,2.34-1.95,1.34-5.4.23-7.82-.45A12.18,12.18,0,0,1,12,16a3,3,0,0,1-3-3 12.18,12.18,0,0,1-7.82-1.41c-1.11-.63-1.18-1.68-.23-2.34C2.9,7.91,6.35,9,8.77,9.7A12.18,12.18,0,0,1,12,8Z"/>
        
        <!-- TypeScript图标 -->
        <rect v-else-if="skill.icon === 'typescript'" x="2" y="3" width="20" height="18" rx="2"/>
        <path v-if="skill.icon === 'typescript'" fill="white" d="M10,17 L8,15 L10,13 M14,13 L16,15 L14,17 M12,7 L9,21"/>
        
        <!-- Three.js图标 -->
        <polygon v-else-if="skill.icon === 'threejs'" points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
        
        <!-- Node.js图标 -->
        <path v-else-if="skill.icon === 'nodejs'" d="M12,1.85C11.73,1.85 11.45,1.92 11.22,2.05L3.78,6.35C3.31,6.63 3,7.15 3,7.71V16.29C3,16.85 3.31,17.37 3.78,17.65L5.73,18.77C6.68,19.23 7,19.24 7.44,19.24C8.84,19.24 9.65,18.39 9.65,16.91V8.44C9.65,8.32 9.55,8.22 9.43,8.22H8.5C8.37,8.22 8.27,8.32 8.27,8.44V16.91C8.27,17.57 7.59,18.22 6.5,17.67L4.45,16.5C4.38,16.46 4.34,16.37 4.34,16.29V7.71C4.34,7.62 4.38,7.54 4.45,7.5L11.89,3.2C11.95,3.17 12.05,3.17 12.11,3.2L19.55,7.5C19.62,7.54 19.66,7.62 19.66,7.71V16.29C19.66,16.37 19.62,16.46 19.55,16.5L12.11,20.8C12.05,20.83 11.95,20.83 11.89,20.8L10.16,19.83C10.11,19.8 10.06,19.76 10.06,19.71C10.06,19.65 10.11,19.61 10.16,19.58C10.5,19.36 10.58,19.32 10.97,19.1C11.024,19.073 11.078,19.066 11.13,19.08C11.18,19.1 11.23,19.13 11.28,19.15L12.89,20.04C12.95,20.07 13.05,20.07 13.11,20.04L20.55,15.74C20.88,15.55 21.1,15.21 21.1,14.83V9.17C21.1,8.79 20.88,8.45 20.55,8.26L13.11,3.96C12.74,3.74 12.26,3.74 11.89,3.96"/>
        
        <!-- WebGL图标 -->
        <polygon v-else-if="skill.icon === 'webgl'" points="12 2 2 7 12 12 22 7 12 2"/>
        <polygon v-if="skill.icon === 'webgl'" points="2 17 12 22 22 17 12 12 2 17"/>
        <polygon v-if="skill.icon === 'webgl'" points="2 7 12 12 2 17"/>
        
        <!-- 默认图标 -->
        <circle v-else cx="12" cy="12" r="10"/>
      </svg>
    </div>
    
    <h3 class="skill-card__name">{{ skill.name }}</h3>
    
    <div class="skill-card__progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ 
            width: `${animatedLevel}%`,
            backgroundColor: skill.color 
          }"
        ></div>
      </div>
      <span class="progress-text">{{ Math.round(animatedLevel) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  skill: {
    type: Object,
    required: true
  }
})

const cardRef = ref(null)
const animatedLevel = ref(0)
let hasAnimated = false

const animateProgress = () => {
  if (hasAnimated) return
  hasAnimated = true
  
  gsap.to(animatedLevel, {
    duration: 1.5,
    value: props.skill.level,
    ease: 'power2.out'
  })
}

// 使用Intersection Observer来触发动画
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            animateProgress()
          }, Math.random() * 500) // 随机延迟，创造错落效果
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )
  
  if (cardRef.value) {
    observer.observe(cardRef.value)
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.skill-card {
  @include card;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(var(--primary-color-rgb), 0.1),
      transparent
    );
    transition: left 0.8s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &__icon {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
    position: relative;
    z-index: 1;
    
    .skill-icon {
      width: 40px;
      height: 40px;
      fill: white;
    }
  }
  
  &__name {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-lg);
    color: var(--text-color);
  }
  
  &__progress {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--surface-color);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  
  .progress-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 2s infinite;
    }
  }
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  text-align: right;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// 悬停效果
.skill-card:hover {
  .skill-card__icon {
    transform: scale(1.1) rotate(5deg);
  }
  
  .progress-bar {
    transform: scale(1.02);
  }
}
</style>
