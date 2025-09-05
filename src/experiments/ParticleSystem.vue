<template>
  <div class="particle-system">
    <canvas 
      ref="canvas" 
      class="particle-canvas"
      @mousemove="handleMouseMove"
      @click="handleClick"
    ></canvas>
    
    <!-- 控制面板 -->
    <div class="controls">
      <h3 class="controls-title">粒子系统控制</h3>
      
      <div class="control-group">
        <label>粒子数量: {{ particleCount }}</label>
        <input 
          v-model="particleCount" 
          type="range" 
          min="1000" 
          max="20000" 
          step="1000"
          @input="updateParticleCount"
        />
      </div>
      
      <div class="control-group">
        <label>速度: {{ speed.toFixed(1) }}</label>
        <input 
          v-model="speed" 
          type="range" 
          min="0.1" 
          max="5.0" 
          step="0.1"
        />
      </div>
      
      <div class="control-group">
        <label>交互半径: {{ interactionRadius }}</label>
        <input 
          v-model="interactionRadius" 
          type="range" 
          min="50" 
          max="300" 
          step="10"
        />
      </div>
      
      <div class="control-group">
        <label>颜色模式:</label>
        <select v-model="colorMode" @change="updateColors">
          <option value="rainbow">彩虹</option>
          <option value="blue">蓝色</option>
          <option value="warm">暖色</option>
          <option value="cool">冷色</option>
        </select>
      </div>
      
      <button @click="resetParticles" class="reset-btn">
        重置粒子
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      particleCount: 10000,
      interactive: true,
      colors: ['#ffffff', '#87CEEB', '#FFB6C1']
    })
  }
})

const canvas = ref(null)
const particleCount = ref(props.config.particleCount || 10000)
const speed = ref(1.0)
const interactionRadius = ref(150)
const colorMode = ref('rainbow')

let ctx, particles = [], mouse = { x: 0, y: 0 }, animationId

class Particle {
  constructor(x, y) {
    this.x = x || Math.random() * canvas.value.width
    this.y = y || Math.random() * canvas.value.height
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.radius = Math.random() * 3 + 1
    this.color = this.getRandomColor()
    this.originalColor = this.color
    this.life = 1
    this.decay = Math.random() * 0.02 + 0.005
  }
  
  getRandomColor() {
    const colors = {
      rainbow: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'],
      blue: ['#74b9ff', '#0984e3', '#00b894', '#00cec9'],
      warm: ['#ff7675', '#fd79a8', '#e17055', '#fdcb6e'],
      cool: ['#74b9ff', '#81ecec', '#00b894', '#a29bfe']
    }
    const colorArray = colors[colorMode.value] || colors.rainbow
    return colorArray[Math.floor(Math.random() * colorArray.length)]
  }
  
  update() {
    // 鼠标交互
    if (props.config.interactive) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < interactionRadius.value) {
        const force = (interactionRadius.value - distance) / interactionRadius.value
        const angle = Math.atan2(dy, dx)
        this.vx -= Math.cos(angle) * force * 0.5
        this.vy -= Math.sin(angle) * force * 0.5
      }
    }
    
    // 更新位置
    this.x += this.vx * speed.value
    this.y += this.vy * speed.value
    
    // 边界检测
    if (this.x < 0 || this.x > canvas.value.width) this.vx *= -1
    if (this.y < 0 || this.y > canvas.value.height) this.vy *= -1
    
    // 边界约束
    this.x = Math.max(0, Math.min(canvas.value.width, this.x))
    this.y = Math.max(0, Math.min(canvas.value.height, this.y))
    
    // 生命周期
    this.life -= this.decay
    if (this.life <= 0) {
      this.life = 1
      this.x = Math.random() * canvas.value.width
      this.y = Math.random() * canvas.value.height
      this.color = this.getRandomColor()
    }
    
    // 阻尼
    this.vx *= 0.99
    this.vy *= 0.99
  }
  
  draw() {
    ctx.save()
    ctx.globalAlpha = this.life * 0.8
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    
    // 添加光晕效果
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 3
    )
    gradient.addColorStop(0, this.color + '40')
    gradient.addColorStop(1, this.color + '00')
    
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.restore()
  }
}

const initCanvas = () => {
  const canvasEl = canvas.value
  if (!canvasEl) return
  
  ctx = canvasEl.getContext('2d')
  resizeCanvas()
  
  // 创建粒子
  particles = []
  for (let i = 0; i < particleCount.value; i++) {
    particles.push(new Particle())
  }
}

const resizeCanvas = () => {
  const canvasEl = canvas.value
  if (!canvasEl) return
  
  canvasEl.width = canvasEl.offsetWidth
  canvasEl.height = canvasEl.offsetHeight
}

const animate = () => {
  ctx.fillStyle = 'rgba(10, 10, 10, 0.1)'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  
  particles.forEach(particle => {
    particle.update()
    particle.draw()
  })
  
  // 绘制鼠标交互区域
  if (props.config.interactive) {
    ctx.save()
    ctx.globalAlpha = 0.1
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, interactionRadius.value, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()
  }
  
  animationId = requestAnimationFrame(animate)
}

const handleMouseMove = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = event.clientX - rect.left
  mouse.y = event.clientY - rect.top
}

const handleClick = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const clickY = event.clientY - rect.top
  
  // 在点击位置创建爆炸效果
  for (let i = 0; i < 50; i++) {
    const angle = (Math.PI * 2 * i) / 50
    const velocity = Math.random() * 10 + 5
    const particle = new Particle(clickX, clickY)
    particle.vx = Math.cos(angle) * velocity
    particle.vy = Math.sin(angle) * velocity
    particle.radius = Math.random() * 5 + 2
    particles.push(particle)
  }
  
  // 移除多余的粒子
  if (particles.length > particleCount.value * 1.5) {
    particles.splice(0, particles.length - particleCount.value)
  }
}

const updateParticleCount = () => {
  const diff = particleCount.value - particles.length
  
  if (diff > 0) {
    // 添加粒子
    for (let i = 0; i < diff; i++) {
      particles.push(new Particle())
    }
  } else if (diff < 0) {
    // 移除粒子
    particles.splice(0, Math.abs(diff))
  }
}

const updateColors = () => {
  particles.forEach(particle => {
    particle.color = particle.getRandomColor()
  })
}

const resetParticles = () => {
  particles.forEach(particle => {
    particle.x = Math.random() * canvas.value.width
    particle.y = Math.random() * canvas.value.height
    particle.vx = (Math.random() - 0.5) * 2
    particle.vy = (Math.random() - 0.5) * 2
    particle.life = 1
    particle.color = particle.getRandomColor()
  })
}

onMounted(() => {
  initCanvas()
  animate()
  
  window.addEventListener('resize', resizeCanvas)
  
  // 入场动画
  gsap.from('.particle-canvas', {
    duration: 1,
    opacity: 0,
    scale: 0.8,
    ease: 'power2.out'
  })
  
  gsap.from('.controls', {
    duration: 0.8,
    x: -50,
    opacity: 0,
    ease: 'power2.out',
    delay: 0.5
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.particle-system {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.particle-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  display: block;
}

.controls {
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: white;
  min-width: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.controls-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
  color: #fff;
  text-align: center;
}

.control-group {
  margin-bottom: var(--spacing-md);
  
  label {
    display: block;
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
    color: #ccc;
  }
  
  input[type="range"] {
    width: 100%;
    margin: var(--spacing-xs) 0;
    background: transparent;
    cursor: pointer;
    
    &::-webkit-slider-track {
      background: rgba(255, 255, 255, 0.2);
      height: 4px;
      border-radius: 2px;
    }
    
    &::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      border: 2px solid white;
    }
    
    &::-moz-range-track {
      background: rgba(255, 255, 255, 0.2);
      height: 4px;
      border-radius: 2px;
      border: none;
    }
    
    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      border: 2px solid white;
    }
  }
  
  select {
    width: 100%;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-md);
    color: white;
    font-size: var(--font-size-sm);
    
    option {
      background: #1a1a1a;
      color: white;
    }
  }
}

.reset-btn {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-color);
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// 响应式调整
@include respond-to(md) {
  .controls {
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .controls {
    position: relative;
    top: auto;
    left: auto;
    margin: var(--spacing-lg);
    min-width: auto;
  }
  
  .particle-system {
    flex-direction: column;
    display: flex;
  }
  
  .particle-canvas {
    flex: 1;
    min-height: 300px;
  }
}
</style>
