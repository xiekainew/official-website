<template>
  <span class="typewriter">{{ displayText }}<span class="cursor" :class="{ 'cursor--blink': showCursor }">|</span></span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    required: true
  },
  speed: {
    type: Number,
    default: 100
  },
  pause: {
    type: Number,
    default: 2000
  },
  loop: {
    type: Boolean,
    default: true
  }
})

const displayText = ref('')
const showCursor = ref(true)
let currentTextIndex = 0
let currentCharIndex = 0
let isDeleting = false
let typewriterInterval = null
let cursorInterval = null

const typeWriter = () => {
  const currentText = props.texts[currentTextIndex]
  
  if (!isDeleting) {
    // 打字效果
    if (currentCharIndex < currentText.length) {
      displayText.value = currentText.substring(0, currentCharIndex + 1)
      currentCharIndex++
      setTimeout(typeWriter, props.speed)
    } else {
      // 完成当前文本，暂停后开始删除
      setTimeout(() => {
        isDeleting = true
        typeWriter()
      }, props.pause)
    }
  } else {
    // 删除效果
    if (currentCharIndex > 0) {
      displayText.value = currentText.substring(0, currentCharIndex - 1)
      currentCharIndex--
      setTimeout(typeWriter, props.speed / 2)
    } else {
      // 完成删除，切换到下一个文本
      isDeleting = false
      currentTextIndex = (currentTextIndex + 1) % props.texts.length
      
      if (props.loop || currentTextIndex !== 0) {
        setTimeout(typeWriter, props.speed)
      }
    }
  }
}

const startCursorBlink = () => {
  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
}

const stopCursorBlink = () => {
  if (cursorInterval) {
    clearInterval(cursorInterval)
    cursorInterval = null
  }
}

onMounted(() => {
  if (props.texts.length > 0) {
    typeWriter()
    startCursorBlink()
  }
})

onUnmounted(() => {
  if (typewriterInterval) {
    clearTimeout(typewriterInterval)
  }
  stopCursorBlink()
})
</script>

<style lang="scss" scoped>
.typewriter {
  display: inline-block;
  min-height: 1.2em;
  
  .cursor {
    display: inline-block;
    color: var(--primary-color);
    font-weight: var(--font-weight-normal);
    animation: blink 1s infinite;
    
    &--blink {
      animation: blink 1s infinite;
    }
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>
