<template>
  <div class="skill-radar">
    <svg 
      ref="radarSvg" 
      class="radar-chart" 
      :width="size" 
      :height="size"
      viewBox="0 0 400 400"
    >
      <!-- 网格线 -->
      <g class="radar-grid">
        <!-- 同心圆 -->
        <circle 
          v-for="level in 5" 
          :key="level"
          :cx="200" 
          :cy="200" 
          :r="level * 30"
          fill="none"
          :stroke="gridColor"
          stroke-width="1"
          :opacity="0.3"
        />
        
        <!-- 轴线 -->
        <g v-for="(skill, index) in skills" :key="skill.name">
          <line
            :x1="200"
            :y1="200"
            :x2="getAxisEndX(index)"
            :y2="getAxisEndY(index)"
            :stroke="gridColor"
            stroke-width="1"
            :opacity="0.5"
          />
          
          <!-- 技能标签 -->
          <text
            :x="getLabelX(index)"
            :y="getLabelY(index)"
            :text-anchor="getLabelAnchor(index)"
            :dominant-baseline="getLabelBaseline(index)"
            class="skill-label"
            :fill="textColor"
          >
            {{ skill.name }}
          </text>
        </g>
      </g>
      
      <!-- 技能数据多边形 -->
      <polygon
        ref="dataPolygon"
        :points="dataPoints"
        :fill="fillColor"
        :stroke="strokeColor"
        stroke-width="3"
        fill-opacity="0.2"
        stroke-linejoin="round"
      />
      
      <!-- 数据点 -->
      <g class="data-points">
        <circle
          v-for="(point, index) in animatedPoints"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="6"
          :fill="strokeColor"
          stroke="white"
          stroke-width="2"
          class="data-point"
        >
          <!-- 悬停效果 -->
          <title>{{ skills[index].name }}: {{ skills[index].value }}%</title>
        </circle>
      </g>
      
      <!-- 动画路径 -->
      <circle
        v-for="(point, index) in animatedPoints"
        :key="`pulse-${index}`"
        :cx="point.x"
        :cy="point.y"
        r="6"
        :fill="strokeColor"
        fill-opacity="0.3"
        class="pulse-circle"
      />
    </svg>
    
    <!-- 图例 -->
    <div class="radar-legend">
      <div 
        v-for="skill in skills" 
        :key="skill.name"
        class="legend-item"
        @mouseenter="highlightSkill(skill.name)"
        @mouseleave="removeHighlight"
      >
        <div class="legend-color" :style="{ backgroundColor: strokeColor }"></div>
        <span class="legend-text">{{ skill.name }}</span>
        <span class="legend-value">{{ skill.value }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  skills: {
    type: Array,
    required: true
  },
  size: {
    type: Number,
    default: 400
  },
  maxValue: {
    type: Number,
    default: 100
  }
})

const radarSvg = ref(null)
const dataPolygon = ref(null)
const animatedValues = ref(props.skills.map(() => 0))

// 颜色配置
const gridColor = computed(() => 'var(--border-color)')
const textColor = computed(() => 'var(--text-color)')
const strokeColor = computed(() => 'var(--primary-color)')
const fillColor = computed(() => 'var(--primary-color)')

// 计算轴线端点
const getAxisEndX = (index) => {
  const angle = (index * 2 * Math.PI) / props.skills.length - Math.PI / 2
  return 200 + Math.cos(angle) * 150
}

const getAxisEndY = (index) => {
  const angle = (index * 2 * Math.PI) / props.skills.length - Math.PI / 2
  return 200 + Math.sin(angle) * 150
}

// 计算标签位置
const getLabelX = (index) => {
  const angle = (index * 2 * Math.PI) / props.skills.length - Math.PI / 2
  return 200 + Math.cos(angle) * 170
}

const getLabelY = (index) => {
  const angle = (index * 2 * Math.PI) / props.skills.length - Math.PI / 2
  return 200 + Math.sin(angle) * 170
}

const getLabelAnchor = (index) => {
  const x = getLabelX(index)
  if (x < 195) return 'end'
  if (x > 205) return 'start'
  return 'middle'
}

const getLabelBaseline = (index) => {
  const y = getLabelY(index)
  if (y < 195) return 'auto'
  if (y > 205) return 'hanging'
  return 'middle'
}

// 计算数据点坐标
const animatedPoints = computed(() => {
  return animatedValues.value.map((value, index) => {
    const angle = (index * 2 * Math.PI) / props.skills.length - Math.PI / 2
    const radius = (value / props.maxValue) * 150
    return {
      x: 200 + Math.cos(angle) * radius,
      y: 200 + Math.sin(angle) * radius
    }
  })
})

// 计算多边形点字符串
const dataPoints = computed(() => {
  return animatedPoints.value
    .map(point => `${point.x},${point.y}`)
    .join(' ')
})

// 动画启动
const startAnimation = () => {
  gsap.to(animatedValues.value, {
    duration: 2,
    ease: 'power2.out',
    stagger: 0.1,
    onUpdate: () => {
      // 触发响应式更新
      animatedValues.value = [...animatedValues.value]
    },
    ...props.skills.reduce((acc, skill, index) => {
      acc[index] = skill.value
      return acc
    }, {})
  })
  
  // 脉冲动画
  gsap.to('.pulse-circle', {
    duration: 2,
    scale: 2,
    opacity: 0,
    repeat: -1,
    ease: 'power2.out',
    stagger: 0.2
  })
}

// 技能高亮
const highlightSkill = (skillName) => {
  const index = props.skills.findIndex(skill => skill.name === skillName)
  if (index >= 0) {
    gsap.to(`.data-point:nth-child(${index + 1})`, {
      duration: 0.3,
      scale: 1.5,
      ease: 'back.out(1.7)'
    })
  }
}

const removeHighlight = () => {
  gsap.to('.data-point', {
    duration: 0.3,
    scale: 1,
    ease: 'power2.out'
  })
}

// 使用Intersection Observer触发动画
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )
  
  if (radarSvg.value) {
    observer.observe(radarSvg.value)
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.skill-radar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.radar-chart {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.skill-label {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-primary);
}

.data-point {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 0 8px var(--primary-color));
  }
}

.pulse-circle {
  pointer-events: none;
  transform-origin: center;
}

.radar-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  width: 100%;
  max-width: 600px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    transform: translateY(-2px);
  }
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-color);
}

.legend-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
}

// 响应式调整
@include respond-to(md) {
  .radar-legend {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include respond-to(lg) {
  .skill-radar {
    flex-direction: row;
    gap: var(--spacing-2xl);
    
    .radar-chart {
      flex-shrink: 0;
    }
    
    .radar-legend {
      flex: 1;
      grid-template-columns: 1fr;
      max-width: 300px;
    }
  }
}
</style>
