<template>
  <div class="css-animations">
    <!-- 动画效果选择器 -->
    <div class="animation-selector">
      <h3 class="selector-title">CSS 动画演示</h3>
      <div class="effect-buttons">
        <button
          v-for="effect in effects"
          :key="effect.key"
          class="effect-btn"
          :class="{ 'effect-btn--active': activeEffect === effect.key }"
          @click="setActiveEffect(effect.key)"
        >
          {{ effect.name }}
        </button>
      </div>
    </div>
    
    <!-- 动画展示区域 -->
    <div class="animation-stage">
      <!-- 3D 魔方 -->
      <div v-if="activeEffect === 'cube'" class="effect-container">
        <div class="cube-container" :class="{ 'cube-container--auto': autoRotate }">
          <div class="cube">
            <div class="cube-face cube-face--front">前</div>
            <div class="cube-face cube-face--back">后</div>
            <div class="cube-face cube-face--right">右</div>
            <div class="cube-face cube-face--left">左</div>
            <div class="cube-face cube-face--top">上</div>
            <div class="cube-face cube-face--bottom">下</div>
          </div>
        </div>
        
        <div class="cube-controls">
          <button @click="rotateCube('x')">绕X轴旋转</button>
          <button @click="rotateCube('y')">绕Y轴旋转</button>
          <button @click="rotateCube('z')">绕Z轴旋转</button>
          <label class="auto-rotate-label">
            <input v-model="autoRotate" type="checkbox" />
            自动旋转
          </label>
        </div>
      </div>
      
      <!-- 波浪效果 -->
      <div v-else-if="activeEffect === 'wave'" class="effect-container">
        <div class="wave-container">
          <div class="wave wave--1"></div>
          <div class="wave wave--2"></div>
          <div class="wave wave--3"></div>
          <div class="wave-text">CSS 波浪动画</div>
        </div>
      </div>
      
      <!-- 加载动画 -->
      <div v-else-if="activeEffect === 'loading'" class="effect-container">
        <div class="loading-showcase">
          <div class="loader loader--spinner">
            <div class="spinner-blade" v-for="i in 12" :key="i"></div>
          </div>
          
          <div class="loader loader--dots">
            <div class="dot" v-for="i in 3" :key="i"></div>
          </div>
          
          <div class="loader loader--pulse">
            <div class="pulse-ring" v-for="i in 3" :key="i"></div>
          </div>
          
          <div class="loader loader--bounce">
            <div class="bounce-ball" v-for="i in 3" :key="i"></div>
          </div>
        </div>
      </div>
      
      <!-- 卡片翻转 -->
      <div v-else-if="activeEffect === 'cards'" class="effect-container">
        <div class="cards-grid">
          <div 
            v-for="(card, index) in cardData" 
            :key="index"
            class="flip-card"
            :class="{ 'flip-card--flipped': card.flipped }"
            @click="flipCard(index)"
          >
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="card-icon">{{ card.icon }}</div>
                <h4>{{ card.title }}</h4>
              </div>
              <div class="flip-card-back">
                <p>{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 粒子文字 -->
      <div v-else-if="activeEffect === 'text'" class="effect-container">
        <div class="text-effects">
          <h2 class="glitch-text" data-text="GLITCH EFFECT">GLITCH EFFECT</h2>
          <h2 class="neon-text">NEON GLOW</h2>
          <h2 class="gradient-text">GRADIENT TEXT</h2>
          <h2 class="shadow-text">3D SHADOW</h2>
        </div>
      </div>
      
      <!-- 几何动画 -->
      <div v-else-if="activeEffect === 'geometry'" class="effect-container">
        <div class="geometry-animation">
          <div class="shape shape--triangle"></div>
          <div class="shape shape--square"></div>
          <div class="shape shape--circle"></div>
          <div class="shape shape--hexagon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      effect: 'cube',
      autoRotate: true
    })
  }
})

const activeEffect = ref(props.config.effect || 'cube')
const autoRotate = ref(props.config.autoRotate || false)
const cubeRotation = reactive({ x: 0, y: 0, z: 0 })

const effects = [
  { key: 'cube', name: '3D魔方' },
  { key: 'wave', name: '波浪效果' },
  { key: 'loading', name: '加载动画' },
  { key: 'cards', name: '卡片翻转' },
  { key: 'text', name: '文字效果' },
  { key: 'geometry', name: '几何动画' }
]

const cardData = reactive([
  { 
    icon: '🎨', 
    title: 'Design', 
    description: 'Creative visual design solutions',
    flipped: false 
  },
  { 
    icon: '💻', 
    title: 'Development', 
    description: 'Modern web development techniques',
    flipped: false 
  },
  { 
    icon: '🚀', 
    title: 'Performance', 
    description: 'Optimized and fast loading experiences',
    flipped: false 
  },
  { 
    icon: '🔧', 
    title: 'Tools', 
    description: 'Latest development tools and frameworks',
    flipped: false 
  }
])

const setActiveEffect = (effect) => {
  activeEffect.value = effect
  
  // 重置状态
  if (effect === 'cards') {
    cardData.forEach(card => card.flipped = false)
  }
}

const rotateCube = (axis) => {
  cubeRotation[axis] += 90
  
  const cube = document.querySelector('.cube')
  if (cube) {
    cube.style.transform = `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg) rotateZ(${cubeRotation.z}deg)`
  }
}

const flipCard = (index) => {
  cardData[index].flipped = !cardData[index].flipped
}

onMounted(() => {
  // 入场动画
  gsap.from('.animation-selector', {
    duration: 0.8,
    y: -30,
    opacity: 0,
    ease: 'power2.out'
  })
  
  gsap.from('.animation-stage', {
    duration: 1,
    scale: 0.9,
    opacity: 0,
    ease: 'back.out(1.7)',
    delay: 0.3
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.css-animations {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.animation-selector {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.selector-title {
  color: white;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.effect-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.effect-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &--active {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }
}

.animation-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.effect-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// 3D 魔方样式
.cube-container {
  perspective: 1000px;
  margin-bottom: var(--spacing-xl);
  
  &--auto .cube {
    animation: autoRotate 10s infinite linear;
  }
}

.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &--front {
    background: rgba(255, 99, 71, 0.8);
    transform: translateZ(100px);
  }
  
  &--back {
    background: rgba(54, 162, 235, 0.8);
    transform: rotateY(180deg) translateZ(100px);
  }
  
  &--right {
    background: rgba(255, 206, 86, 0.8);
    transform: rotateY(90deg) translateZ(100px);
  }
  
  &--left {
    background: rgba(75, 192, 192, 0.8);
    transform: rotateY(-90deg) translateZ(100px);
  }
  
  &--top {
    background: rgba(153, 102, 255, 0.8);
    transform: rotateX(90deg) translateZ(100px);
  }
  
  &--bottom {
    background: rgba(255, 159, 64, 0.8);
    transform: rotateX(-90deg) translateZ(100px);
  }
}

.cube-controls {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
  
  button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.auto-rotate-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: white;
  cursor: pointer;
  
  input[type="checkbox"] {
    cursor: pointer;
  }
}

@keyframes autoRotate {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

// 波浪效果
.wave-container {
  position: relative;
  width: 400px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  
  &--1 {
    animation: wave 3s ease-in-out infinite;
  }
  
  &--2 {
    animation: wave 3s ease-in-out infinite -1s;
  }
  
  &--3 {
    animation: wave 3s ease-in-out infinite -2s;
  }
}

.wave-text {
  position: relative;
  z-index: 10;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

@keyframes wave {
  0%, 100% { transform: translateX(-100%) skewX(0deg); }
  50% { transform: translateX(100%) skewX(-15deg); }
}

// 加载动画
.loading-showcase {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3xl);
  width: 100%;
  max-width: 500px;
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

// 旋转加载器
.loader--spinner {
  .spinner-blade {
    position: absolute;
    width: 3px;
    height: 20px;
    background: white;
    border-radius: 2px;
    animation: spinnerFade 1.2s linear infinite;
    
    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        transform: rotate(#{($i - 1) * 30}deg) translateY(-30px);
        animation-delay: #{($i - 1) * 0.1}s;
      }
    }
  }
}

@keyframes spinnerFade {
  0%, 39%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

// 点状加载器
.loader--dots {
  gap: var(--spacing-sm);
  
  .dot {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    animation: dotBounce 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

// 脉冲加载器
.loader--pulse {
  .pulse-ring {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid white;
    border-radius: 50%;
    animation: pulseRing 2s ease-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.7s; }
    &:nth-child(3) { animation-delay: 1.4s; }
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

// 弹跳加载器
.loader--bounce {
  gap: var(--spacing-sm);
  
  .bounce-ball {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    animation: ballBounce 2.1s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: -0.45s; }
    &:nth-child(2) { animation-delay: -0.3s; }
    &:nth-child(3) { animation-delay: -0.15s; }
  }
}

@keyframes ballBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

// 卡片翻转
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
  width: 100%;
  max-width: 600px;
}

.flip-card {
  background: transparent;
  width: 200px;
  height: 150px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  
  .flip-card--flipped & {
    transform: rotateY(180deg);
  }
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.flip-card-front {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.flip-card-back {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  transform: rotateY(180deg);
}

.card-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
}

// 文字效果
.text-effects {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  align-items: center;
}

.glitch-text {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: white;
  position: relative;
  animation: glitch 2s infinite;
  
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  &::before {
    animation: glitchBefore 3s infinite;
    color: #ff00c1;
    z-index: -1;
  }
  
  &::after {
    animation: glitchAfter 2s infinite;
    color: #00fff9;
    z-index: -2;
  }
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

@keyframes glitchBefore {
  0% { clip-path: inset(40% 0 61% 0); }
  20% { clip-path: inset(92% 0 1% 0); }
  40% { clip-path: inset(43% 0 1% 0); }
  60% { clip-path: inset(25% 0 58% 0); }
  80% { clip-path: inset(54% 0 7% 0); }
  100% { clip-path: inset(58% 0 43% 0); }
}

@keyframes glitchAfter {
  0% { clip-path: inset(25% 0 58% 0); }
  20% { clip-path: inset(54% 0 7% 0); }
  40% { clip-path: inset(58% 0 43% 0); }
  60% { clip-path: inset(40% 0 61% 0); }
  80% { clip-path: inset(92% 0 1% 0); }
  100% { clip-path: inset(43% 0 1% 0); }
}

.neon-text {
  color: #fff;
  text-shadow: 
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 15px #0073e6,
    0 0 20px #0073e6,
    0 0 35px #0073e6,
    0 0 40px #0073e6;
  animation: neonFlicker 2s infinite alternate;
}

@keyframes neonFlicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow: 
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 15px #0073e6,
      0 0 20px #0073e6,
      0 0 35px #0073e6,
      0 0 40px #0073e6;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}

.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.shadow-text {
  color: white;
  text-shadow: 
    1px 1px 0px #ccc,
    2px 2px 0px #c9c9c9,
    3px 3px 0px #bbb,
    4px 4px 0px #b9b9b9,
    5px 5px 0px #aaa,
    6px 6px 0px #a9a9a9,
    7px 7px 0px #999,
    8px 8px 0px #898989,
    9px 9px 0px #777,
    10px 10px 10px rgba(0,0,0,0.6),
    10px 10px 1px rgba(0,0,0,0.5);
}

// 几何动画
.geometry-animation {
  display: flex;
  gap: var(--spacing-3xl);
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.shape {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.8);
  
  &--triangle {
    width: 0;
    height: 0;
    background: transparent;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 80px solid rgba(255, 255, 255, 0.8);
    animation: triangleSpin 3s linear infinite;
  }
  
  &--square {
    animation: squarePulse 2s ease-in-out infinite;
  }
  
  &--circle {
    border-radius: 50%;
    animation: circleScale 2.5s ease-in-out infinite;
  }
  
  &--hexagon {
    width: 80px;
    height: 46px;
    background: rgba(255, 255, 255, 0.8);
    position: relative;
    
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 0;
      border-left: 40px solid transparent;
      border-right: 40px solid transparent;
    }
    
    &::before {
      bottom: 100%;
      border-bottom: 23px solid rgba(255, 255, 255, 0.8);
    }
    
    &::after {
      top: 100%;
      border-top: 23px solid rgba(255, 255, 255, 0.8);
    }
    
    animation: hexagonRotate 4s ease-in-out infinite;
  }
}

@keyframes triangleSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes squarePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes circleScale {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(0.8) rotate(180deg); }
}

@keyframes hexagonRotate {
  0%, 100% { transform: rotate(0deg) scale(1); }
  33% { transform: rotate(120deg) scale(1.1); }
  66% { transform: rotate(240deg) scale(0.9); }
}

// 响应式调整
@include respond-to(md) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .geometry-animation {
    gap: var(--spacing-2xl);
  }
}

@media (max-width: 768px) {
  .effect-buttons {
    gap: var(--spacing-xs);
  }
  
  .effect-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .cube {
    width: 150px;
    height: 150px;
  }
  
  .cube-face {
    width: 150px;
    height: 150px;
    font-size: var(--font-size-lg);
  }
  
  .cube-face--front { transform: translateZ(75px); }
  .cube-face--back { transform: rotateY(180deg) translateZ(75px); }
  .cube-face--right { transform: rotateY(90deg) translateZ(75px); }
  .cube-face--left { transform: rotateY(-90deg) translateZ(75px); }
  .cube-face--top { transform: rotateX(90deg) translateZ(75px); }
  .cube-face--bottom { transform: rotateX(-90deg) translateZ(75px); }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .loading-showcase {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}
</style>
