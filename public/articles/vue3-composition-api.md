# Vue 3 Composition API 最佳实践

Vue 3 的 Composition API 为我们提供了更灵活的方式来组织和复用组件逻辑。本文将深入探讨其使用技巧和最佳实践。

## 基本概念

Composition API 的核心是 `setup` 函数，它在组件创建之前执行，为我们提供了一个统一的入口来定义组件的响应式状态、计算属性、方法等。

```javascript
import { ref, reactive, computed, watch } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({ name: 'Vue 3' })
    
    const doubleCount = computed(() => count.value * 2)
    
    watch(count, (newVal, oldVal) => {
      console.log(`Count changed from ${oldVal} to ${newVal}`)
    })
    
    return {
      count,
      state,
      doubleCount
    }
  }
}
```

## 逻辑复用

使用组合式函数（Composables）来实现逻辑复用是 Composition API 的一大优势：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  const isEven = computed(() => count.value % 2 === 0)
  
  return {
    count,
    increment,
    decrement,
    reset,
    isEven
  }
}
```

## 状态管理

对于复杂的状态管理，可以结合 Pinia 使用：

```javascript
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  
  const login = async (credentials) => {
    // 登录逻辑
    user.value = await api.login(credentials)
  }
  
  const logout = () => {
    user.value = null
  }
  
  return {
    user,
    isLoggedIn,
    login,
    logout
  }
})
```

## 最佳实践

1. **合理使用 ref 和 reactive**
   - 基本类型使用 `ref`
   - 对象类型使用 `reactive`

2. **组合式函数命名**
   - 以 `use` 开头
   - 使用驼峰命名法

3. **避免过度抽象**
   - 不要为了复用而复用
   - 保持代码的可读性

4. **类型安全**
   - 使用 TypeScript 获得更好的开发体验
   - 为组合式函数添加类型定义

## 总结

Composition API 为 Vue 3 带来了更强大的逻辑组织和复用能力。通过合理使用这些特性，我们可以编写出更加清晰、可维护的代码。
